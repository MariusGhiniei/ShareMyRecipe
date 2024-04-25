import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Emitters } from '../../emitters/emitter';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import * as bcrypt from 'bcryptjs'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  authenticated = false
  user : any
  editing : boolean = false
  password: string = ''
  editingSubmit : boolean = false

  constructor(
    private http : HttpClient
  ){}

  ngOnInit(): void {
    this.http.get<any>('http://localhost:3000/api/user', { withCredentials: true })
    .subscribe(
      (res: any) => {
        if (res) {
          Emitters.authEmitter.emit(true)
        } 
        this.getProfile()
      },
      (err) => {
        console.error("Error nav/post:", err);
        Emitters.authEmitter.emit(false)
      }
    );
  }

  getProfile(): void {
    this.http.get<any>('http://localhost:3000/api/profile',{withCredentials: true})
    .subscribe(
      (res) => {
        this.user = res
        console.log(this.user);
      },
      (err) =>{
        console.error("error", err);
      }
    )
  }

  editMode(){
    this.editing = true
  }

  async validatePassword(){
    const correctPassowrd = this.user.password
    const isCorrectPassowrd = await bcrypt.compare(this.password, correctPassowrd)

    if(isCorrectPassowrd){
      this.editing = true
      this.editingSubmit = true
      console.log("Passoword is correct");
    } else {
      Swal.fire("Error",'Incorrect password, please try again!', "error")
      console.log("Incorect password");
      this.editingSubmit = false
    }

    this.password = ''

  }

  updateUser()  {
    this.http.put<any>('http://localhost:3000/api/updateUser', this.user)
    .subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.error("Error on updating user: ", err);
      }
    )
  }

}
