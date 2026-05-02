import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../modal/product.model';
export interface ProductPage {
  content: Product[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:8080/api/admin'; 

  constructor(private http: HttpClient) {}

  getProducts(page: number = 0, size: number = 8): Observable<ProductPage> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<ProductPage>(`${this.baseUrl}/products`, { params });
  }

  getProductById(productId : any): Observable<any> {
    return this.http.get(`${this.baseUrl}/products/${productId}`);
  }
  
  postProduct(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/addproduct`, formData);
  }

  updateProduct(productId:any ,formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/product/${productId}`, formData);
  }

  getProductsByName(name: string): Observable<any> {
  return this.http.get(`${this.baseUrl}/search/${name}`);
}

deleteProduct(productId: any): Observable<any> {
  return this.http.delete(`${this.baseUrl}/product/${productId}`);
}

}