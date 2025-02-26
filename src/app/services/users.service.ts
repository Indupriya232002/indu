import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Users } from '../models/users.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  baseUrl = 'http://localhost:7111/api/User/';
  constructor(private http:HttpClient) { }

  clean():void{
    window.sessionStorage.clear();
  }

  login(logindata:any):Observable<any>
  {
    return this.http.post(this.baseUrl+'Login',logindata);
  }

  signUp(data:any): Observable<any>
  {
    return this.http.post(this.baseUrl+'SignUp',data);
  }

  getAllUsers(): Observable<Users[]>
  {
   return this.http.get<Users[]>(this.baseUrl+'GetUsers');
  }
}
