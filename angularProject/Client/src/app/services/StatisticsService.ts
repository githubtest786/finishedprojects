import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NumberOfProducts } from '../models/NumberOfProducts';
import { NumberOfOrders } from '../models/NumberOfOrders';


@Injectable({
    providedIn: 'root'
})

export class StatisticsService {

    constructor(private http: HttpClient) {

    }

    public getNumberOfProducts (): Observable<NumberOfProducts> { // Gets the amount of products available in the store.

        return this.http.get<NumberOfProducts>("/api/api/products/amountofproducts");
    }

    public getNumberOfOrders (): Observable<NumberOfOrders> { // Gets the amount of completed orders in the store.
        
        return this.http.get<NumberOfOrders>("/api/api/orders/amountoforders");
    }
}