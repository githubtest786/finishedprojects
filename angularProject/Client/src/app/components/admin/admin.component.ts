import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CategoryService } from 'src/app/services/CategoryService';
import { Category } from 'src/app/models/Category';
import { ProductService } from 'src/app/services/ProductService';
import { Product } from '../../models/Product';
import { UpdateProduct } from '../../models/UpdateProduct';
import { UploadService } from 'src/app/services/UploadService';
import { HttpEventType } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NewProduct } from 'src/app/models/NewProduct';
import { UserService } from '../../services/UserService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  private categoryService: CategoryService;
  public categories: Category[];
  private productService : ProductService;
  public products: Product[];
  searchName: string;
  public productDetails : NewProduct;
  public updateProductDetails : UpdateProduct = {};
  private userService : UserService;

  public newProduct = true;
  public original_product_name;

  public currentProductPage;
  filterButtonPressed: boolean = false;

  private uploadService : UploadService;

  public files = [];

  @ViewChild("fileUpload", { static: false })
  fileUpload: ElementRef;
  public uploadedImageName;

  public wasImagePicked = false;

  categoriesOBS;
  productsOBS;
  userDetailsOBS;

  private role = "";

  constructor(categoryService : CategoryService, uploadService: UploadService, productService : ProductService, userService : UserService, private router: Router) { 
    this.categoryService = categoryService;
    this.productService = productService;
    this.uploadService = uploadService;
    this.userService = userService;
    this.productDetails = new Product();
  }

  public pickCategory(category_name) { // Filters by category.
    this.currentProductPage = category_name;
    this.filterButtonPressed = false;
  }

  public nameFilter(name) { // Filters by name.
    this.filterButtonPressed = true;
    this.currentProductPage = name;
  }

  public resetFilter() { // Resets filter.
    this.filterButtonPressed = false;
    this.currentProductPage = null;
  }

  public addNewProduct() { // Resets the inputs on the left panel.
    this.productDetails.product_name = null;
    this.productDetails.category_name = null;
    this.productDetails.price = null;
    this.files = [];
    this.newProduct = true;
  }

  public sendNewProduct() { // Sends the new product details to the server, including the image.

    if (this.productDetails.product_name == null || this.productDetails.product_name == "") {
      alert ("Can't upload a prouct without a name");
    }
    else if (this.checkIfProductNameIsTaken()) {
      alert ("Can't create a product with a product name that is already taken");
    }
    else if (this.productDetails.category_name == null || this.productDetails.category_name == "") {
      alert ("Can't upload a product without a category");
    }
    else if (this.productDetails.price == null || this.productDetails.price <= 0) {
      alert ("Can't upload a product without a price");
    }
    else if (!this.wasImagePicked)
    {
      alert("Can't upload a product with an image");
    }
    else {

        this.uploadFiles(this.productDetails);

    }
  }

  public checkIfProductNameIsTaken() {
    for (let i = 0; i < this.products.length; i++) {
      if (this.productDetails.product_name == this.products[i].product_name) {
        return true;
      }
    }
    return false;
  }

  public sendUpdatedProduct() {  // Sends the updated product details to the server, including the image.

    this.updateProductDetails.original_name = this.original_product_name;
    this.updateProductDetails.product_name = this.productDetails.product_name;
    this.updateProductDetails.category_name = this.productDetails.category_name;
    this.updateProductDetails.price = this.productDetails.price;

    if (this.updateProductDetails.product_name == null || this.updateProductDetails.product_name == "") {
      alert ("Can't upload a prouct without a name");
    }
    else if (this.checkIfNewNameIsTaken()) {
      alert ("Can't update a product with a name that belongs to another product before changing the other one's name!");
    }
    else if (this.updateProductDetails.category_name == null || this.updateProductDetails.category_name == "") {
      alert ("Can't upload a product without a category");
    }
    else if (this.updateProductDetails.price == null || this.updateProductDetails.price <= 0) {
      alert ("Can't upload a product without a price");
    }
    else {
      if (this.wasImagePicked && this.files.length > 0) {

        this.uploadFiles(this.updateProductDetails);

        this.wasImagePicked = false;

        this.productService.updateProducts();
      }
      else {
        const observable = this.productService.updateSpecificProduct(this.updateProductDetails);
        observable.subscribe(succesfulServerRequestData => {
  
          this.productService.updateProducts();
          this.updateProductDetails.product_name = "";
          this.updateProductDetails.category_name = "";
          this.updateProductDetails.price = null;
          this.original_product_name = "";
          this.productDetails.product_name = "";
          this.productDetails.category_name = "";
          this.productDetails.price = null;
          this.newProduct = true;
          this.files = [];
          this.wasImagePicked = false;
        }, serverErrorResponse => {
          alert ("You have entered incorrect details.");
        });
      }
    }
}

  public checkIfNewNameIsTaken() {

    let originalNameIndex;

    for (let i = 0; i < this.products.length; i++) {
      if (this.updateProductDetails.original_name == this.products[i].product_name) {
        originalNameIndex = i;
      }
    }

    for (let i = 0; i < this.products.length; i++) {
      if (i != originalNameIndex && this.updateProductDetails.product_name == this.products[i].product_name) {
        return true;
      }
    }

    return false;
  }

  public editProduct(product_name, category_name, price, image) { // Displays the picked product's details.
    this.productDetails.product_name = product_name;
    this.productDetails.category_name = category_name;
    this.productDetails.price = price;
    this.newProduct = false;
    this.original_product_name = product_name;
  }


  onClick() { // Image uploading function.
    this.files = [];
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.onchange = () => {

      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        // console.log("Uploaded file :" + file);
        this.files.push({ name: file.name, data: file, inProgress: false, progress: 0});
      }
    }
    fileUpload.click();
    this.wasImagePicked = true;
  }

  uploadFile(file, details) { // Uploades the image to the server.
    
    const formData = new FormData();
    formData.append('file', file.data);
    file.inProgress = true;
    formData.append("details", JSON.stringify(details));
    let observable;
    if (this.newProduct) {
      observable = this.uploadService.upload(formData);
    }
    else {
      observable = this.uploadService.updateUpload(formData);
    }

    observable.subscribe(succesfullLoginServerResponse => {
      this.uploadedImageName = "http://localhost:3000/uploads/ + event.body.name";
      this.productService.updateProducts();
      this.updateProductDetails.product_name = "";
      this.updateProductDetails.category_name = "";
      this.updateProductDetails.price = null;
      this.original_product_name = "";
      this.productDetails.product_name = "";
      this.productDetails.category_name = "";
      this.productDetails.price = null;
      this.newProduct = true;
      this.files = [];
      this.wasImagePicked = false;
      }, serverErrorResponse => { 
      alert ("Error! Status: " + serverErrorResponse.status + ", Message: " + serverErrorResponse.message);
    });
  }

  private uploadFiles(productDetails) {
    this.fileUpload.nativeElement.value = '';

    this.files.forEach(file => {
      this.uploadFile(file, productDetails);
    })
  }

  ngOnDestroy() {
    if (localStorage.getItem("token") != null) {
      this.categoriesOBS.unsubscribe();
      this.productsOBS.unsubscribe();
      this.userDetailsOBS.unsubscribe();
    }
  }

  ngOnInit(): void {
    if (localStorage.getItem("token") == null) {
      this.router.navigate(["/home"]);
    }
    else {
      this.categoryService.updateCategories();
      this.categoriesOBS = this.categoryService.categoriesOBS.subscribe(val => this.categories = val);
      this.productService.updateProducts();
      this.productsOBS = this.productService.productsOBS.subscribe(val => this.products = val);
      if (!this.userService.userDetailsNotEmpty) {
        this.userService.getUserDetails();
      }
      this.userDetailsOBS = this.userService.roleOBS.subscribe(val => {
        this.role = val;
        if (localStorage.getItem("token") == null) {
          this.router.navigate(["/home"]);
        }
        else if (this.role != "" && this.role != "admin") {
          this.router.navigate(["/home"]);
        }
      });
    }

  }

}
