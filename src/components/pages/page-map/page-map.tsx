import { Component, Host, h, Prop, Watch } from '@stencil/core';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';

import VectorSource from 'ol/source/Vector';
import { Style, Circle, Stroke, Fill, Text } from 'ol/style';
import { Vector as VectorLayer } from 'ol/layer';
import Point from 'ol/geom/Point';

import Cluster from 'ol/source/Cluster'
import AnimatedCluster from 'ol-ext/layer/AnimatedCluster'
import SelectCluster from 'ol-ext/interaction/SelectCluster'

import Popup from 'ol-popup'
import { MappingService } from '../../../services/mapping.service';

import {DragPan, MouseWheelZoom, defaults} from 'ol/interaction';
import {platformModifierKeyOnly} from 'ol/events/condition';

const popupShow = (popup, coordinate, item) => {
  const measurements = item.measurements || []
  const template = `
  <b>ID: </b>${item.id}</br>
  <b><ion-icon size="small" name="time-outline"></ion-icon> </b>${item.$$date}<br>
  <ion-icon size="small" name="globe-outline"></ion-icon><span class="origin-name">${item.origin}</span><br>
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
    ${measurements.map(item => `
      <ion-row>
        <ion-col size="6">
          ${item.measurementUnit || item.measurementType}
        </ion-col>
        <ion-col size="6">
          ${item.measurementValue}
        </ion-col>
      </ion-row>`
    ).join('')}
  </ion-grid>
  `

  popup.show(coordinate, template)
}

function addItems(items, clusterSource) {
  const features = items.map(item => {
    const f = new Feature(
      new Point(fromLonLat([
        item.decimalLongitude,
        item.decimalLatitude
      ]))
    )
    f.id = item.id
    return f
  })
  clusterSource.getSource().clear();
  clusterSource.getSource().addFeatures(features);
}

// Style for the clusters
const styleCache = {};
function getStyle(feature, _resolution) {
  let size = feature.get('features').length;
  let style = styleCache[size];
  if (!style) {
    const color = size > 25 ? "192,0,0" : size > 8 ? "255,128,0" : "0,128,0";
    const radius = Math.max(8, Math.min(size * 0.75, 20));
    // let dash: any = 2 * Math.PI * radius / 6;
    // dash = [ 0, dash, dash, dash, dash, dash, dash ];
    style = styleCache[size] = new Style(
      {
        image: new Circle(
          {
            radius: radius,
            stroke: new Stroke(
              {
                color: "rgba(" + color + ",0.5)", 
                width: 15,
                // lineDash: dash,
                lineCap: "butt"
              }),
            fill: new Fill(
              {
                color: "rgba(" + color + ",1)"
              })
          }),
        text: new Text(
          {
            text: size.toString(),
            fill: new Fill(
              {
                color: '#fff'
              })
          })
      });
  }
  return [style];
}

@Component({
  tag: 'page-map',
  styleUrl: 'page-map.css',
  shadow: false
})
export class PageMap {

  el: any;
  map: any;
  clusterSource: any;

  @Prop() items: any[]
  @Prop() interactions = false

