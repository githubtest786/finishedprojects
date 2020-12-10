import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SuccesfullLoginServerResponse } from '../models/SuccesfullLoginServerResponse';
import { UserLoginDetails } from '../models/UserLoginDetails';
import { UserSignUpDetails } from '../models/UserSignUpDetails';
import { SuccesfulSignUpServerResponse } from '../models/SuccesfulSignUpServerResponse';
import { UserDetails } from '../models/UserDetails';
import { BehaviorSubject } from 'rxjs';
import { SuccessfulCartCreation } from '../models/SuccessfulCartCreation';
import { GetIDs } from '../models/GetIDs';

@Injectable({
    providedIn: 'root'
})

export class UserService {

    private userDetails = new BehaviorSubject<UserDetails>({role : ""});
    public userDetailsOBS = this.userDetails.asObservable();

    private firstName = new BehaviorSubject<string>("");
    public firstNameOBS = this.firstName.asObservable();

    private role = new BehaviorSubject<string>("");
    public roleOBS = this.role.asObservable();
    
    public userDetailsNotEmpty = false;

    constructor(private http: HttpClient) {

    }

    public login(UserLoginDetails: UserLoginDetails): Observable<SuccesfullLoginServerResponse> { // login function

        return this.http.post<SuccesfullLoginServerResponse>("api/api/users/login", UserLoginDetails);
    }

    public signUp(UserSignUpDetails: UserSignUpDetails): Observable<SuccesfulSignUpServerResponse> { // sign up function
        return this.http.post<SuccesfulSignUpServerResponse>("api/api/users/signup", UserSignUpDetails);
    }

    public userDetailsCache(): Observable<UserDetails> { // Gets all user details and stores them in a client sided cache.
        return this.http.get<UserDetails>("api/api/users/getuserdetails");
    }

    public getUserDetails() { // gets user details
        const observable =  this.userDetailsCache();
        observable.subscribe(succesfullLoginServerResponse => {
            let userDetails = succesfullLoginServerResponse;
            this.updateUserDetails(userDetails);
            this.updateUserFirstName(userDetails.first_name);
            this.updateRole(userDetails.role);
            this.userDetailsNotEmpty = true;
        }, serverErrorResponse => { 
            alert ("It seems like the system no longer recognizes you. Please login once again to identify yourself.");
            localStorage.removeItem("token");
            this.updateRole(null);
           });
    }

    public getIDs(): Observable<GetIDs[]> {
        return this.http.get<GetIDs[]>("api/api/users/allids");
    }

    updateUserDetails(user) {
        this.userDetails.next(user);
    }

    updateUserFirstName(name) {
        this.firstName.next(name);
    }

    updateRole(role) {
        this.role.next(role);
    }
}

