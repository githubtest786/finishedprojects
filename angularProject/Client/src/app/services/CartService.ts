import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { MyCart } from '../models/MyCart';
import { CartOpen } from '../models/CartOpen';
import { SuccessfulProductResponse } from '../models/SuccessfulProductResponse';

@Injectable({
    providedIn: 'root'
})

export class CartService {

    // public cart: MyCart[] = [];
    private cartItems = new BehaviorSubject<MyCart[]>([]);
    public cartObs = this.cartItems.asObservable();
    private totalPrice = new BehaviorSubject<number>(0);
    updatedPrice = this.totalPrice.asObservable();
    public calculatingPrice : number;
    private currentCart = new BehaviorSubject<CartOpen>({creation_date : "User_offline"});
    currentCartObs = this.currentCart.asObservable();
    public currentUserCart: CartOpen;
    public cartEmpty = true;

    private disableButton = new BehaviorSubject<boolean[]>([]);
    public disableButtonOBS = this.disableButton.asObservable();

    public anyItemsInCart = false;

    newCart = false;

    constructor(private http: HttpClient) {
    }

    public checkIfOpenCartExists(): Observable<CartOpen> { // Checks if a cart is open, for statistics purposes.
        return this.http.get<CartOpen>("api/api/carts/cartexists");
    }

    public updateCurrentUserCart() { // Updates the current state of the user's cart.
        const observable = this.checkIfOpenCartExists();
        observable.subscribe(succesfullLoginServerResponse => {  
            this.currentUserCart = succesfullLoginServerResponse;
            this.updateLatestCart(this.currentUserCart);
        }, serverErrorResponse => { 
            alert ("It seems like the system no longer recognizes you. Please login once again to identify yourself.");
           });
    }

    public openNewCart(): Observable<CartOpen> { // Opens a new cart.
        return this.http.post<CartOpen>("api/api/carts/opennewcart", null)
    }

    public updateNewlyMadeUserCart() { // Opens a new cart.
        const observable = this.openNewCart();
        observable.subscribe(succesfullLoginServerResponse => {
            this.updateCartProducts([]);
            this.updatePrice(0);
            this.currentUserCart = succesfullLoginServerResponse;
            this.updateLatestCart(this.currentUserCart);
            this.anyItemsInCart = false;
        }, serverErrorResponse => { 
            alert ("It seems like the system no longer recognizes you. Please login once again to identify yourself.");
            localStorage.removeItem("token");
            this.updateCartProducts([]);
           });
    }
    
    public getAllCartItems(): Observable<MyCart[]> { // Gets all cart items from the server.
        return this.http.get<MyCart[]>("api/api/carts/getallcartitems");
    }

    public updateExistingCartItemsIntoCart() { // Updates the cart items observable with the cart items.
        const observable = this.getAllCartItems();
        observable.subscribe(succesfullLoginServerResponse => {
            this.updateCartProducts(succesfullLoginServerResponse);
            this.calculatePrice();
            this.anyItemsInCart = true;
            // this.updateLatestCart(this.currentUserCart);
        }, serverErrorResponse => { 
            alert ("It seems like the system no longer recognizes you. Please login once again to identify yourself.");
            localStorage.removeItem("token");
            this.updateCartProducts([]);
           });
    }

    public calculatePrice() { // Calculates the current total price and updates the total price observable.
        this.calculatingPrice = 0;
        for (let i = 0; i < this.cartItems.value.length; i++){
            this.calculatingPrice = this.calculatingPrice + this.cartItems.value[i].price;
        }

        this.updatePrice(this.calculatingPrice);
    }


    public updateServerWithUpdatedProductInCart(updatedProductDetails: MyCart): Observable<SuccessfulProductResponse> { // Updates the server when a user changes the amount of picked product in his cart.
        return this.http.patch<SuccessfulProductResponse>("api/api/carts/updateproductincart", updatedProductDetails);
    }

    public updateProductPrice(id, product_name, amount, price) { // Sends the details to the server, alongside calculating the new total price.

        let updatedProductDetails = {
            product_name : product_name,
            amount : amount,
            price : price,
        }

        const observable = this.updateServerWithUpdatedProductInCart(updatedProductDetails);
        observable.subscribe(succesfullLoginServerResponse => {
            for (let i = 0; i < this.cartItems.value.length; i++ ) {
                if (id == i) {
                    this.cartItems.value[i].amount = amount;
                    this.cartItems.value[i].price = price;
                }
            }
            this.calculatePrice();
        }, serverErrorResponse => { 
            alert ("It seems like the system no longer recognizes you. Please login once again to identify yourself.");
           });
    }

    public addNewProduct(product) { // Adds a new product to the cart and the server.
        const observable =  this.updateCartWithNewProduct(product);
        observable.subscribe(succesfullLoginServerResponse => {
            let newArray = this.cartItems.value;
            newArray.push(product);
            this.updateCartProducts(newArray);
            this.calculatePrice();
        }, serverErrorResponse => { 
            alert ("Either the product no longer exists or the system no longer recognizes you. Please login and try again.");
           });
    }

    public updateCartWithNewProduct(product : MyCart): Observable<SuccessfulProductResponse> {
        return this.http.post<SuccessfulProductResponse>("api/api/carts/addnewproducttocart", product);
    }

    public isCartEmpty() { // Checks if the cart is empty (Wasn't updated with information).
        if (this.cartItems.value.length > 0) {
            return false;
        }
        return true;
    }

    public checkCartStatus() {
        return this.currentCart.value;
    }

    public emptyCart() { // Empties the cart, alongside deletes all cart items in the specific cart in the server.
        const observable =  this.clearCartCompletely();
        observable.subscribe(succesfullLoginServerResponse => {
            this.cartItems.value.splice(0, this.cartItems.value.length);
            this.calculatePrice();
        }, serverErrorResponse => { 
            alert ("Either the cart no longer exists or the system no longer recognizes you. Please login and try again.");
           });
    }

    public removeProductFromCart(product_id, product_name) { // Removes a specific product from the cart.
        const observable =  this.removeProductFromCartDB(product_name);
        observable.subscribe(succesfullLoginServerResponse => {
            this.cartItems.value.splice(product_id, 1);
            this.calculatePrice();
        }, serverErrorResponse => { 
            alert ("Either the product no longer exists or the system no longer recognizes you. Please login and try again.");
           });
    }

    public removeProductFromCartDB(product : string): Observable<SuccessfulProductResponse> {
        return this.http.delete<SuccessfulProductResponse>("api/api/carts/removeproductfromcart/" + product);
    }

    public clearCartCompletely(): Observable<SuccessfulProductResponse> {
        return this.http.delete<SuccessfulProductResponse>("api/api/carts/clearcart");
    }

    public disableButtonInitialize() {
        this.disableButton[0] = [false];
    }

    updatePrice(price) {
        this.totalPrice.next(price);
    }

    updateLatestCart(cart) {
        this.currentCart.next(cart);
    }

    updateCartProducts(cart) {
        this.cartItems.next(cart);
    }

    updateDisableArray(array) {
        this.disableButton.next(array);
    }

}