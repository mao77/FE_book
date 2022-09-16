import {Book} from './book';

export interface PageBook {
  content?: Book[];
  totalPages?: number;
  number?: number;
}
