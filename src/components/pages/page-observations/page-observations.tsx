import { Component, Host, Prop, State, h } from '@stencil/core';
import { MappingService } from '../../../services/mapping.service';
import { RouterHistory } from '@stencil/router';
import { toQueryString } from '../../../utils/to-query-string';
import { fetchTranslations } from '../../../utils/translation';

@Component({
  tag: 'page-observations',
  styleUrl: 'page-observations.css',
  shadow: true,
})
export class PageObservations {

  @State() items: any[] = []
  @Prop() history: RouterHistory;
  page: number = 0;
  @State() images: any = {}
  perPage: number = 30;
  @State() loading: boolean = true;
  @State() state = {
    empty: false
  }

  i18n: any = {
    no_results: 'No results'
  }

  async componentWillLoad() {
    this.i18n = await fetchTranslations(this.i18n)
    const queryParams = this.history.location.query
    queryParams.page = null
    this.page = 0
    this.loading = true
    queryParams.map = true
    MappingService.get(queryParams)
    .then((res) => {
      this.items = res
      this.loadingDismiss()
      this.loading = false
      this.state = {empty:  !this.items.length}
    })
    .catch((_) => {
      this.loadingDismiss()
      this.loading = false
    })
  }

  search(params, reset = false) {
    this.state = {empty: false}
    const q = toQueryString(params)
    this.history.push('/observations' + q, {
      query: params
    })
    if (reset) {
      this.items = []
    }

    this.loading = true
    MappingService.get({ ...params, map: true })
    .then((res) => {
      if (params && params.page) {
        this.items.push(...res)
        this.items = [...this.items]
        if (!this.page) {
          this.page = this.items.length
        }

      } else {
        this.items = res
      }
      this.state = {empty:  !this.items.length}
      this.loading = false
    })
    .catch((_) => {
      this.loading = false
    })
  }

  loadMore() {
    if (this.items && this.items.length) {
      const params = this.history.location.query
      const page = ++this.page

      this.search({
        ...params,
        page
      })
    }
  }

  loadingDismiss() {
    const loading: any = document.body.querySelector('ion-loading')
    if (loading) loading.dismiss()
  }

  presentLoading() {
    const loading: any = document.createElement('ion-loading');

    loading.cssClass = 'my-custom-class';
    loading.message = 'Wait...';
    loading.duration = 10000;

    document.body.appendChild(loading);
    loading.present();
    return loading
  }

  async download(e) {
    const t = false
    if (t) return false
    const l = this.presentLoading()
    try {
      await MappingService.export(null, e.detail)
    } catch(_) {}
    l.dismiss()
  }

  render() {
    return (
      <Host>
        <app-search
          specie={this.history.location.query.taxon_name}
          place={this.history.location.query.place}
          query={this.history.location.query}
          onSearch={(ev) => this.search(ev.detail, true)}></app-search>
        <app-download onDownload={(e) => this.download(e)}/>
        <page-map items={this.items}></page-map>
        {this.state.empty && <div class="no-results">
          <span>{this.i18n.no_results}</span>
        </div>}
      </Host>
    );
  }

}
