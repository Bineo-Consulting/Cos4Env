import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';
// import { GbifService } from '../../../services/gbif.service';
import { PlacesService } from '../../../services/places.service';
import { fetchTranslations } from '../../../utils/translation';

@Component({
  tag: 'app-search',
  styleUrl: 'app-search.css',
  shadow: true,
})
export class AppSearch {

  @Prop({mutable: true}) specie: string;
  @Prop({mutable: true}) place: string;
  @Prop() query: any;
  @Event() search: EventEmitter<any>;

  i18n: any = {};  
  title: {[key: string]: string} = {
    portal: null,
    type: null,
    quality: null,
    license: null
  }
  filters: { [key: string]: HTMLElement } = {};
  refs: { [key: string]: HTMLElement } = {};

  params: any = {}

  origin: any = {
    odourcollect: 'false',
    canairio: 'false'
  }
  origins = Object.keys(this.origin) // hamelin

  type: any = {}
  types = [
    {
      label: 'Odour type',
      key: 'Odour type',
      value: 'Odour type',
      items: [
        "Other",
        "Ammonia",
        "Forest / Trees / Nature",
        "Waste water",
        "Alcohol",
        "Chimney (burnt wood)",
        "Organic fertilizers (manure/slurry)",
        "Amines",
        "Plastic",
        "Chemical",
        "Leachate",
        "Bread / Cookies",
        "Fresh waste",
        "Flowers",
        "Decomposed waste",
        "No Odour",
        "Rotten eggs",
        "Fuel",
        "Sewage",
        "Urine",
        "Oil / Petrochemical",
        "Waste bin",
        "Fresh grass",
        "Sweat",
        "Humidity / Wet soil",
        "Cabbage soup",
        "Traffic",
        "Cocoa",
        "Food",
        "Wood",
        "Animal feed",
        "Glue / Adhesive",
        "Sea",
        "Sludge",
        "Mint / Rosemary / Lavander",
        "Asphalt / Rubber",
        "Biogas",
        "Gas",
        "Metal",
        "Perfume",
        "Aroma / Flavour",
        "Paint",
        "Fruit",
        "Bakeries",
        "Fat / Oil",
        "I don't know",
        "Coffee",
        "Cooked meat",
        "Waste truck",
        "Ammines",
        "Fish",
        "Ketone / Ester / Acetate / Ether",
        "Dead animal",
        "Animal food",
        "Milk / Dairy",
        "Sulphur",
        "Malt / Hop",
        "Biofilter",
        "Raw meat",
        "Chlorine",
        "Leather"
      ]
    },
    {
      label: 'Odour intensity',
      key: 'Odour intensity',
      value: 'VDI 3882-1:1992 (odour intensity)',
      items: ['Very weak', 'Extremely strong', 'Very strong', 'Weak', 'Strong', 'Noticeable']
    },
    {
      label: 'Hedonic tone',
      key: 'Hedonic tone',
      value: 'VDI 3882-2:1994 (odour hedonic tone)',
      items: [
        "Slightly unpleasant",
        "Extremely unpleasant",
        "Extremely pleasant",
        "Unpleasant",
        "Very unpleasant",
        "Neutral",
        "Very pleasant",
        "Pleasant",
        "Slightly pleasant"
      ]
    },
    {
      label: 'PM1',
      key: 'PM1',
      value: 'PM1',
      conditions: true
    },
    {
      label: 'PM2.5',
      key: 'PM2.5',
      value: 'PM2.5',
      conditions: true
    },
    {
      label: 'PM10',
      key: 'PM10',
      value: 'PM10',
      conditions: true
    },
    {
      label: 'Temperature',
      key: 'Temperature',
      value: 'Temperature',
      conditions: true
    },
    {
      label: 'Humidity',
      key: 'Humidity',
      value: 'Humidity',
      conditions: true
    },
    {
      label: 'Pressure',
      key: 'Pressure',
      value: 'Pressure',
      conditions: true
    },
    {
      label: 'CO2',
      key: 'CO2',
      value: 'CO2',
      conditions: true
    },
    {
      label: 'CO2 Temperature',
      key: 'CO2 Temperature',
      value: 'CO2 Temperature',
      conditions: true
    },
    {
      label: 'CO2 Humidity',
      key: 'CO2 Humidity',
      value: 'CO2 Humidity',
      conditions: true
    },
    {
      label: 'Battery voltage',
      key: 'Battery voltage',
      value: 'Battery voltage',
      conditions: true
    }
  ]

