import { Component, Host, h, Prop, State, Event, EventEmitter} from '@stencil/core';

@Component({
  tag: 'app-list',
  styleUrl: 'app-list.css',
  shadow: true,
})
export class AppList {

  @Prop() type: any
  @Prop() items: any[] = [
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

  @State() item: any
  @State() filtered: any[]
  @State() conditions: boolean = null
  @State() condition: any = null

  @Event() choose: EventEmitter<any>;
  @Event() clear: EventEmitter<any>;

  ref: any = null;

  options = {
    allowSlideNext: false,
    allowSlidePrev: false,
    lockSwipes: true,
    speed: 400
  }

  componentDidLoad() {
    const s = this.ref.getSwiper()
    s.then(async item => {
      item.allowSlideNext = false
    })
  }

  onConditionChange(ev) {
    console.log({ev, val: ev.target.value}, this.item.key)
    if (ev && ev.target.value) {
      if (!this.condition) {
        this.condition = {
          label: ev.target.value
        }
      } else {
        this.condition.label = ev.target.value
        this.condition = { ...this.condition }
      }

      if (this.condition.value) {
        this.onChange({}, this.condition.value || '')
      }
    } else {
      this.condition = null
      this.choose.emit({checked: false, value: `${this.item.key}:*`})
    }
  }

  next() {
    const s = this.ref.getSwiper()
    s.then(async item => {
      item.allowSlideNext = true
      await item.slideNext()
      item.allowSlideNext = false
    })
  }
  prev() {
    const s = this.ref.getSwiper()
    s.then(async item => {
      item.allowSlidePrev = true
      await item.slidePrev()
      item.allowSlidePrev = false
      this.item = null
      this.filtered = null
      this.conditions = null
      this.condition = null
      setTimeout(() => {
        this.clear.emit()
      }, 150)
    })
  }

  checkCurrentCondition() {
    if (this.conditions) {
      const currKey = Object.keys(this.type).find(key => key.includes(this.item.key))

      if (currKey) {
        const [, value] = currKey.split(':')
        const operators = value.replaceAll('﹦', '=').split(/(\>=|\<=|=)/).filter(Boolean)
        if (operators.length === 4) {
          this.condition = {
            label: 'beetween',
            value: operators[1],
            value2: operators[3]
          }
        } else {
          this.condition = {
            label: this.operator(operators[0]),
            value: operators[1]
          }
        }
      } else {
        this.condition = {
        }
      }
    }
  }

  onClick(item) {
    if (item && item.key) {
      const filtered = this.items.find(i => i.key === item.key)
      this.item = filtered
      this.filtered = filtered.items
      this.conditions = filtered.conditions || null
    
      this.checkCurrentCondition()
      this.next()
    }
  }

  switchCondition(cond) {
    if (cond.label === 'equal') {
      return `﹦${cond.value || ''}`
    }
    if (cond.label === 'greater_than') {
      return `>﹦${cond.value || ''}`
    }
    if (cond.label === 'less_than') {
      return `>﹦${cond.value || ''}`
    }
    if (cond.label === 'between') {
      return `>﹦${cond.value || ''}<﹦${cond.value2 || ''}`
    }
  }

  operator(op) {
    if (op === '﹦' || op === '=') {
      return 'equal'
    }
    if (op === '>=' || op === '>﹦') {
      return 'greater_than'
    }
    if (op === '<=' || op === '<﹦') {
      return 'less_than'
    }
  }

  onChange(ev, item) {
    if (this.condition) {
      if (ev.target.name === 'value') {
        this.condition.value = ev.target.value
        this.choose.emit({
          checked: true,
          value: `${this.item.key}:${this.switchCondition(this.condition)}`
        })
      } else if (ev.target.name === 'value2') {
        this.condition.value2 = ev.target.value
        this.choose.emit({
          checked: true,
          value: `${this.item.key}:${this.switchCondition(this.condition)}`
        })
      }
    } else {
      this.choose.emit({...ev.detail, value: `${this.item.key}:${item}`})
    }
  }

  title(item) {
    if (this.type && Object.keys(this.type).length) {
      const len = Object.entries(this.type)
        .filter(([, v]) => v === 'true')
        .map(([i]) => i.split(':'))
        .filter(([key]) => key === item.key).length

      return len ? `(${len})` : ''
    }
    return ''
  }

  isChecked(item) {
    const key = Object.keys(this.type).find(k => k.includes(item))
    return key && this.type[key] === 'true'
  }

  render() {
    return (
      <Host>
        <ion-slides ref={e => this.ref = e} options={this.options}>
          <ion-slide>
            <ion-list lines="none">
              {this.items && this.items.map(item => <ion-item onClick={() => this.onClick(item)}>
                <ion-label>{this.title(item)} {item.label} →</ion-label>
              </ion-item>)}
            </ion-list>
          </ion-slide>
          <ion-slide>
            <ion-item onClick={() => this.prev()}>
              <ion-icon name="chevron-back-sharp"></ion-icon>
              {this.item && <ion-label>{this.item.label}</ion-label>}
            </ion-item>
            {this.filtered && <ion-list lines="none">
              {this.filtered.map(item => <ion-item>
                <ion-checkbox
                  checked={this.isChecked(item)}
                  onIonChange={ev => this.onChange(ev, item)}></ion-checkbox>
                <ion-label>{item}</ion-label>
              </ion-item>)}
            </ion-list>}
            {this.conditions && <ion-list lines="none">
              <ion-item>
                <ion-label>Condition</ion-label>
                <select
                  onChange={ev => this.onConditionChange(ev)}>
                  <option value="">--</option>
                  <option
                    value="equal"
                    selected={this.condition?.label === 'equal'}>Equal</option>
                  <option
                    value="less_than"
                    selected={this.condition?.label === 'less_than'}>Less than</option>
                  <option
                    value="greater_than"
                    selected={this.condition?.label === 'greater_than'}>Greater than</option>
                  <option
                    value="between"
                    selected={this.condition?.label === 'between'}>Between</option>
                </select>
              </ion-item>

              {this.condition && <ion-item>
                <ion-label>{this.condition.label}</ion-label>
                <ion-input
                  placeholder="0"
                  name="value"
                  value={this.condition.value}
                  onInput={ev => this.onChange(ev, ev.target.value)}>
                </ion-input>
                {this.condition.label === 'between' && <ion-label>And</ion-label>}
                {this.condition.label === 'between' && <ion-input
                  placeholder="0"
                  name="value2"
                  value={this.condition.value2}
                  onInput={ev => this.onChange(ev, ev.target.value)}>
                </ion-input>}
              </ion-item>}
            </ion-list>}
          </ion-slide>
        </ion-slides>
      </Host>
    );
  }

}