  loadMap() {

    const vectorSource = new VectorSource({
      features: [],
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    if (this.map) return null
    this.map = new Map({
      interactions: this.interactions ? defaults({dragPan: false, mouseWheelZoom: false}).extend([
        new DragPan({
          condition: function (event) {
            return this.getPointerCount() === 2 || platformModifierKeyOnly(event);
          },
        }),
        new MouseWheelZoom({
          condition: platformModifierKeyOnly,
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

    const popup = new Popup();
    this.map.addOverlay(popup)

    this.map.on("click", (event) => {
      const [feature] = this.map.getFeaturesAtPixel(event.pixel);

      if (feature && feature.values_.selectclusterfeature === true) {
        const [point] = feature.values_.features

        const item = this.items.find(i => i.id === point.id)

        MappingService.getById(item.id)
        .then(item => {
          popupShow(popup, event.coordinate, item)
        })
        popupShow(popup, event.coordinate, item)
      } else if (feature && feature.values_.features.length === 1) {
        const [point] = feature.values_.features

        const item = this.items.find(i => i.id === point.id)

        MappingService.getById(item.id)
        .then(item => {
          popupShow(popup, event.coordinate, item)
        })
        popupShow(popup, event.coordinate, item)
      } else {
        popup.hide()
      }

    });


    this.process()
  }

  process() {
    // Cluster Source
    const clusterSource = new Cluster({
      distance: 40,
      source: new VectorSource()
    });
    this.clusterSource = clusterSource
    // Animated cluster layer
    const clusterLayer = new AnimatedCluster({
      name: 'Cluster',
      source: clusterSource,
      animationDuration: 700,
      // Cluster style
      style: getStyle
    });
    this.map.addLayer(clusterLayer);
    // add 2000 features
    // addFeatures(200, this.map, clusterSource);
    // addItems(this.items, clusterSource)

    const canairio = new Circle({
      radius: 5,
      stroke: new Stroke({
        color: "rgba(66,66,66,.9)", 
        width: 1 
      }),
      fill: new Fill({
        color: "rgba(33,33,33,0.5)"
      })
    });
    const canairioStyle = new Style({
      image: canairio,
      // Draw a link beetween points (or not)
      stroke: new Stroke({
        color: "#666", 
        width: 1 
      }) 
    });

    const odourcollect = new Circle({
      radius: 5,
      stroke: new Stroke({
        color: "rgba(53,164,108,.9)", 
        width: 1 
      }),
      fill: new Fill({
        color: "rgba(63,174,118,0.5)"
      })
    });
    const odourcollectStyle = new Style({
      image: odourcollect,
      // Draw a link beetween points (or not)
      stroke: new Stroke({
        color: "#666", 
        width: 1 
      }) 
    });


    // const odoustyle1 = new Style({
    //   image: odourcollectStyle,
    //   // Draw a link beetween points (or not)
    //   stroke: new Stroke({
    //     color: "#666", 
    //     width: 1 
    //   }) 
    // });
    // Style for selection
    const img2 = new Circle({
      radius: 10,
      stroke: new Stroke({
        color: "rgba(255,0,0,1)", 
        width: 1 
      }),
      fill: new Fill({
        color: "rgba(255,0,0,0.3)"
      })
    });
    const style2 = new Style({
      image: img2
    });

    // Select interaction to spread cluster out and select features
    const selectCluster = new SelectCluster({
      pointRadius: 10,
      circleMaxObjects: 40,
      spiral: true,
      animate: true,
      // Feature style when it springs apart
      featureStyle: function (f) {
        console.log({f})
        const p = f.getProperties()

        if (p && p.features && p.features[0] && p.features[0].id.includes('odour')) {
          return [odourcollectStyle]
        } else {
          return [canairioStyle]
        }
      },
      // selectCluster: false,  // disable cluster selection
      // Style to draw cluster when selected
      style: function (f, _) {
        const cluster = f.get('features');
        if (cluster.length > 1) {
          // var s = getStyle(f, res);
          // s = style2;
          return style2;
        } else {
          return new Style({
            image: new Circle({
              stroke: new Stroke({ color: "rgba(0,0,192,0.9)", width: 2 }),
              fill: new Fill({ color: "rgba(0,0,192,0.5)" }),
              radius: 5
            })
          })
        }
      }
    });
    this.map.addInteraction(selectCluster);
    addItems(this.items, this.clusterSource)
  }

  componentDidLoad() {
    setTimeout(() => this.loadMap(), 400)
  }

  @Watch('items')
  onItems(items: any[]) {
    console.log({onItems: items})
    addItems(this.items, this.clusterSource)
  }

  render() {
    return (
      <Host>
        <div class="map" ref = {(el) => this.el = el}> </div>
        <p class={"legend " + (this.interactions ? 'interactions' : '') }>
          <ul class="circle-legend">
            <li class="circle canairio">Canairio</li>
            <li class="circle odourcollect">Odourcollect</li>
          </ul>
        </p>
      </Host>
    )
  }

}
