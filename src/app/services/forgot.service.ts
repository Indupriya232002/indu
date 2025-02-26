import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForgotService {

  baseUrl = 'http://localhost:7111/api/User/';

  constructor(private http:HttpClient) { }

  forgotPassword(email: string): Observable<any> {
    const payload = { email: email };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json' // Ensure the content type is set if you're sending JSON
    });
    return this.http.post<any>(this.baseUrl + 'RequestPasswordReset',payload,{ headers } );
  }

}
