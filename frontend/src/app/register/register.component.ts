import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl:'./register.component.scss'
})
export class RegisterComponent {

  firstName : string = ""
  lastName : string = ""
  country : string = ""
  email : string = ""
  password : string = ""

  constructor(private http: HttpClient) {

  }
  
  ngOnInit(): void {}

  register(): void {
    const bodyData = {
      firstName: this.firstName,
      lastName: this.lastName,
      country: this.country,
      email: this.email,
      password: this.password
    };
  
    this.http.post("http://localhost:3000/user/create", bodyData).subscribe({
      next: (resultData: any) => {
        console.log(resultData);
        alert("User Registered Successfully");
      },
      error: (error: any) => {
        console.error("Error during user registration:", error);
        alert("User registration failed. Please try again.");
      }
    });
  }
  

  save(){
    this.register()
  }

}
