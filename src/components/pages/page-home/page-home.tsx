import { Component, Host, Prop, State, h } from '@stencil/core';

import { MappingService } from '../../../services/mapping.service'
import { RouterHistory } from '@stencil/router';
import { toQueryString } from '../../../utils/to-query-string';
import { fetchTranslations } from '../../../utils/translation'

@Component({
  tag: 'page-home',
  styleUrl: 'page-home.css',
  shadow: true
})
export class PageHome {

  @State() items: any[] = MappingService.getLastCache
  @Prop() history: RouterHistory;
  @State() images: any = {}
  i18n: any = {}

  async componentWillLoad() {
    this.i18n = await fetchTranslations(this.i18n)

    if (!(this.items && this.items.length)) {
      MappingService.get({map: true, origin: 'odourcollect'})
      .then((res) => {
        this.items = res
      })
      .catch((error) => {
        alert('Home =>' + error)
      })
    }
  }

  search(params) {
    const q = toQueryString(params)
    this.history.push('/observations' + q, {
      query: params
    })
  }

  render() {
    return (
      <Host>
        <header class="cnt-1">
          <div class="cnt-1-i">
            <h1 class="title" innerHTML={this.i18n.home_title}></h1>
            <app-search onSearch={(ev) => this.search(ev.detail)}></app-search>
          </div>
        </header>
        <page-map
          items={this.items}
          interactions={false}>
        </page-map>
        <app-footer></app-footer>
      </Host>
    );
  }

}
