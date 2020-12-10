import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Category } from '../models/Category';

@Injectable({
    providedIn: 'root'
})

export class CategoryService {

    private categories = new BehaviorSubject<Category[]>([]);
    public categoriesOBS = this.categories.asObservable();

    constructor(private http: HttpClient) {

    }

    public getAllCategories(): Observable<Category[]> {

        return this.http.get<Category[]>("api/api/categories/allcategories");
    }

    public updateCategories() { // Updates category observable with all the categories in the server.
        const observable = this.getAllCategories();
        observable.subscribe(succesfullLoginServerResponse => {
            let categoriesValues = succesfullLoginServerResponse;
            this.updateCategoriesCache(categoriesValues);
        }, serverErrorResponse => { 
            alert ("It seems like the system no longer recognizes you. Please login once again to identify yourself.");
          });
    }

    updateCategoriesCache (categories) {
        this.categories.next(categories);
    }
}