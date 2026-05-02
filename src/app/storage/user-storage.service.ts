import { Injectable } from '@angular/core';

const TOKEN ='ecom-token';
const USER = 'ecom-user';

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {

constructor() { }

  static saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.setItem(TOKEN, token);
  }

  static saveUser(user: any): void {
    window.localStorage.removeItem(USER);
    window.localStorage.setItem(USER, JSON.stringify(user));
  }

  static getToken(): string | null {
    return localStorage.getItem(TOKEN);
  }

  static getUser(): any {
    const userStr = localStorage.getItem(USER);
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

static getUserId(): string {
  const user = this.getUser();
  return user?.id?.toString() ?? '';
}

  static getUserRole(): string {
  const user = this.getUser();
  return user?.userRole ?? ''; 
}

  static isAdminLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    return this.getUserRole() === 'ADMIN';
  }

  static isCustomerLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    return this.getUserRole() === 'CUSTOMER';
  }

  static signOut(): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.removeItem(USER);
  }

}