  quality: any = {
    research: 'false',
    casual: 'false',
    geo: 'false',
    photos: 'false'
  }
  qualities = [
    {key: 'research', value: 'research', label: '👨‍🔬 Research'},
    {key: 'casual', value: 'casual', label: '🤷‍♂️ Casual'},
    {key: 'geo', value: 'geo', label: '📍 Geo'},
    {key: 'photos', value: 'photos', label: '🖼 photos'}
  ]

  license = {
    'CC0': 'false',
    'CC BY': 'false',
    'CC BY-NC': 'false',
    'CC BY-SA': 'false',
  }
  licenses = [
    {key: 'none', value: 'none', label: 'CC0'},
    {key: 'CC-BY', value: 'CC-BY', label: 'CC-BY'},
    {key: 'CC-BY-NC', value: 'CC-BY-NC', label: 'CC-BY-NC'},
    {key: 'CC-BY-SA', value: 'CC-BY-SA', label: 'CC-BY-SA'},
  ]

  date = {
    minEventDate: null,
    maxEventDate: null
  }


  async componentWillLoad() {
    this.i18n = await fetchTranslations(this.i18n)

    if (this.query) {
      const origins = (this.query.origin || '').split(',')
      origins.map(item => {
        this.origin[item] = 'true'
      })
      this.origin = {...this.origin}

      console.log({query: this.query})
      const type = (this.query.type || '').split(',')
      type.map(item => {
        this.type[item] = 'true'
      })
      this.type = {...this.type}

      const quality_grade = (this.query.quality_grade || '').split(',')
      quality_grade.map(item => {
        this.quality[item] = 'true'
      })
      this.quality = {...this.quality}

      const licenses = (this.query.license || '').split(',')
      licenses.map(item => {
        this.license[item] = 'true'
      })
      this.license = {...this.license}

      this.date.minEventDate = this.query.minEventDate || null
      this.date.maxEventDate = this.query.maxEventDate || null

      this.specie = this.query.scientificName || null
      this.place = this.query.place || null
    }
  }

  componentDidLoad() {
    this.setTitle()
  }

  onSpecie(ev) {
    const item = (ev || {}).detail
    if (item) {
      const name = (item.name || '').split(' ').slice(0, 2).join(' ')
      this.params.scientificName = name || null
    } else {
      this.params.scientificName = null
    }
  }

  onPlace(ev) {
    const item = (ev || {}).detail
    if (item && item.bbox) {
      this.params.decimalLatitude = [Number(item.bbox[0]), Number(item.bbox[1])]
      this.params.decimalLongitude = [Number(item.bbox[2]), Number(item.bbox[3])]
      this.params.place = item.name || null
    } else if (item) {
      const name = (item.name || '').split(' ').slice(0, 2).join(' ')
      this.params.scientificName = name || null
    } else {
      this.params.decimalLongitude = null
      this.params.decimalLatitude = null
      this.params.swlat = null
      this.params.swlng = null
      this.params.nelat = null
      this.params.nelng = null
      this.params.place = null
      this.params.scientificName = null
    }
  }

  cleanSpecie() {
    this.params.scientificName = null
    this.specie = null
  }
  cleanPlace() {
    this.place = null
    this.params.place = null
    this.params.decimalLongitude = null
    this.params.decimalLatitude = null
    this.params.swlat = null
    this.params.swlng = null
    this.params.nelat = null
    this.params.nelng = null
  }

  onSearchSelect(ev) {
    const item = (ev || {}).detail
    if (item && item.bbox) {
      this.params.decimalLatitude = [Number(item.bbox[0]), Number(item.bbox[1])]
      this.params.decimalLongitude = [Number(item.bbox[2]), Number(item.bbox[3])]
      this.params.place = item.name || null
      this.place = this.params.place
    } else if (item) {
      const name = (item.name || '').split(' ').slice(0, 2).join(' ')
      this.params.scientificName = name || null
      this.specie = this.params.scientificName
    } else {
      this.params.decimalLongitude = null
      this.params.decimalLatitude = null
      this.params.swlat = null
      this.params.swlng = null
      this.params.nelat = null
      this.params.nelng = null
      this.params.place = null
      this.params.scientificName = null
      this.place = null
      this.specie = null
    }
  }

