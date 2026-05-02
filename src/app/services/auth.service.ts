import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly BASE_URL = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) { }

  register(signupRequest: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/sign-up`, signupRequest);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/login`, credentials);
  }

   getOrderByTrackingId(trackingId: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/track/${trackingId}`);
  }
}


