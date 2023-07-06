import { Injectable } from '@angular/core';
import { IProduct } from './product';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private _router: Router) { }

  save(productData: any) {
    var products: any[] = [];
    var newProducts: any = {};

    var productsJSON = localStorage.getItem("products");

    if (productsJSON != null) {
      products = JSON.parse(productsJSON);
    }

    newProducts = productData['newProducts'];

    delete productData['newProducts'];

    products.push(productData);
    products = products.concat(newProducts);
   
    localStorage.setItem("products", JSON.stringify(products));    
  }

  get() : IProduct[]  {
    var products = localStorage.getItem("products");
    if (products === null) {
      return [];
    }

    return JSON.parse(products)
      .map((product: IProduct) => product as IProduct);
  }

  canActivate(): boolean {
    var products = this.get();

    if (products.length === 0) {
      this._router.navigate(['home']);

      return false;
    }

    return true;
  }    
}
