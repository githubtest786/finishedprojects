import { Component, OnInit } from '@angular/core';
import { UserSignUpDetails } from '../../models/UserSignUpDetails';
import { UserService } from '../../services/UserService';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public userSignUpDetails: UserSignUpDetails;
  private usersService: UserService;

  public signUpPage = 1;

  public IDs = [];

  public IDIsFine = true;

  constructor(usersService: UserService, private router: Router) {
    this.userSignUpDetails = new UserSignUpDetails();
    this.usersService = usersService;
   }

  public signUp(): void { // Signs up assuming everything in the form is fine according to the regex.
    const observable = this.usersService.signUp(this.userSignUpDetails);

    observable.subscribe(succesfulServerRequestData => {

      alert(succesfulServerRequestData.signup_approval);
      this.router.navigate(["/home"]);

    }, serverErrorResponse => { 
      alert ("Error! Status: " + serverErrorResponse.status + ", Message: " + serverErrorResponse.message);
    });
  }

  public nextPage(): void { // Moves to the next page.
    for (let i = 0; i < this.IDs.length; i++) {
      if (this.IDs[i].id_number == this.userSignUpDetails.id) {
        this.IDIsFine = false;
        i = this.IDs.length;
      }
      if (i == this.IDs.length -1) {
        this.IDIsFine = true;
      }
    }

    if (this.IDIsFine) {
      this.signUpPage++;
    }
  }

  public previousPage(): void { // Moves to the previous page.
    this.signUpPage--;
  }


  ngOnInit(): void {
    const observable = this.usersService.getIDs();


    observable.subscribe(succesfulServerRequestData => {
      this.IDs = succesfulServerRequestData;
    }, serverErrorResponse => { 
      alert ("Error! Status: " + serverErrorResponse.status + ", Message: " + serverErrorResponse.message);
    });

  }

}
