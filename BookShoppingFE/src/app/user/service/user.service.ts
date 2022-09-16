import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponseMessage} from '../../models/response-message';
import {User} from '../../models/user';
import {TokenStorageService} from '../../services/token-storage.service';

const API_URL = `${environment.url}` + '/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     Authorization: 'Bearer ' + this.tokenStorageService.getToken()
  //   }),
  //   'Access-Control-Allow-Origin': 'http://localhost:4200/', 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'};
  constructor(private http: HttpClient, private tokenStorageService: TokenStorageService) {
  }

  getInfo(token: string): Observable<any> {
    return this.http.get<any>(API_URL + '/getInfoFromToken?token=' + token);
  }

  updateEmail(id: number, email: string, otp: number): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(API_URL + '/updateEmail?id=' + id +
                                                                '&&email=' + email +
                                                                '&&otp=' + otp, '');
  }
  findById(id: number): Observable<User> {
    return this.http.get(API_URL + '/findById?id=' + id);
  }

  updateInfo(id: number, user: User): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(API_URL + '/updateInfo?id=' + id, user);
  }

  updatePassword(id: number, oldPass: string, newPass: string, otp: number): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(API_URL + '/updatePassword?id=' + id +
                                                                  '&&oldPass=' + oldPass +
                                                                  '&&newPass=' + newPass +
                                                                  '&&otp=' + otp, '');
  }
}
