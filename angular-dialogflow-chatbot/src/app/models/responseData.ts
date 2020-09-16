import { Options } from './options';

export interface ResponseData {
  content: string;
  imageSourceLink?: string;
  imageRedirectLink?: string;
  options?: [Options];
}
