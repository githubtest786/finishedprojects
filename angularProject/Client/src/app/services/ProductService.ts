import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Product } from '../models/Product';
import { SuccessfulProductResponse } from '../models/SuccessfulProductResponse';
import { UpdateProduct } from '../models/UpdateProduct';
import { NewProduct } from '../models/NewProduct';

@Injectable({
    providedIn: 'root'
})

export class ProductService {

    private products = new BehaviorSubject<Product[]>([]);
    public productsOBS = this.products.asObservable();

    constructor(private http: HttpClient) {

    }

    public getAllProducts(): Observable<Product[]> {

        return this.http.get<Product[]>("api/api/products/allproducts");
    }

    public updateProducts() { // Updates the product array cache.
        const observable = this.getAllProducts();
        observable.subscribe(succesfullLoginServerResponse => {
            let products = succesfullLoginServerResponse;
            this.updateProductsArray(products);
        }, serverErrorResponse => { 
            alert ("It seems like the system no longer recognizes you. Please login once again to identify yourself.");
          });
    }

    public addNewProduct(newProduct : NewProduct): Observable<SuccessfulProductResponse>{ // Adds new product to the server.
        return this.http.post<SuccessfulProductResponse>("api/api/products/addnewproduct", newProduct);
    }

    public updateSpecificProduct(UpdateProduct : UpdateProduct): Observable<SuccessfulProductResponse>{ // Updates a specific product with changes.
        return this.http.patch<SuccessfulProductResponse>("api/api/products/updateproduct", UpdateProduct);
    }

    public updateProductsArray(products) {
        this.products.next(products);
    }
}