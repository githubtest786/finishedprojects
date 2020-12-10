import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../../services/StatisticsService';
import { NumberOfProducts } from '../../models/NumberOfProducts';
import { NumberOfOrders } from '../../models/NumberOfOrders';
import { CartService } from '../../services/CartService';
import { CartOpen } from '../../models/CartOpen';

@Component({
  selector: 'app-statisticspanel',
  templateUrl: './statisticspanel.component.html',
  styleUrls: ['./statisticspanel.component.css']
})
export class StatisticspanelComponent implements OnInit {

  private statisticsService: StatisticsService;
  public cartService: CartService;
  public numberOfProducts: NumberOfProducts;
  public numberOfOrders: NumberOfOrders;
  currentUserCart;

  currentCartOBS;

  constructor( statisticsService: StatisticsService, cartService: CartService) {
    this.statisticsService = statisticsService;
    this.cartService = cartService;
    this.numberOfProducts = new NumberOfProducts;
    this.numberOfOrders = new NumberOfOrders;
    this.currentUserCart = new CartOpen;
   }

  ngOnDestroy() {
    this.currentCartOBS.unsubscribe();
  }

  ngOnInit() { // Gets the required statistics from the server alongside an observable to a behavior subject on the service in order to check what should be mentioned in terms of cart state.
    let observable = this.statisticsService.getNumberOfProducts();
    observable.subscribe(numberOfProducts => {
      this.numberOfProducts = numberOfProducts;
    }, error => {
      alert ("Failed to get the number of products" + JSON.stringify(error));
    });

    let observable2 = this.statisticsService.getNumberOfOrders();
    observable2.subscribe(numberOfOrders => {
      this.numberOfOrders = numberOfOrders;
    }, error => {
      alert ("Failed to get the number of orders" + JSON.stringify(error));
    });
    
    let unneededDateInformation;
    let creationDate;
    let orderDate;

    this.currentCartOBS = this.cartService.currentCartObs.subscribe(val => {

      if (val.creation_date != null) {

        for (let i = 0; i < val.creation_date.length - 1; i++) {
          if (val.creation_date.charAt(i) == "0" && val.creation_date.charAt(i+1) == "0") {
            unneededDateInformation = i;
            break;
          }
        }
  
        creationDate = val.creation_date.slice(0, unneededDateInformation);

      }

      if (val.order_date != null) {
        for (let i = 0; i < val.order_date.length - 1; i++) {
          if (val.order_date.charAt(i) == "0" && val.order_date.charAt(i+1) == "0") {
            unneededDateInformation = i;
            break;
          }
        }
  
        orderDate = val.order_date.slice(0, unneededDateInformation);
      }

      this.currentUserCart = {creation_date : creationDate, order_date : orderDate};
      });

  }

}
