import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/CategoryService';
import { Category } from '../../models/Category';
import { ProductService } from '../../services/ProductService';
import { Product } from '../../models/Product';
import { CartService } from '../../services/CartService';
import { MyCart } from '../../models/MyCart';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../../services/OrderService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.css'],
})
export class ShoppingComponent implements OnInit {

  private categoryService: CategoryService;
  public categories: Category[];
  private productService: ProductService;
  public products: Product[];
  amount: number[] = [];
  private cartService: CartService;
  public newCartProduct: MyCart;
  searchName: string;
  filterButtonPressed: boolean = false;
  public disableButton = [];
  private orderService : OrderService;
  private currentUserCartOBS;
  currentUserCart;
  
  myCart : MyCart[];

  public currentShoppingPage;

  showCart = true;

  cartOBS;
  disableButtonOBS;
  productsOBS;
  categoriesOBS;

  constructor ( categoryService: CategoryService, productService: ProductService, cartService: CartService, orderService : OrderService, private modalService: NgbModal, private router: Router ) {
    this.categoryService = categoryService; 
    this.productService = productService;
    this.cartService = cartService;
    this.orderService = orderService;
  }

  public pickCategory(category_name) { // Acts as a filter for sorting categories on click
    this.currentShoppingPage = category_name;
    this.filterButtonPressed = false;
  }

  public decreaseAmount(product_id) { // Decreases the amount picked.
    if (this.amount[product_id] > 0) {
      this.amount[product_id]--;
    }
  }

  public increaseAmount(product_id) { // Increases the amount picked.
    this.amount[product_id]++;
  }

  public nameFilter(name) { // Acts as a filter by name written.
    this.filterButtonPressed = true;
    this.currentShoppingPage = name;
  }

  public resetFilter() { // Resets the filter.
    this.filterButtonPressed = false;
    this.currentShoppingPage = null;
  }

  public addProductToCart(index, product_name, price, amount) { // Adds a product to the cart and updates the visuals.
    if (amount == 0) {
      alert ("The quantity must be atleast 1 in order to purchase the item.");
    }
    else {
      let finalPrice = price * amount;
      this.newCartProduct = {product_name : product_name, amount : amount, price : finalPrice}
      // this.cartService.cartCopy.push(this.newCartProduct);
      this.cartService.addNewProduct(this.newCartProduct);
      this.cartService.calculatePrice();
      this.disableButton[index] = true;
      this.cartService.updateDisableArray(this.disableButton);
    }
  }

  public hideCart() { // Hides or reveals the cart, depending on what had happened previously.

    if (this.showCart) {
      this.showCart = false;
    }
    else {
      this.showCart = true;
    }
  }
  
  open(content) { // Opens the modal.
    this.modalService.open(content);
  }

  save(index, product_name, price, amount) { // Closes the modal, updates cart.
    this.addProductToCart(index, product_name, price, amount);
    this.amount[index] = 0;
    this.modalService.dismissAll();
  }

  ngOnDestroy() {    
    if (localStorage.getItem("token") != null) {
      this.cartOBS.unsubscribe();
      this.disableButtonOBS.unsubscribe();
      this.productsOBS.unsubscribe();
      this.categoriesOBS.unsubscribe();
      this.currentUserCartOBS.unsubscribe();
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
        this.productsOBS = this.productService.productsOBS.subscribe(val => {
          this.products = val;
          this.disableButton = new Array(this.products.length);
          this.amount = new Array(this.products.length);
          if (this.products.length == 0) {
            this.cartOBS = this.cartService.cartObs.subscribe(val => {
              this.myCart = val;
            })
          }
          else {
            for (let i = 0; i < this.products.length; i++) {
              this.amount[i] = 0;
              this.disableButton[i] = false;
                this.cartOBS = this.cartService.cartObs.subscribe(val => {
                this.myCart = val;
                for (let i = 0; i < this.products.length; i++) {
                  for (let j = 0; j < this.myCart.length; j++) {
                    if (this.myCart[j].product_name == this.products[i].product_name) {
                      this.disableButton[i] = true;
                    }
                  }
                }
              });
            }
          }
          this.cartService.updateDisableArray(this.disableButton);
          this.disableButtonOBS = this.cartService.disableButtonOBS.subscribe(val => this.disableButton = val);
        });

        if(this.cartService.checkCartStatus().creation_date == "User_offline") {
          this.cartService.updateCurrentUserCart();
        }

        this.currentUserCartOBS = this.cartService.currentCartObs.subscribe(val => {
          this.currentUserCart = val;
          if (!this.cartService.newCart) {
            if (this.currentUserCart.creation_date == null && this.currentUserCart.order_date == null || this.currentUserCart.creation_date != null && this.currentUserCart.order_date != null) {
              this.router.navigate(["/home"]);
            }
          }

        });
    }
  }

}
