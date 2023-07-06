import { Component } from '@angular/core';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  products : Array<any> = [];

  constructor(private _productService: ProductService) {}

  ngOnInit() {
    this.getProducts();
  } 

  getProducts() {
    this.products = this._productService.get();
  }
}
