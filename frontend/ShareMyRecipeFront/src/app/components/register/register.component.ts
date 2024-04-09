import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: "",
      lastName: "",
      country: "",
      email: "",
      password: ""
    })
  }

  ValidateEmail = (email: any) => {
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}-]+@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/

    if(email.match(validRegex)) return true
    else return false

  }

  submit() : void {
    let user = this.form.getRawValue()
    
    if(user.firstName == "" || user.lastName == "" || user.country == "" || user.email == "" || user.password == ""){
      Swal.fire("Error", "Please enter all the fields", "error")
    } else if (!this.ValidateEmail(user.email)){
      Swal.fire("Error", "Please enter a valid email address", "error")
    } else {
      this.http.post(
        'http://localhost:3000/api/register', user, {
          withCredentials: true,
        })
        .subscribe(() => this.router.navigate(['/']), (err) => {
          Swal.fire("Error", err.error.message,'error')
        })
    }
  }

}
