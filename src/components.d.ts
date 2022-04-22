/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { LocationSegments, MatchResults, RouterHistory } from "@stencil/router";
export namespace Components {
    interface AppComment {
        "item": any;
    }
    interface AppComments {
    }
    interface AppDownload {
    }
    interface AppFooter {
    }
    interface AppGrid {
        "empty": string;
        "history": RouterHistory;
        "images": any;
        "items": any[];
        "showSpinner": boolean;
        "title": string;
    }
    interface AppMultiselect {
    }
    interface AppProfile {
        "match": MatchResults;
    }
    interface AppRoot {
        "history": RouterHistory;
        "location": LocationSegments;
    }
    interface AppSearch {
        "place": string;
        "query": any;
        "specie": string;
    }
    interface AppSearchbar {
        "placeholder": string;
        "service": ServiceType;
        "service2": ServiceType;
        "value": string;
    }
    interface CardItem {
        "image": string;
        "item": any;
    }
    interface DownloadHistory {
        "history": RouterHistory;
    }
    interface ModalContact {
    }
    interface ModalDownload {
    }
    interface ModalMap {
        "lat": number;
        "lon": number;
    }
    interface ModalSettings {
        "data": any;
        "firstTime": boolean;
        "header": any;
    }
    interface ModalShare {
        "item": any;
        "url": string;
    }
    interface PageDashboard {
    }
    interface PageHome {
        "history": RouterHistory;
    }
    interface PageLogin {
    }
    interface PageObservation {
        "history": RouterHistory;
        "match": MatchResults;
    }
    interface PageObservations {
        "history": RouterHistory;
    }
    interface PageUser {
        "match": MatchResults;
        "owner": any;
        "user": any;
    }
    interface PopupList {
        "items": {text: string, icon?: string, href?: string}[];
    }
}
declare global {
    interface HTMLAppCommentElement extends Components.AppComment, HTMLStencilElement {
    }
    var HTMLAppCommentElement: {
        prototype: HTMLAppCommentElement;
        new (): HTMLAppCommentElement;
    };
    interface HTMLAppCommentsElement extends Components.AppComments, HTMLStencilElement {
    }
    var HTMLAppCommentsElement: {
        prototype: HTMLAppCommentsElement;
        new (): HTMLAppCommentsElement;
    };
    interface HTMLAppDownloadElement extends Components.AppDownload, HTMLStencilElement {
    }
    var HTMLAppDownloadElement: {
        prototype: HTMLAppDownloadElement;
        new (): HTMLAppDownloadElement;
    };
    interface HTMLAppFooterElement extends Components.AppFooter, HTMLStencilElement {
    }
    var HTMLAppFooterElement: {
        prototype: HTMLAppFooterElement;
        new (): HTMLAppFooterElement;
    };
    interface HTMLAppGridElement extends Components.AppGrid, HTMLStencilElement {
    }
    var HTMLAppGridElement: {
        prototype: HTMLAppGridElement;
        new (): HTMLAppGridElement;
    };
    interface HTMLAppMultiselectElement extends Components.AppMultiselect, HTMLStencilElement {
    }
    var HTMLAppMultiselectElement: {
        prototype: HTMLAppMultiselectElement;
        new (): HTMLAppMultiselectElement;
    };
    interface HTMLAppProfileElement extends Components.AppProfile, HTMLStencilElement {
    }
    var HTMLAppProfileElement: {
        prototype: HTMLAppProfileElement;
        new (): HTMLAppProfileElement;
    };
    interface HTMLAppRootElement extends Components.AppRoot, HTMLStencilElement {
    }
    var HTMLAppRootElement: {
        prototype: HTMLAppRootElement;
        new (): HTMLAppRootElement;
    };
    interface HTMLAppSearchElement extends Components.AppSearch, HTMLStencilElement {
    }
    var HTMLAppSearchElement: {
        prototype: HTMLAppSearchElement;
        new (): HTMLAppSearchElement;
    };
    interface HTMLAppSearchbarElement extends Components.AppSearchbar, HTMLStencilElement {
    }
    var HTMLAppSearchbarElement: {
        prototype: HTMLAppSearchbarElement;
        new (): HTMLAppSearchbarElement;
    };
    interface HTMLCardItemElement extends Components.CardItem, HTMLStencilElement {
    }
    var HTMLCardItemElement: {
        prototype: HTMLCardItemElement;
        new (): HTMLCardItemElement;
    };
    interface HTMLDownloadHistoryElement extends Components.DownloadHistory, HTMLStencilElement {
    }
    var HTMLDownloadHistoryElement: {
        prototype: HTMLDownloadHistoryElement;
        new (): HTMLDownloadHistoryElement;
    };
    interface HTMLModalContactElement extends Components.ModalContact, HTMLStencilElement {
    }
    var HTMLModalContactElement: {
        prototype: HTMLModalContactElement;
        new (): HTMLModalContactElement;
    };
    interface HTMLModalDownloadElement extends Components.ModalDownload, HTMLStencilElement {
    }
    var HTMLModalDownloadElement: {
        prototype: HTMLModalDownloadElement;
        new (): HTMLModalDownloadElement;
    };
    interface HTMLModalMapElement extends Components.ModalMap, HTMLStencilElement {
    }
    var HTMLModalMapElement: {
        prototype: HTMLModalMapElement;
        new (): HTMLModalMapElement;
    };
    interface HTMLModalSettingsElement extends Components.ModalSettings, HTMLStencilElement {
    }
    var HTMLModalSettingsElement: {
        prototype: HTMLModalSettingsElement;
        new (): HTMLModalSettingsElement;
    };
    interface HTMLModalShareElement extends Components.ModalShare, HTMLStencilElement {
    }
    var HTMLModalShareElement: {
        prototype: HTMLModalShareElement;
        new (): HTMLModalShareElement;
    };
    interface HTMLPageDashboardElement extends Components.PageDashboard, HTMLStencilElement {
    }
    var HTMLPageDashboardElement: {
        prototype: HTMLPageDashboardElement;
        new (): HTMLPageDashboardElement;
    };
    interface HTMLPageHomeElement extends Components.PageHome, HTMLStencilElement {
    }
    var HTMLPageHomeElement: {
        prototype: HTMLPageHomeElement;
        new (): HTMLPageHomeElement;
    };
    interface HTMLPageLoginElement extends Components.PageLogin, HTMLStencilElement {
    }
    var HTMLPageLoginElement: {
        prototype: HTMLPageLoginElement;
        new (): HTMLPageLoginElement;
    };
    interface HTMLPageObservationElement extends Components.PageObservation, HTMLStencilElement {
    }
    var HTMLPageObservationElement: {
        prototype: HTMLPageObservationElement;
        new (): HTMLPageObservationElement;
    };
    interface HTMLPageObservationsElement extends Components.PageObservations, HTMLStencilElement {
    }
    var HTMLPageObservationsElement: {
        prototype: HTMLPageObservationsElement;
        new (): HTMLPageObservationsElement;
    };
    interface HTMLPageUserElement extends Components.PageUser, HTMLStencilElement {
    }
    var HTMLPageUserElement: {
        prototype: HTMLPageUserElement;
        new (): HTMLPageUserElement;
    };
    interface HTMLPopupListElement extends Components.PopupList, HTMLStencilElement {
    }
    var HTMLPopupListElement: {
        prototype: HTMLPopupListElement;
        new (): HTMLPopupListElement;
    };
    interface HTMLElementTagNameMap {
        "app-comment": HTMLAppCommentElement;
        "app-comments": HTMLAppCommentsElement;
        "app-download": HTMLAppDownloadElement;
        "app-footer": HTMLAppFooterElement;
        "app-grid": HTMLAppGridElement;
        "app-multiselect": HTMLAppMultiselectElement;
        "app-profile": HTMLAppProfileElement;
        "app-root": HTMLAppRootElement;
        "app-search": HTMLAppSearchElement;
        "app-searchbar": HTMLAppSearchbarElement;
        "card-item": HTMLCardItemElement;
        "download-history": HTMLDownloadHistoryElement;
        "modal-contact": HTMLModalContactElement;
        "modal-download": HTMLModalDownloadElement;
        "modal-map": HTMLModalMapElement;
        "modal-settings": HTMLModalSettingsElement;
        "modal-share": HTMLModalShareElement;
        "page-dashboard": HTMLPageDashboardElement;
        "page-home": HTMLPageHomeElement;
        "page-login": HTMLPageLoginElement;
        "page-observation": HTMLPageObservationElement;
        "page-observations": HTMLPageObservationsElement;
        "page-user": HTMLPageUserElement;
        "popup-list": HTMLPopupListElement;
    }
}
declare namespace LocalJSX {
    interface AppComment {
        "item"?: any;
    }
    interface AppComments {
    }
    interface AppDownload {
        "onDownload"?: (event: CustomEvent<any>) => void;
    }
    interface AppFooter {
    }
    interface AppGrid {
        "empty"?: string;
        "history"?: RouterHistory;
        "images"?: any;
        "items"?: any[];
        "onLoadmore"?: (event: CustomEvent<any>) => void;
        "showSpinner"?: boolean;
        "title"?: string;
    }
    interface AppMultiselect {
    }
    interface AppProfile {
        "match"?: MatchResults;
    }
    interface AppRoot {
        "history"?: RouterHistory;
        "location"?: LocationSegments;
    }
    interface AppSearch {
        "onSearch"?: (event: CustomEvent<any>) => void;
        "place"?: string;
        "query"?: any;
        "specie"?: string;
    }
    interface AppSearchbar {
        "onChoose"?: (event: CustomEvent<any>) => void;
        "onSearchValue"?: (event: CustomEvent<any>) => void;
        "placeholder"?: string;
        "service"?: ServiceType;
        "service2"?: ServiceType;
        "value"?: string;
    }
    interface CardItem {
        "image"?: string;
        "item"?: any;
    }
    interface DownloadHistory {
        "history"?: RouterHistory;
    }
    interface ModalContact {
    }
    interface ModalDownload {
    }
    interface ModalMap {
        "lat"?: number;
        "lon"?: number;
    }
    interface ModalSettings {
        "data"?: any;
        "firstTime"?: boolean;
        "header"?: any;
    }
    interface ModalShare {
        "item"?: any;
        "url"?: string;
    }
    interface PageDashboard {
    }
    interface PageHome {
        "history"?: RouterHistory;
    }
    interface PageLogin {
    }
    interface PageObservation {
        "history"?: RouterHistory;
        "match"?: MatchResults;
    }
    interface PageObservations {
        "history"?: RouterHistory;
    }
    interface PageUser {
        "match"?: MatchResults;
        "owner"?: any;
        "user"?: any;
    }
    interface PopupList {
        "items"?: {text: string, icon?: string, href?: string}[];
    }
    interface IntrinsicElements {
        "app-comment": AppComment;
        "app-comments": AppComments;
        "app-download": AppDownload;
        "app-footer": AppFooter;
        "app-grid": AppGrid;
        "app-multiselect": AppMultiselect;
        "app-profile": AppProfile;
        "app-root": AppRoot;
        "app-search": AppSearch;
        "app-searchbar": AppSearchbar;
        "card-item": CardItem;
        "download-history": DownloadHistory;
        "modal-contact": ModalContact;
        "modal-download": ModalDownload;
        "modal-map": ModalMap;
        "modal-settings": ModalSettings;
        "modal-share": ModalShare;
        "page-dashboard": PageDashboard;
        "page-home": PageHome;
        "page-login": PageLogin;
        "page-observation": PageObservation;
        "page-observations": PageObservations;
        "page-user": PageUser;
        "popup-list": PopupList;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "app-comment": LocalJSX.AppComment & JSXBase.HTMLAttributes<HTMLAppCommentElement>;
            "app-comments": LocalJSX.AppComments & JSXBase.HTMLAttributes<HTMLAppCommentsElement>;
            "app-download": LocalJSX.AppDownload & JSXBase.HTMLAttributes<HTMLAppDownloadElement>;
            "app-footer": LocalJSX.AppFooter & JSXBase.HTMLAttributes<HTMLAppFooterElement>;
            "app-grid": LocalJSX.AppGrid & JSXBase.HTMLAttributes<HTMLAppGridElement>;
            "app-multiselect": LocalJSX.AppMultiselect & JSXBase.HTMLAttributes<HTMLAppMultiselectElement>;
            "app-profile": LocalJSX.AppProfile & JSXBase.HTMLAttributes<HTMLAppProfileElement>;
            "app-root": LocalJSX.AppRoot & JSXBase.HTMLAttributes<HTMLAppRootElement>;
            "app-search": LocalJSX.AppSearch & JSXBase.HTMLAttributes<HTMLAppSearchElement>;
            "app-searchbar": LocalJSX.AppSearchbar & JSXBase.HTMLAttributes<HTMLAppSearchbarElement>;
            "card-item": LocalJSX.CardItem & JSXBase.HTMLAttributes<HTMLCardItemElement>;
            "download-history": LocalJSX.DownloadHistory & JSXBase.HTMLAttributes<HTMLDownloadHistoryElement>;
            "modal-contact": LocalJSX.ModalContact & JSXBase.HTMLAttributes<HTMLModalContactElement>;
            "modal-download": LocalJSX.ModalDownload & JSXBase.HTMLAttributes<HTMLModalDownloadElement>;
            "modal-map": LocalJSX.ModalMap & JSXBase.HTMLAttributes<HTMLModalMapElement>;
            "modal-settings": LocalJSX.ModalSettings & JSXBase.HTMLAttributes<HTMLModalSettingsElement>;
            "modal-share": LocalJSX.ModalShare & JSXBase.HTMLAttributes<HTMLModalShareElement>;
            "page-dashboard": LocalJSX.PageDashboard & JSXBase.HTMLAttributes<HTMLPageDashboardElement>;
            "page-home": LocalJSX.PageHome & JSXBase.HTMLAttributes<HTMLPageHomeElement>;
            "page-login": LocalJSX.PageLogin & JSXBase.HTMLAttributes<HTMLPageLoginElement>;
            "page-observation": LocalJSX.PageObservation & JSXBase.HTMLAttributes<HTMLPageObservationElement>;
            "page-observations": LocalJSX.PageObservations & JSXBase.HTMLAttributes<HTMLPageObservationsElement>;
            "page-user": LocalJSX.PageUser & JSXBase.HTMLAttributes<HTMLPageUserElement>;
            "popup-list": LocalJSX.PopupList & JSXBase.HTMLAttributes<HTMLPopupListElement>;
        }
    }
}