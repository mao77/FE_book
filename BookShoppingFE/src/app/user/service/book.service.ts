import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Category} from '../../models/category';
import {Book} from '../../models/book';
import {PageBook} from '../../models/page-book';

const API_URL_BOOK = `${environment.url}` + '/book';
const API_URL_CATEGORY = `${environment.url}` + '/category';
@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(API_URL_CATEGORY + '/findAll');
  }

  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(API_URL_BOOK + '/findAll');
  }

  getBooksByNumberRecord(numberRecord: number): Observable<Book[]> {
    return this.http.get<Book[]>(API_URL_BOOK + '/findByNumberRecord?numberRecord=' + numberRecord);
  }

  findById(id: number): Observable<Book> {
    return this.http.get<Book>(API_URL_BOOK + '/findById?id=' + id);
  }

  findBooksSameAuthor(author: string): Observable<Book[]> {
    return this.http.get<Book[]>(API_URL_BOOK + '/findBooksSameAuthor?author=' + author);
  }

  findBooksSameCategoryLimit(category: string): Observable<Book[]> {
    return this.http.get<Book[]>(API_URL_BOOK + '/findBooksSameCategoryLimit?category=' + category);
  }

  findBooksSameAuthorLimit(author: string): Observable<Book[]> {
    return this.http.get<Book[]>(API_URL_BOOK + '/findBooksSameAuthorLimit?author=' + author);
  }

  search(q: string, page: number): Observable<PageBook> {
    return this.http.get<PageBook>(API_URL_BOOK + '/search?q=' + q + '&page=' + page);
  }
}