  onSearch() {
    if (this.term && !this.place && !this.specie) {
      return this.presentAlert()
    }
    const type = Object.keys(this.type).map(key => {
      return this.type[key] === 'true' ? key : null
    }).filter(Boolean)
    this.params.type = type.length ? type.join(',') : null

    const origin = Object.keys(this.origin).map(key => {
      return this.origin[key] === 'true' ? key : null
    }).filter(Boolean)
    this.params.origin = origin.length ? origin.join(',') : null

    const license = Object.keys(this.license).map(key => {
      return this.license[key] === 'true' ? key : null
    }).filter(Boolean)
    this.params.license = license.length ? license.join(',') : null

    const quality = Object.keys(this.quality).map(key => {
      return this.quality[key] === 'true' ? key : null
    }).filter(Boolean)

    this.params.quality_grade = [
      quality.includes('casual') ? 'casual' : null,
      quality.includes('research') ? 'research' : null
    ].filter(Boolean).join(',') || null

    this.params.has = [
      quality.includes('geo') ? 'geo' : null,
      quality.includes('photos') ? 'photos' : null
    ].filter(Boolean).join(',') || null

    this.params.minEventDate = this.date.minEventDate || null
    this.params.maxEventDate = this.date.maxEventDate || null

    this.search.emit(this.params)
  }

  openFilters(key = 'all') {
    console.log(Object.keys(this.filters))
    Object.keys(this.filters).map(k => {
      this.filters[k].blur()
    })
    if (key) {
      const offl = this.refs[key].offsetLeft
      this.filters[key].focus()
      this.filters[key].style.left = `${offl}px`
    }
  }

  onChecked(ev, key = null) {
    if (key === 'type') {
      const el = ev.detail
      const [k, v] = el.value.split(':')
      const isCond = v.includes('=') || v.includes('﹦') || v.includes('>') || v.includes('<')

      if (isCond) {
        setTimeout(() => {
          const keyold = Object.keys(this[key]).find(i => i.includes(k))
          delete this[key][keyold]
          this[key][el.value] = el.checked ? 'true' : 'false'
          this.setTitle()
        }, 200)
      } else if (v === '*') {
        const keyold = Object.keys(this[key]).find(i => i.includes(k))
        delete this[key][keyold]
        this.type = {...this.type}
        this.setTitle()
      } else {
        setTimeout(() => {
          this[key][el.value] = el.checked ? 'true' : 'false'
          this.setTitle()
        }, 200)
      }
    } else if (key) {
      setTimeout(() => {
        const el = ev.detail
        this[key][el.value] = el.checked ? 'true' : 'false'
        this.setTitle()
      }, 200)
    } else {
      setTimeout(() => {
        const el = ev.detail
        this[el.value] = el.checked ? 'true' : 'false'
        this.setTitle()
      }, 200)
    }
  }

  when: any
  async setupDatePicker(ref1, ref2) {
    if (this.when) return null
    // const cssAwait = null//this.lazyCss('/assets/when.min.css')
    const jsAwait = import('/assets/when.min.js' as VanillajsDatepicker)
    await Promise.all([jsAwait])

    const varWhen = 'When'
    const when: any = window[varWhen]

    this.when = new when({
      input: ref1,
      // labelTo: this.labelTo,
      // labelFrom: this.labelFrom,
      locale: localStorage.lang || 'en',
      double: false,
      inline: false,
      singleDate: false,
      showHeader: true,
      container: ref2
    })

    const [yyyy, dd, mm] = (this.date.minEventDate || '').split('-')
    const [yyyy2, dd2, mm2] = (this.date.maxEventDate || '').split('-')
    const whenStr = [[dd, mm, yyyy].join('/'), [dd2, mm2, yyyy2].join('/')].join(' – ')
    ref1.innerHTML = whenStr.includes('//') ? this.i18n.filters.date : whenStr
    whenStr.includes('//') ? null : ref1.classList.add('active')
    return null
  }

