import { Component, OnInit } from '@angular/core';
import { OrderDetails } from '../../models/OrderDetails';
import { OrderService } from '../../services/OrderService';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/UserService';
import { UserDetails } from '../../models/UserDetails';
import { BusyShippingDates } from '../../models/BusyShippingDates';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap';
import { MyCart } from '../../models/MyCart';
import { CartService } from '../../services/CartService';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Receipt } from 'src/app/models/Receipt';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  private orderService : OrderService;
  public orderDetails: OrderDetails;
  model: NgbDateStruct;
  date: {year: number, month: number};
  private userService : UserService;
  userDetails;
  currentYear;
  currentMonth;
  currentDay;
  public busyShippingDates: BusyShippingDates[] = [{year: 0, month: 0, day: 0}];
  isDisabled;
  public disabledCode: string = "";
  public myCart: MyCart[];
  private cartService : CartService;

  public receiptText : Receipt[];

  public text: string;

  currentUserCart;

  private busyShippingOBS;
  private userDetailsOBS;
  private cartOBS;
  private currentUserCartOBS;

  fileUrl;

  constructor( orderService: OrderService, userService : UserService, cartService : CartService, private calendar: NgbCalendar, private modalService: NgbModal, private router: Router, private sanitizer: DomSanitizer) { 
    this.orderDetails = new OrderDetails();
    this.orderService = orderService;
    this.userService = userService;
    this.userDetails = new UserDetails;
    this.cartService = cartService;
  }

  public order(content): void { // Sends an order request to the server.
    if (this.myCart.length == 0) {
      alert ("Cannot order an order with no products");
    }
    else {
      const observable = this.orderService.order(this.orderDetails);

      observable.subscribe(succesfulServerRequestData => {

        this.modalService.open(content);

        const observable =  this.orderService.getReceipt();
        observable.subscribe(succesfullLoginServerResponse => {
          this.receiptText = succesfullLoginServerResponse;
          this.text = "";
          for (let i = 0; i < this.receiptText.length; i++) {
            if (i < this.receiptText.length-1){
              let helper = "Product name: " + this.receiptText[i].name + " amount : " + this.receiptText[i].amount + " price : " + this.receiptText[i].price + " \n";
              this.text = this.text.concat(helper);
            }
            else {
              let helper = "Total price: " + this.receiptText[i].price;
              this.text = this.text.concat(helper);
            }
          }
          const blob = new Blob([this.text], { type: 'application/octet-stream' });
    
          this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
    
        }, serverErrorResponse => { 
            alert ("Error! Status: " + serverErrorResponse.status + ", Message: " + serverErrorResponse.message);
           });

      }, serverErrorResponse => { 
        alert ("Error! Status: " + serverErrorResponse.status + ", Message: " + serverErrorResponse.message);
      }); 
    }
  }

  public prepareBusyDates() { // Prepares all busy days into a format that would fit NgbCalendar, in order to block busy days from being picked in the calendar.
    let stringHelper;
    let stringHelper2;
    if (this.busyShippingDates[0] != null) {
      if(this.busyShippingDates[0].year != 0 ) {
        for (let i = 0; i < this.busyShippingDates.length; i++) {
          if (i != this.busyShippingDates.length -1) {
            stringHelper = "date.year === this.busyShippingDates[" + i + "].year && date.month === this.busyShippingDates[" + i + "].month && date.day === this.busyShippingDates[" + i + "].day || ";
            stringHelper2 = this.disabledCode.concat(stringHelper);
            this.disabledCode = stringHelper2;
          }
          else {
            stringHelper = "date.year === this.busyShippingDates[" + i + "].year && date.month === this.busyShippingDates[" + i + "].month && date.day === this.busyShippingDates[" + i + "].day";
            stringHelper2 = this.disabledCode.concat(stringHelper);
            this.disabledCode = stringHelper2;
          }
        }
      }
    }
  }

  public postCity() { // Posts the user's city on double click.
    this.orderDetails.city = this.userDetails.city;
  }

  public postStreet() { // Posts the user's street on double click.
    this.orderDetails.street = this.userDetails.street;
  }

  save() { // Closes modal.
    this.modalService.dismissAll();
    this.cartService.updateLatestCart({creation_date : null, order_date : null});
    this.router.navigate(["/home"]);
  }

  public getReceipt(receipt) { // Opens a new modal with a request to get all cart details, in order to get a pop-up receipt.
  }

  ngOnDestroy() {
    if (localStorage.getItem("token") != null) {
      this.busyShippingOBS.unsubscribe();
      this.userDetailsOBS.unsubscribe();
      this.cartOBS.unsubscribe();
      this.currentUserCartOBS.unsubscribe();
    }
  }

  ngOnInit(): void {

    if (localStorage.getItem("token") == null) {
      this.router.navigate(["/home"]);
    }
    else {
      let currentDate = new Date;
      this.currentYear = currentDate.getFullYear();
      this.currentMonth = currentDate.getMonth() + 1;
      this.currentDay = currentDate.getDate();
  
      if (!this.userService.userDetailsNotEmpty) {
        this.userService.getUserDetails();
      }
        this.userDetailsOBS = this.userService.userDetailsOBS.subscribe(val => this.userDetails = val);
        this.cartOBS = this.cartService.cartObs.subscribe(val => this.myCart = val);
  
        this.orderService.getBusyShippingDatesFromServer();
        this.busyShippingOBS = this.orderService.busyShippingOBS.subscribe(val => { 
          this.busyShippingDates = val;
          this.disabledCode = "";
          this.prepareBusyDates();
          this.isDisabled = (date: NgbDate, current: {month: number}) => eval(this.disabledCode);
        });
  
        this.cartService.updateCurrentUserCart();
        this.currentUserCartOBS = this.cartService.currentCartObs.subscribe(val => {
          this.currentUserCart = val;
          if (this.currentUserCart.creation_date == null && this.currentUserCart.order_date == null || this.currentUserCart.creation_date != null && this.currentUserCart.order_date != null) {
            this.router.navigate(["/home"]);
          }
        });
    }
  }

}
