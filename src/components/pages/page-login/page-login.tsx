import { Component, Host, State, h } from '@stencil/core';
import { fetchTranslations } from '../../../utils/translation'

@Component({
  tag: 'page-login',
  styleUrl: 'page-login.css',
  shadow: true,
})
export class PageLogin {

  @State() login: string;
  @State() password: string;
  i18n: any = {}

  async componentWillLoad() {
    this.i18n = await fetchTranslations(this.i18n)
  }

  close() {
    const pops: any = document.querySelectorAll('ion-modal')
    pops.forEach(pop => {
      pop.dismiss()
    })
  }

  signin() {
    localStorage.setItem('user', JSON.stringify({
      login: this.login
    }))
    this.close()
  }

  authenix() {
    const clientId = 'da1a7d48-bca9-321b-dd04-ece7d7afc7b6'
    const redirect = encodeURIComponent(location.origin).replace(/\/$/, '')
    const path = location.pathname
    const url = `https://www.authenix.eu/oauth/authorize?response_type=token id_token&client_id=${clientId}&redirect_uri=${redirect}&state=${path}&nonce=123&prompt=select_account`
    location.href = url
  }

  render() {
    return (
      <Host>
        <ion-fab-button onClick={() => this.close()} class="close-btn" size="small">
          <ion-icon name="close"></ion-icon>
        </ion-fab-button>

        <header class="modal__header">
          <h2 class="modal__title" id="modal-login-title">
            {this.i18n.login.login}
          </h2>
        </header>
        <main class="modal__content modal-login-content" id="modal-login-content">
          <p class="center">{this.i18n.login.message} <a href="https://www.authenix.eu/" target="_blank">https://www.authenix.eu/</a></p>
          <br/>

          <ion-button onClick={() => this.authenix()}>
            Login
          </ion-button>

        </main>
      </Host>
    );
  }

}
