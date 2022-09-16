import {Category} from './category';

export interface Book {
  id?: number;
  name?: string;
  avatar?: string;
  description?: string;
  language?: string;
  price?: number;
  page?: number;
  author?: string;
  coverForm?: string;
  publisher?: string;
  yearPublisher?: string;
  supplier?: string;
  weight?: number;
  packagingSize?: string;
  amount?: number;
  pointReward?: number;
  category: Category;
  numberRating?: number;
}
