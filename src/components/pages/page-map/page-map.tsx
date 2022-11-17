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

import {Vector as VectorLayer} from 'ol/layer';
import { MappingService } from '../../../services/mapping.service';

const styleCache = {};
function getStyle(t) {
  let size = t.get("features").length
  let style = styleCache[size];
  if (!style) {
    const t = size > 25 ? "192,0,0" : size > 8 ? "255,128,0" : "0,128,0"
    const o = Math.max(8, Math.min(.75 * size, 20));

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

const showPopup = (popup, coordinates, item) => {
  const content = `
  <b>ID: </b>${item.id}</br>
  <b><ion-icon size="small" name="time-outline"></ion-icon> </b>${item.$$date}<br>
  <ion-icon size="small" name="globe-outline"></ion-icon>
  <span class="origin-name">${item.origin}</span><br>
  <ion-icon class="comments" size="small" name="chatbubbles-outline"></ion-icon>
  <span class="comments origin-name">Comments (${item.comments_count})</span><br>
  <img class="icon-type" src="${item.medium_url}"/><br/>

  <h1>Measurements</h1>
  <ion-grid>
    <ion-row>
      <ion-col size="6">
        <b>Type</b>
      </ion-col>
      <ion-col size="6">
        <b>Value</b>
      </ion-col>
    </ion-row>
    ${(item.measurements || []).map(t=>`
      <ion-row>
        <ion-col size="6">
          ${t.measurementUnit || t.measurementType}
        </ion-col>
        <ion-col size="6">
          ${t.measurementValue}
        </ion-col>
      </ion-row>`).join("")}
  </ion-grid>`
  popup.show(coordinates, content)
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


    const popup: any = new Popup()
    this.popup = popup
    this.map.addOverlay(popup)

    this.map.on('click', t => {
      const [e] = this.map.getFeaturesAtPixel(t.pixel);
      if (e && !0 === e.values_.selectclusterfeature) {
        const [o] = e.values_.features
        const n = this.items.find(t=>t.id === o.id);
        MappingService.getById(n.id).then(e => {
          showPopup(popup, t.coordinate, e)
        })
        showPopup(popup, t.coordinate, n)
        this.popupEvents(popup, n.id)
      } else if (e && 1 === e.values_.features.length) {
        const [o] = e.values_.features
        const n = this.items.find(t=>t.id === o.id);

        MappingService.getById(n.id).then(e=>{
          showPopup(popup, t.coordinate, e)
        })
        showPopup(popup, t.coordinate, n)
        this.popupEvents(popup, n.id)
      } else {
        this.popup.hide()
      }
    })
  }

  popupEvents(popup, id) {
    setTimeout(() => {
      popup.content.querySelectorAll('.comments').forEach(node => {
        node.addEventListener('click', () => {
          this.openComments(id)
        }, true)
      })
    }, 500)
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
    addFeatures(this.items, this.clusterSource)
  }
  componentDidLoad() {
    setTimeout(() => this.loadMap(), 400)
  }

  comments: any[]
  async openComments(id) {
    const [origin, idx] = id.split('-')
    this.comments = await MappingService.getComments(idx, origin)
    .then(comments => {
      return comments.sort((a:any, b:any) => Date.parse(a.created_at) - Date.parse(b.created_at))
    })
    const modalElement: any = document.createElement('ion-modal');
    modalElement.component = 'modal-comments';
    modalElement.id = 'modal-comments'
    modalElement.componentProps = {
      id,
      item: { id },
      items: this.comments,
      callback: (that, item) => this.renderComments(that, {
        item,
        items: this.comments,
      })
    }

    // present the modal
    document.body.appendChild(modalElement);
    modalElement.present();
    await modalElement.onWillDismiss()
  }

  renderComments(that, data) {
    that.items = [...data.items, data.item]
    // modalElement.componentProps.items = [...data.items, data.item]
    // modalElement.componentProps = {...modalElement.componentProps}
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
