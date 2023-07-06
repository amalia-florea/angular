import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { productValidator } from '../shared/product.validator';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent implements OnInit {
  title = 'ReactiveForms';

  categories = ['Electronics', 'Cloths', 'Blankets'];
  phoneTypes = ['Mobile', 'Landline'];

  productForm!: FormGroup;

  canAddNewProduct: boolean = true;
  submitted: boolean = false;

  get name() {
    return this.productForm.get('name')!;
  }

  get description() {
    return this.productForm.get('description')!;
  }

  get category() {
    return this.productForm.get('category')!;
  }    

  get price() {
    return this.productForm.get('price')!;
  }  

  get imageURL() {
    return this.productForm.get('imageURL')!;
  }  

  get phone() {
    return this.productForm.get('phone')!;
  } 
  
  get phoneType() {
    return this.productForm.get('phoneType')!;
  }    

  get newProducts() {
    return this.productForm.get('newProducts')! as FormArray;
  }  

  constructor(private fb: FormBuilder, private _productService: ProductService) {}

  ngOnInit(): void { 
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), productValidator(new RegExp("^[a-zA-Z0-9 ]+$"))]],
      description: ['', [Validators.required, Validators.minLength(3), productValidator(new RegExp("^[a-zA-Z0-9 ]+$"))]],
      price: ['', [Validators.required, productValidator(new RegExp("^[0-9]+(\.[0-9]{1,2})?$"))]],
      category: ['', Validators.required],
      imageURL: ['', [Validators.required, productValidator(new RegExp("^http[s]?:\/\/.*\.(?:png|jpg|gif|svg|jpeg)$"))]],
      phone: ['', [Validators.required, Validators.maxLength(10), productValidator(new RegExp("^[0-9]*$"))]],
      phoneType: [''],
      newProducts: this.fb.array([])
    });
  }  

  addNewProduct() { 
    
    if (this.newProducts.length < 4) {
      this.newProducts.push(this.fb.group({    
        name: ['', [Validators.required, Validators.minLength(3), productValidator(new RegExp("^[a-zA-Z0-9 ]+$"))]],
        description: ['', [Validators.required, Validators.minLength(3), productValidator(new RegExp("^[a-zA-Z0-9 ]+$"))]],
        price: ['', [Validators.required, productValidator(new RegExp("^[0-9]+(\.[0-9]{1,2})?$"))]],
        category: ['', Validators.required],
        imageURL: ['', [Validators.required, productValidator(new RegExp("^http[s]?:\/\/.*\.(?:png|jpg|gif|svg|jpeg)$"))]],
        phone: ['', [Validators.required, Validators.maxLength(10), productValidator(new RegExp("^[0-9]*$"))]],
        phoneType: ['']
      }));

      if (this.newProducts.length == 4) {
        this.canAddNewProduct = false;
      }
    } 
  }  

  onSubmit() {
    this.submitted = true;
    this._productService.save(this.productForm.value);  
  }
}
