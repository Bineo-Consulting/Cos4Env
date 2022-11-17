import { Component, Host, h, State, Prop } from '@stencil/core';
import { MappingService } from '../../../services/mapping.service';
import { fetchTranslations } from '../../../utils/translation';

@Component({
  tag: 'modal-comments',
  styleUrl: 'modal-comments.css',
  shadow: true,
})
export class ModalComments {

  i18n: any = {}

  @Prop() id: string;
  @Prop() item: any;
  @Prop() items: any[] = []
  @Prop() callback: Function

  @State() user: any;
  @State() body: string | void;
  @State() specie: string;

  async componentWillLoad() {
    this.checked = false
    this.i18n = await fetchTranslations(this.i18n)
  }

  async presentToast(msg) {
    const toast: any = document.createElement('ion-toast');
    toast.message = msg;
    toast.duration = 2000;

    document.body.appendChild(toast);
    return toast.present();
  }

  setUser() {
    this.user = localStorage.user ? JSON.parse(localStorage.user) : null
  }

  async openModalLogin() {
    this.presentToast(this.i18n.need_login)
    const modalElement: any = document.createElement('ion-modal');
    modalElement.component = 'page-login';

    // present the modal
    document.body.appendChild(modalElement);
    await modalElement.present();
    await modalElement.onWillDismiss();
    this.setUser()
  }

  checked = false
  checkUser() {
    if (!this.checked && !localStorage.user) {
      this.checked = true
      this.openModalLogin()
    }
  }

  async addComment() {
    if (localStorage.user) {
      const item = await MappingService.addComment({
        parent_id: this.id || this.item.id,
        comment: this.body,
        taxon: this.specie,
        item: this.item
      })
      // this.componentWillLoad()
      if (this.callback) {
        this.body = ''
        this.callback(this, item)
      }
    } else {
      this.openModalLogin()
    }
  }

  close() {
    const pops: any = document.querySelectorAll('ion-modal')
    pops.forEach(pop => {
      pop.dismiss()
    })
  }

  render() {
    return (
      <Host>
        <ion-fab-button onClick={() => this.close()} class="close-btn" size="small">
          <ion-icon name="close"></ion-icon>
        </ion-fab-button>

        <ion-header>
          <ion-toolbar>
            <ion-title>Comments</ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-content>
          {this.items.map(comment =>
            <app-comment item={comment}></app-comment>
          )}

          <ion-item class="comments-wrapper">
            <ion-label position="floating">{this.i18n.comments.comments}</ion-label>
            <ion-textarea
              position="floating"
              value={this.body}
              onIonFocus={() => this.checkUser()}
              onIonChange={(ev) => this.body = ev.detail.value}
              rows="6"
              cols="20"
              placeholder={this.i18n.comments.type_comment}></ion-textarea>
          </ion-item>
          {<ion-button class="add-identification"
            onClick={() => this.addComment()}>{this.i18n.comments.add_identification}</ion-button>
          }

        </ion-content>
      </Host>
    );
  }

}
