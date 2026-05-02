import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../modal/category.model';

const BASE_URL="http://localhost:8080/api/admin/";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

 
addCategory(category: any): Observable<any> {
  return this.http.post(`${BASE_URL}category`, category);
}

getCategories(): Observable<Category[]>  {
    return this.http.get<Category[]>(`${BASE_URL}all`);
}

deleteCategory(id: number): Observable<any> {
    return this.http.delete(BASE_URL + 'category/' + id);
}

addCoupon(couponDto:any): Observable<any> {
  return this.http.post(`${BASE_URL}coupons` , couponDto);
}

getCoupons(): Observable<any> {
  return this.http.get(`${BASE_URL}coupons`);
}
getPlacedOrders(): Observable<any> {
  return this.http.get(`${BASE_URL}placedOrders`);
}

changeOrderStatus(orderId: number , status:string): Observable<any> {
  return this.http.get(`${BASE_URL}order/${orderId}/${status}`);
}

PostFaq(productId: number , faqDto: any): Observable<any> {
  return this.http.post(`${BASE_URL}faq/${productId}`,faqDto);
}

getAnalytics(): Observable<any> {
  return this.http.get(`${BASE_URL}analytics`);
}

}
