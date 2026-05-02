import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductPage } from '../../admin/service/product.service';
import { UserStorageService } from '../../storage/user-storage.service';
import { CartItemResponse } from '../model/cartItemResponse.model';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private baseUrl = 'http://localhost:8080/api/customer'; 

  constructor(private http : HttpClient) { }


  getProducts(page: number = 0, size: number = 8): Observable<ProductPage> {
      const params = new HttpParams()
        .set('page', page)
        .set('size', size);
  
      return this.http.get<ProductPage>(`${this.baseUrl}/products`, { params });
  }
  
    getProductsByName(name: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/search/${name}`);
  }

addToCart(productId: number): Observable<CartItemResponse> {
  const cartDto = {
    productId: productId,
    userId: UserStorageService.getUserId()
  };

  return this.http.post<CartItemResponse>(`${this.baseUrl}/cart`, cartDto);
}

increaseProductquantity(productId: number): Observable<CartItemResponse> {
  const cartDto = {
    productId: productId,
    userId: UserStorageService.getUserId()
  };

  return this.http.post<CartItemResponse>(`${this.baseUrl}/addition`, cartDto);
}

decreaseProductQuantity(productId: number): Observable<CartItemResponse> {
  const cartDto = {
    productId: productId,
    userId: UserStorageService.getUserId()
  };

  return this.http.post<CartItemResponse>(`${this.baseUrl}/decrease`, cartDto);
}

placeOrder(orderDto: any): Observable<any>{
  orderDto.userId = UserStorageService.getUserId()
  return this.http.post(`${this.baseUrl}/placeOrder`,orderDto);
}

getCartByUserId(): Observable<any> { 
  const userId = UserStorageService.getUserId();
  return this.http.get(`${this.baseUrl}/cart/${userId}`);
}

applyCoupon(code : any): Observable<any>{
    const userId =UserStorageService.getUserId()
    return this.http.get(`${this.baseUrl}/coupon/${userId}/${code}`);  
}

getProductDetailById(productId: number) : Observable<any> {
    return this.http.get(`${this.baseUrl}/product/${productId}`);
}


getOrderByUserId(): Observable<any>{
  const userId = UserStorageService.getUserId();
  return this.http.get(`${this.baseUrl}/my-placed-orders/${userId}`);
}

getOrderedProducts(orderId : number){
  return this.http.get(`${this.baseUrl}/ordered-products/${orderId}`)
}

giveReview(reviewDto : any): Observable<any>{
  return this.http.post(`${this.baseUrl}/reviews/` , reviewDto);
}

addProductTowishlist(wishlistDto : any): Observable<any> {
  return this.http.post(`${this.baseUrl}/wishlist` , wishlistDto);
}

getwishlistById(): Observable<any>{
   const userId = UserStorageService.getUserId();
  return this.http.get(`${this.baseUrl}/wishlist/${userId}`);
}

removeFromCart(productId: number): Observable<any> {
  const userId = UserStorageService.getUserId();
  return this.http.delete(`${this.baseUrl}/cart/${userId}/${productId}`, { responseType: 'text' });
}
removeFromWishlist(userId: number, productId: number): Observable<any> {
  return this.http.delete(
    `${this.baseUrl}/wishlist/${userId}/${productId}`,
    { responseType: 'text' }  
  );
}


}
