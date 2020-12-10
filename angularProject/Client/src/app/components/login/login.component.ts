import { Component, OnInit } from '@angular/core';
import { UserLoginDetails } from '../../models/UserLoginDetails';
import { UserService } from '../../services/UserService';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/CategoryService';
import { ProductService } from '../../services/ProductService';
import { CartService } from '../../services/CartService';
import { CartOpen } from '../../models/CartOpen';
import { UserDetails } from '../../models/UserDetails';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public userLoginDetails: UserLoginDetails;
  private usersService: UserService;
  public isUserLoggedIn = false;
  private categoryService: CategoryService;
  private productService: ProductService;
  private cartService : CartService;
  name: string;
  currentUserCart;
  firstNameOBS;
  currentCartOBS;

  constructor(usersService: UserService, categoryService: CategoryService, productService: ProductService, cartService : CartService, private router: Router) { 
    this.userLoginDetails = new UserLoginDetails();
    this.usersService = usersService;
    this.categoryService = categoryService;
    this.productService = productService;
    this.cartService = cartService;
    this.currentUserCart = new CartOpen;

  }

  public login(): void { // login function. Upon login the function saves the users' details in a client-like cache, checks and updates the current user's cart if they have one, and puts them in the proper place according to their user role.
    const observable = this.usersService.login(this.userLoginDetails);

    observable.subscribe(succesfulServerRequestData => {

      // console.log(succesfulServerRequestData);

      localStorage.setItem("token", succesfulServerRequestData.token +"");
      this.usersService.getUserDetails();
      this.firstNameOBS = this.usersService.firstNameOBS.subscribe(val => this.name = val);
      this.cartService.updateCurrentUserCart();
      this.isUserLoggedIn = true;
      this.currentCartOBS = this.cartService.currentCartObs.subscribe(val => this.currentUserCart = val);
      if (succesfulServerRequestData.userType == "admin"){
        this.router.navigate(["/admin"]);
      }
      else {
        this.router.navigate(["/home"]);
      }
    }, serverErrorResponse => { 
      alert (serverErrorResponse.error);
    });
  }

  public signUp(): void { // Moves to the sign up component
    this.router.navigate(["/signup"]);
  }

  public startShopping(): void { // Creates a new cart if there is no available one, and moves the user to the shopping component.
    this.cartService.updateNewlyMadeUserCart();
    this.router.navigate(["/shopping"]);
    this.cartService.newCart = true;
    
  }

  public resumeShopping(): void { // Picks an available cart and moves the user to the shopping component.
    if (this.cartService.isCartEmpty()) {
      this.cartService.updateExistingCartItemsIntoCart();
    }
    this.router.navigate(["/shopping"]);
  }

  ngOnDestroy() {
    if (localStorage.getItem("token") != null) {
      this.firstNameOBS.unsubscribe();
      this.currentCartOBS.unsubscribe();
    }
  }

  ngOnInit() {
    if (localStorage.getItem("token") != null) {
      this.isUserLoggedIn = true;
      if (!this.usersService.userDetailsNotEmpty) {
        this.usersService.getUserDetails();
      }
      this.firstNameOBS = this.usersService.firstNameOBS.subscribe(val => {
        if (val == null) {
          localStorage.removeItem("token");
          this.isUserLoggedIn = false;
        }
        else {
          this.name = val
        }
      });
      this.currentCartOBS = this.cartService.currentCartObs.subscribe(val => this.currentUserCart = val);
    }
    else {
      this.isUserLoggedIn = false;
    }
  }

}
