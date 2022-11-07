import { Component, Host, h, Prop, Watch } from '@stencil/core';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { DragPan, MouseWheelZoom, defaults } from 'ol/interaction';
import { mouseOnly } from 'ol/events/condition';
import VectorSource from 'ol/source/Vector';
import { Style, Stroke, Fill, Text, Circle } from 'ol/style';
import Cluster from 'ol/source/Cluster';
import Vector from 'ol/source/Vector';
import AnimatedCluster from 'ol-ext/layer/AnimatedCluster'
import SelectCluster from 'ol-ext/interaction/SelectCluster'
import Popup from 'ol-ext/overlay/Popup'

// import convexHull from 'ol-ext/geom/ConvexHull'
// import Circle from 'ol/style/Circle';
// import { Pointer } from 'ol/interaction';
// import {Icon, Style} from 'ol/style';
// import { Style } from 'ol/style';
// import Polygon from 'ol/geom/Polygon'

import {Vector as VectorLayer} from 'ol/layer';
import { MappingService } from '../../../services/mapping.service';

// // Addfeatures to the cluster
// function addFeatures(map, clusterSource, nb) {
//   var ext = map.getView().calculateExtent(map.getSize());
//   var features = [];
//   for (let i = 0; i< nb; ++i) {
//     features[i]= new Feature(new Point([ext[0]+(ext[2]-ext[0])*Math.random(), ext[1]+(ext[3]-ext[1])*Math.random()]));
//     features[i].set('id',i);
//   }
//   clusterSource.getSource().clear();
//   clusterSource.getSource().addFeatures(features);
// }

// Style for the clusters
// var styleCache = {};
// function getStyle2 (feature) {
//   var size = feature.get('features').length;
//   var style = styleCache[size];
//   if (!style) {
//     const color = size>25 ? "192,0,0" : size>8 ? "255,128,0" : "0,128,0";
//     const radius = Math.max(8, Math.min(size*0.75, 20));
//     // const _dash: any = 2*Math.PI*radius/6;
//     // var dash = [ 0, _dash, _dash, _dash, _dash, _dash, _dash ];
//     style = styleCache[size] = new Style({
//       image: new Circle({
//         radius: radius,
//         stroke: new Stroke({
//           color: "rgba("+color+",0.5)", 
//           width: 15 ,
//           // lineDash: dash,
//           // lineCap: "butt"
//         }),
//         fill: new Fill({
//           color:"rgba("+color+",1)"
//         })
//       }),
//       text: new Text({
//         text: size.toString(),
//         //font: 'bold 12px comic sans ms',
//         //textBaseline: 'top',
//         fill: new Fill({
//           color: '#fff'
//         })
//       })
//     });
//   }
//   return style;
// }
const styleCache = {};
function getStyle(t) {
  let size = t.get("features").length
  let style = styleCache[size];
  if (!style) {
    const t = size > 25 ? "192,0,0" : size > 8 ? "255,128,0" : "0,128,0"
    const o = Math.max(8, Math.min(.75 * size, 20));

    console.log({o})
    style = styleCache[size] = new Style({
      image: new Circle({
        radius: o,
        stroke: new Stroke({
          color: "rgba(" + t + ",0.5)",
          width: 15,
          lineCap: "butt"
        }),
        fill: new Fill({
          color: "rgba(" + t + ",1)"
        })
      }),
      text: new Text({
        text: size.toString(),
        fill: new Fill({
          color: "#fff"
        })
      })
    })
  }
  return [style]
}

const Kt = (t, e, i) => {
  const o = `\n  <b>ID: </b>${i.id}</br>\n  <b><ion-icon size="small" name="time-outline"></ion-icon> </b>${i.$$date}<br>\n  <ion-icon size="small" name="globe-outline"></ion-icon><span class="origin-name">${i.origin}</span><br>\n  <img class="icon-type" src="${i.medium_url}"/><br/>\n\n  <h1>Measurements</h1>\n  <ion-grid>\n    <ion-row>\n      <ion-col size="6">\n        <b>Type</b>\n      </ion-col>\n      <ion-col size="6">\n        <b>Value</b>\n      </ion-col>\n    </ion-row>\n    ${(i.measurements || []).map(t=>`\n      <ion-row>\n        <ion-col size="6">\n          ${t.measurementUnit || t.measurementType}\n        </ion-col>\n        <ion-col size="6">\n          ${t.measurementValue}\n        </ion-col>\n      </ion-row>`).join("")}\n  </ion-grid>\n  `;
  console.log({t, e, o})
  t.show(e, o)
}

function addFeatures(t, e) {
  const i = t.map(t => {
    const f: any = new Feature(new Point(fromLonLat([t.decimalLongitude, t.decimalLatitude])));
    f.id = t.id
    return f
  })

  e.getSource().clear()
  e.getSource().addFeatures(i)
}

@Component({
  tag: 'page-map',
  styleUrl: 'page-map.css',
  shadow: false,
})
export class PageMap {