  onMouseDown() {
    setTimeout(() => {
      this.setupDatePicker(this.refs.dateInput, this.refs.dateContainer)
    }, 100)

    setTimeout(() => {
      const calendar = this.refs.calendar.querySelector('.calendar')
      if (!calendar) return null
      // <ion-icon name="close-circle-outline"></ion-icon>
      const clear = document.createElement('ion-icon')
      const span = document.createElement('div')
      clear.setAttribute('name', 'refresh-circle-outline')
      clear.classList.add('clear')
      span.style.position = 'absolute'
      span.style.top = '0'
      span.style.right = '0'
      clear.style.fontSize = '20px'

      span.appendChild(clear)
      calendar.appendChild(span)
      span.addEventListener('click', () => this.clearDate())
      span.onclick = () => this.clearDate()
    }, 200)
  }
  onMouseUp($event) {
    if (!this.when) return setTimeout(() => this.onMouseUp($event), 200)
    setTimeout(() => {
      const calendar: any = this.refs.calendar.querySelector('.calendar')
      calendar && calendar.addEventListener('click', _ => {
        const dateInput: any = this.refs.dateInput
        const when = dateInput.value
        if (!when) {
          dateInput.innerHTML = this.i18n.filters.date
          return null
        }

        const leftDate = when.split(' – ')[0] || ''
        const rightDate = when.split(' – ')[1] || ''
        const [mm, dd, yyyy] = leftDate.split('/')
        const [mm2, dd2, yyyy2] = rightDate.split('/')
        this.date.minEventDate = leftDate.length > 4 ? [yyyy, mm, dd].join('-') : null
        this.date.maxEventDate = rightDate.length > 4 ? [yyyy2, mm2, dd2].join('-') : null
        dateInput.innerHTML = [
          leftDate.length > 4 ? [yyyy, mm, dd].join('/') : '',
          rightDate.length > 4 ? [yyyy2, mm2, dd2].join('/') : ''
        ].filter(Boolean).join(' – ')
        this.refs.dateInput.classList.add('active')
      })
      // const rest = window['innerHeight'] - $event.clientY

      calendar.parentNode.style.position = 'relative'
      calendar.parentNode.classList.add('calendar-div')
      calendar.classList.remove('top-left-triangle')
      calendar.classList.remove('top-right-triangle')
      calendar.classList.remove('.bottom-left-triangle')
      calendar.classList.remove('.bottom-right-triangle')
      const top = this.refs.dateInput.offsetTop
      // const left = this.refs.dateInput.offsetLeft

      calendar.style.top = `${top + 42}px`
      calendar.style.left = `${-330}px`
    }, 100)
  }

  clearDate() {
    const el = this.refs.dateContainer.firstElementChild as HTMLElement
    el.click()
    setTimeout(() => {
      this.date = {
        minEventDate: null,
        maxEventDate: null
      }

      this.refs.dateInput.innerHTML = this.i18n.filters.date
      this.refs.dateInput.classList.remove('active')
    }, 150)
  }

  get portalTitle() {
    return Object.entries(this.origin).filter(([_, v]) => v === 'true').map(([k]) => k).filter(Boolean).join('+') || null
  }
  get typeTitle() {
    const len = Object.entries(this.type).filter(([_, v]) => v === 'true').map(([k]) => k).filter(Boolean).length
    if (len) {
      return `${this.i18n.filters.types} (${Object.entries(this.type).filter(([_, v]) => v === 'true').map(([k]) => k).filter(Boolean).length})` // Object.entries(this.type).filter(([_, v]) => v === 'true').map(([k]) => k).filter(Boolean).join('+') || null
    } return null
  }
  get qualityTitle() {
    return Object.entries(this.quality).filter(([_, v]) => v === 'true').map(([k]) => this.i18n.filters[k]).filter(Boolean).join('+') || null
  }
  get licenseTitle() {
    return Object.entries(this.license).filter(([_, v]) => v === 'true').map(([k]) => k).filter(Boolean).join('+') || null
  }

  setTitle() {
    const portal = this.portalTitle
    if (portal !== this.title.portal) {
      this.title.portal = portal
      this.refs.portals.innerHTML = this.title.portal || this.i18n.filters.portals
      if (portal) this.refs.portals && this.refs.portals.classList.add('active')
      else this.refs.portals && this.refs.portals.classList.remove('active')
    }
    const type = this.typeTitle
    if (type !== this.title.type) {
      this.title.type = type
      this.refs.types.innerHTML = this.title.type || this.i18n.filters.types
      if (type) this.refs.types && this.refs.types.classList.add('active')
      else this.refs.types && this.refs.types.classList.remove('active')
    }
    const quality = this.qualityTitle
    if (quality !== this.title.quality) {
      this.title.quality = quality
      this.refs.quality.innerHTML = this.title.quality || this.i18n.filters.quality
      if (quality) this.refs.quality && this.refs.quality.classList.add('active')
      else this.refs.quality && this.refs.quality.classList.remove('active')
    }
    const license = this.licenseTitle
    if (license !== this.title.license) {
      this.title.license = license
      this.refs.licenses.innerHTML = this.title.license || this.i18n.filters.licenses
      if (license) this.refs.licenses && this.refs.licenses.classList.add('active')
      else this.refs.licenses && this.refs.licenses.classList.remove('active')
    }
  }

  term: string = null
  onSearchValue(term) {
    this.term = term.detail
  } 

