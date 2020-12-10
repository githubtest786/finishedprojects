import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/CartService';
import { CartOpen } from '../../models/CartOpen';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  private cartService : CartService;
  currentUserCart;

  public pickedButton = "headerButton current";
  public regularButton = "headerButton";

  constructor(cartService : CartService, private router: Router) { 
    this.cartService = cartService;
    this.currentUserCart = new CartOpen;
  }

  public home() { // Marks the home button on the header component.
    this.router.navigate(["/home"]);
  }

  public shopping() { // Creates/updates the cart according to its current state and moves the user to the shopping component.
    if (localStorage.getItem("token") != null) {
      if (this.currentUserCart.creation_date == null && this.currentUserCart.order_date == null || this.currentUserCart.creation_date != null && this.currentUserCart.order_date != null) {
        this.cartService.updateNewlyMadeUserCart();
        this.cartService.newCart = true;
      }
      else {
        if (this.cartService.isCartEmpty()){
          this.cartService.updateExistingCartItemsIntoCart();
        }
      }
      this.router.navigate(["/shopping"]);
    }
    else {
      alert ("You cannot purchase any of our items before logging in.");
      this.router.navigate(["/home"]);
    }
  }

  public order() { // Blocks the abiltiy to enter the order component by the UI assuming they haven't logged in, or they just ordered without opening a new cart.
    if (localStorage.getItem("token") != null) {
      if (this.currentUserCart.creation_date != null && this.currentUserCart.order_date != null) {
        alert ("First make sure to order something in our shopping component before attempting to order anything");
      }
      else {
        this.router.navigate(["/order"]);
      }
    }
    else {
      alert ("You cannot order any of our items before logging in.");
      this.router.navigate(["/home"]);
    }

  }

  ngOnInit() {
    this.cartService.currentCartObs.subscribe(val => this.currentUserCart = val);
  }

}