  @Prop() items: any[];
  @Prop() interactions: boolean;
  el: any;
  map: any
  popup: any

  constructor() {
    this.interactions = !1
  }

  loadMap() {
    if (this.map) return null

    const vectorSource = new VectorSource({
      features: [],
    });
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    this.map = new Map({
      interactions: !this.interactions ? defaults({dragPan: false, mouseWheelZoom: false}).extend([
        new DragPan({
          condition: function (event) {
            return mouseOnly(event); //this.getPointerCount() === 2 || mouseOnly(event);
          },
        }),
        new MouseWheelZoom({
          condition: mouseOnly,
        }),
      ]) : null,
      view: new View({
        center: fromLonLat([-3, 40]),
        zoom: 6
      }),
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vectorLayer
      ],
      target: this.el
    });

    this.process(this.map)


    const popup = new Popup()
    this.popup = popup
    this.map.addOverlay(popup)

    this.map.on('click', t => {
      const [e] = this.map.getFeaturesAtPixel(t.pixel);
      if (e && !0 === e.values_.selectclusterfeature) {
        const [o] = e.values_.features
        const n = this.items.find(t=>t.id === o.id);
        MappingService.getById(n.id).then(e=>{
          Kt(popup, t.coordinate, e)
        }
        ),
        Kt(popup, t.coordinate, n)
      } else if (e && 1 === e.values_.features.length) {
        const [o] = e.values_.features
        const n = this.items.find(t=>t.id === o.id);

        MappingService.getById(n.id).then(e=>{
          Kt(popup, t.coordinate, e)
        })
        Kt(popup, t.coordinate, n)
      } else {
        this.popup.hide()
      }
    })
  }

  clusterSource: any
  process(map) {
    // Cluster Source
    const clusterSource = new Cluster({
      distance: 40,
      source: new Vector()
    });
    this.clusterSource = clusterSource
    // Animated cluster layer
    const clusterLayer = new AnimatedCluster({
      // name: 'Cluster',
      source: clusterSource,
      animationDuration: 500,
      // Cluster style
      style: getStyle
    });
    map.addLayer(clusterLayer);
    // add 2000 features
    // addFeatures(map, clusterSource, 2000);


    // Style for selection
    const img0 = new Circle({
      radius: 5,
      stroke: new Stroke({
        color:"rgba(88,88,88,.9)", 
        width:1 
      }),
      fill: new Fill({
        color:"rgba(88,88,88,.9)"
      })
    });

    const img1 = new Circle({
      radius: 5,
      stroke: new Stroke({
        color: "rgba(53,164,108,.9)",
        width: 1
      }),
      fill: new Fill({
        color: "rgba(63,174,118,0.5)"
      })
    });

    const style0 = new Style({
      image: img0,
      stroke: new Stroke({
        color: "rgba(63,174,118,0.5)",
        width: 1
      })
    })

    const style1 = new Style({
      image: img1,
      // Draw a link beetween points (or not)
      stroke: new Stroke({
        color: "#666",
        width: 1
      })
    });

    const circleSelection = new Circle({
      radius: 7,
      stroke: new Stroke({
        color: "rgba(255,0,0,1)",
        width: 1
      }),
      fill: new Fill({
        color: "rgba(255,0,0,0.3)"
      })
    })
    const pointSelection = new Style({
      image: circleSelection,
      stroke: new Stroke({
        color:"#888", 
        width:1
      })
    })
    // Select interaction to spread cluster out and select features
    const selectCluster = new SelectCluster({
      // Point radius: to calculate distance between the features
      pointRadius: 10,
      // circleMaxObjects: 40,
      spiral: true,
      // autoClose: true,
      animate: true,
      // Feature style when it springs apart
      featureStyle: function(t) {
        const e = t.getProperties();
        return e && e.features && e.features[0] && e.features[0].id.includes("odour") ? [style1] : [style0]
      },
      // selectCluster: false,  // disable cluster selection
      // Style to draw cluster when selected
      style: (f) => {
        const cluster = f.get('features');
        return cluster.length <= 1 ? pointSelection : new Style({
          image: new Circle({
            stroke: new Stroke({
              color: "rgba(0,0,192,0.9)",
              width: 2
            }),
            fill: new Fill({
              color: "rgba(0,0,192,0.5)"
            }),
            radius: 5
          })
        })
      }
    });
    map.addInteraction(selectCluster);

    addFeatures(this.items, this.clusterSource)
  }

  @Watch('items')
  onItems() {
    console.log({
      items: this.items
    })
    addFeatures(this.items, this.clusterSource)
  }
  componentDidLoad() {
    setTimeout(()=> this.loadMap(), 400)
  }

  render() {
    return (
      <Host>
        <div class="map" ref={(el) => this.el = el}></div>
        <p class={"legend" + (this.interactions ? " interactions" : "")}>
          <ul class="circle-legend">
            <li class="circle canairio">CanAirIO</li>
            <li class="circle odourcollect">OdourCollect</li>
          </ul>
        </p>
      </Host>
    );
  }

}
