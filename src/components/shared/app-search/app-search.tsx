import { Component, Event, EventEmitter, Host, Prop, h, State } from '@stencil/core';
import { PlacesService } from '../../../services/places.service';
import { fetchTranslations } from '../../../utils/translation';
import { types as odourTypes } from '../../../services/odourcollect.service';
import { types as canairioTypes } from '../../../services/canairio.service';

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

  slides: any = {}
  slideOpts = {
    allowSlideNext: false,
    allowSlidePrev: false
  }

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
    odourcollect: false,
    canairio: false
  }
  origins = Object.keys(this.origin)
  originLabels: any = {
    odourcollect: 'OdourCollect',
    canairio: 'CanAirIO'
  }

  iconic_taxa: any = {}
  types = [
    ...odourTypes(),
    ...canairioTypes()
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
    'ODbL v1.0': 'false',

  }
  licenses = [
    {key: 'none', value: 'none', label: 'CC0'},
    {key: 'CC-BY', value: 'CC-BY', label: 'CC-BY'},
    {key: 'CC-BY-NC', value: 'CC-BY-NC', label: 'CC-BY-NC'},
    {key: 'CC-BY-SA', value: 'CC-BY-SA', label: 'CC-BY-SA'},
    {key: 'ODbL v1.0', value: 'ODbL v1.0', label: 'ODbL v1.0'},
  ]

  date = {
    minEventDate: null,
    maxEventDate: null
  }

  @State() type = {}

  async componentWillLoad() {
    this.i18n = await fetchTranslations(this.i18n)

    if (this.query) {
      const origins = (this.query.origin || '').split(',')
      origins.map(item => {
        this.origin[item] = 'true'
      })
      this.origin = {...this.origin}

      if (this.query.type) {
        this.query.type.split(',')
        .map(i => {
          const [key, val] = i.split(':')
          this.type[key] ||= {}
          this.type[key][val] = true
          const item = this.types.find(item => item.key === key)
          item.count ||= 0
          item.count += 1
        })
        this.type = { ...this.type }
      }

      const licenses = (this.query.license || '').split(',')
      licenses.map(item => {
        this.license[item] = 'true'
      })
      this.license = {...this.license}

      this.date.minEventDate = this.query.minEventDate || null
      this.date.maxEventDate = this.query.maxEventDate || null

      // this.specie = this.query.scientificName || null
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

    this.params.type = Object.keys(this.type)
    .filter(key => this.type[key] && Object.keys(this.type[key]).length)
    .map(tipe => {
      return Object.keys(this.type[tipe]).map(key => {
        return `${tipe}:${key}`
      }).join(',') || null
    }).filter(Boolean).join(',') || null

    const origin = Object.keys(this.origin).map(key => {
      return this.origin[key] === 'true' ? key : null
    }).filter(Boolean)
    this.params.origin = origin.length ? origin.join(',') : null

    const license = Object.keys(this.license).map(key => {
      return this.license[key] === 'true' ? key : null
    }).filter(Boolean)
    this.params.license = license.length ? license.join(',') : null

    this.params.minEventDate = this.date.minEventDate || null
    this.params.maxEventDate = this.date.maxEventDate || null

    this.search.emit(this.params)
  }

  openFilters(key = 'all') {
    const offl = this.refs[key].offsetLeft
    this.filters[key].focus()
    this.filters[key].style.left = `${offl}px`

    if (key === 'types') {
      this.selectionBack()
    }
  }

  onChecked(ev, key = null, item = null) {
    if (key === 'type') {
      const el = ev.detail
      if (el.checked) {
        if (this.conditions) {
          this.type[this.selection.key] = {[item]: true}
        } else {
          this.type[this.selection.key] ||= {}
          this.type[this.selection.key][item] = true
        }
        const found = this.types.find(item => item.key === this.selection.key)
        found.count = Object.keys(this.type[this.selection.key] || {}).length
        this.types = [...this.types]
      } else {
        if (this.conditions) {
          delete this.type[this.selection.key]
        } else {
          delete this.type[this.selection.key][item]
        }
        const found = this.types.find(item => item.key === this.selection.key)
        found.count = Object.keys(this.type[this.selection.key] || {}).length
        this.types = [...this.types]
      }
      this.type = { ...this.type }
      this.setTitle()
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
    return Object.entries(this.origin).filter(([_, v]) => (v === 'true' || v === true)).map(([k]) => k).filter(Boolean).join('+') || null
  }
  get typeTitle() {
    const aux = []
    Object.keys(this.type)
    .filter(i => this.type[i] && Object.keys(this.type[i]).length)
    .map(key => aux.push(...Object.keys(this.type[key])))
    const count = aux.length
    return count ? `${this.i18n.filters.types} (${count})` : null
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
    this.title.type = type
    this.refs.types.innerHTML = this.title.type || this.i18n.filters.types
    if (type) this.refs.types && this.refs.types.classList.add('active')
    else this.refs.types && this.refs.types.classList.remove('active')

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

  @State() selection = null
  async selectCategory(type) {
    this.selection = type
    const selection = this.types.find(e => e.key === this.selection.key)
    setTimeout(() => this.filters.types.focus(), 500)

    this.conditions = null
    this.condition = null
    this.conditions = selection.condition || null
    this.checkCurrentCondition()

    await this.slides.lockSwipes(false)
    await this.slides.slideTo(1)
    await this.slides.lockSwipes(true)
  }

  async selectionBack() {
    this.selection = null
    setTimeout(() => this.filters.types.focus(), 500)
    await this.slides.lockSwipes(false)
    await this.slides.slideTo(0)
    await this.slides.lockSwipes(true)
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

  @State() condition: any = null
  @State() conditions = null

  onConditionChange(t) {
    if (t && t.target.value) {
      if (this.condition) {
        this.condition.label = t.target.value,
        this.condition = Object.assign({}, this.condition)
      } else {
        this.condition = {
          label: t.target.value
        }
      }
      this.onChecked(
        {
          detail: { checked: true }
        },
        'type',
        this.switchCondition(this.condition)
      )
    } else {
      this.onChecked(
        {
          detail: { checked: false }
        },
        'type',
        this.switchCondition(this.condition)
      )
      this.condition = null
    }
  }

  checkCurrentCondition() {
    if (this.conditions && this.selection && this.type[this.selection.key]) {
      const current = this.type[this.selection.key]

      const operator = Object.keys(current)[0]

      const i = operator.replaceAll("﹦", "=").split(/(\>=|\<=|=)/).filter(Boolean);
      this.condition = 4 === i.length ? {
        label: "beetween",
        value: i[1],
        value2: i[3]
      } : {
        label: this.operator(i[0]),
        value: i[1]
      }
    } else {
      this.condition = null
    }
  }

  switchCondition(t) {
    if ("equal" === t.label) {
      return "﹦" + (t.value || "")
    }
    if ("greater_than" === t.label) {
      return ">﹦" + (t.value || "")
    }
    if ("less_than" === t.label) {
      return "<﹦" + (t.value || "")
    }
    if ("between" === t.label) {
      return `>﹦${t.value || ""}<﹦${t.value2 || ""}`
    }
    return ''
  }

  operator(t) {
    return "﹦" === t || "=" === t ? "equal" : ">=" === t || ">﹦" === t ? "greater_than" : "<=" === t || "<﹦" === t ? "less_than" : void 0
  }

  onChange(t) {
    if (this.condition) {
      if (t && t.target) {
        if ("value" === t.target.name) {
          this.condition.value = t.target.value
        }
        if ("value2" === t.target.name) {
          this.condition.value2 = t.target.value
        }
      }
    }

    if (this.condition && this.condition.label) {
      this.onChecked(
        {
          detail: { checked: true }
        },
        'type',
        this.switchCondition(this.condition)
      )
    }
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
                service={PlacesService}></app-searchbar>

              <div class="float-chips-wrappers">
                {this.specie && <ion-chip>
                  <ion-label class="capitalize">{this.specie}</ion-label>
                  <ion-icon onClick={_ => this.cleanSpecie()} name="close-circle"></ion-icon>
                </ion-chip>}
                {this.place && <ion-chip>
                  <ion-label class="capitalize">{this.place}</ion-label>
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
                ref={(e) => this.refs.portals = e}
                onClick={() => this.openFilters('portals')}>{this.portalTitle || this.i18n.filters.portals}</ion-chip>

              <ion-chip
                ref={(e) => this.refs.types = e}
                onClick={() => this.openFilters('types')}>{this.typeTitle || this.i18n.filters.types}</ion-chip>

              <ion-chip
                ref={(e) => this.refs.licenses = e}
                onClick={() => this.openFilters('licenses')}>{this.licenseTitle || this.i18n.filters.licenses}</ion-chip>

              <ion-chip
                ref={(e) => (this.refs.dateInput = e, this.onMouseDown())}
                onClick={() => this.onMouseDown()}
                onMouseUp={(e) => this.onMouseUp(e)}>{this.i18n.filters.date}</ion-chip>
              <span ref={e => this.refs.dateContainer = e}></span>

            </ion-col>
          </ion-row>

          <ion-row ref={(e) => this.filters.portals = e} tabIndex="-1" className="center row-filters">
            <div class="row-filters-container">
              <ion-list lines="none">
                <ion-label class="capitalize">{this.i18n.filters.portals}</ion-label>
                {this.origins.map(origin => <ion-item>
                  <ion-checkbox slot="start" value={origin}
                    checked={this.origin[origin]}
                    onIonChange={(ev) => this.onChecked(ev, 'origin')}></ion-checkbox>
                  <ion-label>{this.originLabels[origin]}</ion-label>
                </ion-item>)}
              </ion-list>
            </div>
          </ion-row>

          <ion-row ref={(e) => this.filters.types = e} tabIndex="-1" className="center row-filters">
            <div class="row-filters-container">
              <ion-slides ref={e => this.slides = e || e.lockSwipes(true)} options={this.slideOpts}>
                <ion-slide>
                  <ion-list lines="none">
                    {this.types.map(item => (
                      <ion-item class="item-label" onClick={() => this.selectCategory(item)}>
                        <ion-label class="capitalize">{item.count ? `(${item.count}) ` : ''}{item.label} →</ion-label>
                      </ion-item>
                    ))}
                  </ion-list>
                </ion-slide>
                <ion-slide>
                  <ion-item onClick={() => this.selectionBack()}>
                    <ion-icon name="chevron-back-sharp"></ion-icon>
                    <ion-title>{this.selection?.key}</ion-title>
                  </ion-item>
                  {this.selection && this.selection.items && <ion-list>

                    {this.selection.items.map(item => <ion-item lines="none">
                      <ion-checkbox
                        onIonChange={(e) => this.onChecked(e, 'type', item)}
                        slot="start"
                        checked={this.type[this.selection.key] && this.type[this.selection.key][item]}
                        value={item}>
                      </ion-checkbox>
                      <ion-label class="capitalize">{item}</ion-label>
                    </ion-item>)}
                  </ion-list>}

                  {this.selection?.condition && <ion-list lines="none">
                    <ion-item>
                      <ion-label>Condition</ion-label>
                      <select class="select"
                        onChange={_ => this.onConditionChange(_)}>
                        <option value="">--</option>
                        <option selected={this.condition && this.condition.label === "equal"} value="equal">Equal</option>
                        <option selected={this.condition && this.condition.label === "less_than"} value="less_than">Less than</option>
                        <option selected={this.condition && this.condition.label === "greater_than"} value="greater_than">Greater than</option>
                        <option selected={this.condition && this.condition.label === "between"} value="between">Between</option>
                      </select>
                    </ion-item>
                    {this.condition && this.condition.label && <ion-item>
                      {this.condition && <ion-label class="capitalize">{this.condition.label}</ion-label>}
                      <ion-input class="input" placeholder="0" name="value"
                        value={this.condition.value}
                        onIonChange={e => this.onChange(e)}></ion-input>
                    </ion-item>}
                    {
                      this.condition && this.condition.label === "between" &&
                        <ion-item>
                          <ion-label>And</ion-label>
                          <ion-input class="input" placeholder="0" name="value2"
                            value={this.condition.value2}
                            onIonChange={e => this.onChange(e)}></ion-input>
                        </ion-item>
                    }
                  </ion-list>}
                </ion-slide>
              </ion-slides>  
            </div>
          </ion-row>

          <ion-row ref={(e) => this.filters.licenses = e} tabIndex="-1" className="center row-filters">
            <div class="row-filters-container">
              <ion-list lines="none">
                <ion-label class="capitalize">{this.i18n.filters.licenses}</ion-label>
                {this.licenses.map(item => <ion-item>
                  <ion-checkbox slot="start" value={item.value}
                    checked={this.license[item.key]}
                    onIonChange={(ev) => this.onChecked(ev, 'license')}></ion-checkbox>
                  <ion-label class="capitalize">{item.label}</ion-label>
                </ion-item>)}
              </ion-list>
            </div>
          </ion-row>

        </ion-grid>

      </Host>
    );
  }

}