  async presentAlert() {
    const alert: any = document.createElement('ion-alert');
    alert.cssClass = 'my-custom-class';
    alert.header = '⚠️';
    alert.subHeader = this.i18n.errorSearch;
    alert.message = this.i18n.selectSpeciePlace;
    alert.buttons = ['OK'];

    document.body.appendChild(alert);
    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  render() {
    return (
      <Host>

        <ion-grid class="app-grid">
          <ion-row>
            <ion-col size="9" size-sm="10">
              <app-searchbar
                value={this.place || this.specie}
                placeholder={this.i18n.filters.search}
                onChoose={(e) => this.onSearchSelect(e)}
                onSearchValue={(e) => this.onSearchValue(e)}
                service={PlacesService}
                service2={null}></app-searchbar>

              <div class="float-chips-wrappers">
                {this.specie && <ion-chip>
                  <ion-label>{this.specie}</ion-label>
                  <ion-icon onClick={_ => this.cleanSpecie()} name="close-circle"></ion-icon>
                </ion-chip>}
                {this.place && <ion-chip>
                  <ion-label>{this.place}</ion-label>
                  <ion-icon onClick={_ => this.cleanPlace()} name="close-circle"></ion-icon>
                </ion-chip>}
              </div>
            </ion-col>

            <ion-col size="3" size-sm="2">
              <ion-button expand="block" onClick={() => this.onSearch()}>{this.i18n.filters.search}</ion-button>
            </ion-col>
          </ion-row>

          <ion-row class="center">
            <ion-col size="12" ref={e => this.refs.calendar = e}>

              <ion-chip
                ref={e => this.refs.portals = e}
                onClick={() => this.openFilters('portals')}>{this.portalTitle || this.i18n.filters.portals}</ion-chip>
              <ion-chip
                ref={e => this.refs.types = e}
                onClick={() => this.openFilters('types')}>{this.typeTitle || this.i18n.filters.types}</ion-chip>
              <ion-chip
                ref={e => this.refs.licenses = e}
                onClick={() => this.openFilters('licenses')}>{this.licenseTitle || this.i18n.filters.licenses}</ion-chip>

              <ion-chip
                ref={e => (this.refs.dateInput = e, this.onMouseDown())}
                onClick={() => this.onMouseDown()}
                onMouseUp={e => this.onMouseUp(e)}>{this.i18n.filters.date}</ion-chip>
              <span ref={e => this.refs.dateContainer = e}></span>

            </ion-col>
          </ion-row>

          <ion-row ref={(e) => this.filters.portals = e} tabIndex="-1" className="center row-filters">
            <div class="row-filters-container">
              <ion-list lines="none">
                <ion-label>{this.i18n.filters.portals}</ion-label>
                {this.origins.map(origin => <ion-item>
                  <ion-checkbox slot="start" value={origin}
                    checked={this.origin[origin]}
                    onIonChange={(ev) => this.onChecked(ev, 'origin')}></ion-checkbox>
                  <ion-label>{origin}</ion-label>
                </ion-item>)}
              </ion-list>
            </div>
          </ion-row>

          <ion-row ref={(e) => this.filters.types = e} tabIndex="-1" className="center row-filters">
            <div class="row-filters-container">
              <app-list items={this.types}
                type={this.type}
                onChoose={ev => this.onChecked(ev, 'type')}
                onClear={() => this.openFilters('types')}>
              </app-list>
            </div>
          </ion-row>

          <ion-row ref={(e) => this.filters.quality = e} tabIndex="-1" className="center row-filters">
            <div class="row-filters-container">
              <ion-list lines="none">
                <ion-label>{this.i18n.filters.quality}</ion-label>
                {this.qualities.map(item => <ion-item>
                  <ion-checkbox slot="start" value={item.value}
                    checked={this.quality[item.key]}
                    onIonChange={(ev) => this.onChecked(ev, 'quality')}></ion-checkbox>
                  <ion-label>{this.i18n.filters[item.key]}</ion-label>
                </ion-item>)}
              </ion-list>
            </div>
          </ion-row>

          <ion-row ref={(e) => this.filters.licenses = e} tabIndex="-1" className="center row-filters">
            <div class="row-filters-container">
              <ion-list lines="none">
                <ion-label>{this.i18n.filters.licenses}</ion-label>
                {this.licenses.map(item => <ion-item>
                  <ion-checkbox slot="start" value={item.value}
                    checked={this.license[item.key]}
                    onIonChange={(ev) => this.onChecked(ev, 'license')}></ion-checkbox>
                  <ion-label>{item.label}</ion-label>
                </ion-item>)}
              </ion-list>
            </div>
          </ion-row>

        </ion-grid>

      </Host>
    );
  }

}
