import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { SuccesfulOrder } from '../models/SuccessfulOrder';
import { OrderDetails } from '../models/OrderDetails';
import { BusyShippingDates } from '../models/BusyShippingDates';
import { Receipt } from '../models/Receipt';

@Injectable({
    providedIn: 'root'
})

export class OrderService {

    private busyShipping = new BehaviorSubject<BusyShippingDates[]>([{year: 0, month: 0, day: 0}]);
    public busyShippingOBS = this.busyShipping.asObservable();

    constructor(private http: HttpClient) {

    }

    public order(OrderDetails: OrderDetails): Observable<SuccesfulOrder> { // Sends order to the server.
        return this.http.patch<SuccesfulOrder>("api/api/orders/ordernow", OrderDetails)
    }

    public getReceipt(): Observable<Receipt[]> { // Gets receipt.
        return this.http.get<Receipt[]>("api/api/orders/receipt");
    }

    public getAllBusyShippingDates(): Observable<BusyShippingDates[]> {
        return this.http.get<BusyShippingDates[]>("api/api/orders/getallbusyshippingdates");
    }

    public getBusyShippingDatesFromServer() { // Gets all busy days from the server.
        const observable =  this.getAllBusyShippingDates();
        observable.subscribe(succesfullLoginServerResponse => {
            let dates = succesfullLoginServerResponse;
            this.updateShippingDates(dates);
        }, serverErrorResponse => { 
            alert ("It seems like the system no longer recognizes you. Please login once again to identify yourself.");
           });
    }

    updateShippingDates(dates) {
        this.busyShipping.next(dates);
    }

}