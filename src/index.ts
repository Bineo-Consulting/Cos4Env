declare global {
  export type VanillajsDatepicker = any;
  export type ServiceType = {
    get({value: string}): Promise<any>
    process(T: any[], S: string): ItemType[]
  }
  export type ItemType = {
    name: string
    value: string
    bbox?: string
    lat?: number
    lon?: number
    icon?: string
    score?: number
  }
  export interface GeolocationPositionError {
    code: number;
    message: string;
  }
}

export { Components, JSX } from './components';
import '@stencil/router';
import 'ol';

