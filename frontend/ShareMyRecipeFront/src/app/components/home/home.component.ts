import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Emitters } from '../../emitters/emitter';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{

  message = ""
  logged = false

  constructor(private http:HttpClient){}

  ngOnInit(): void {
    this.http.get('http://localhost:3000/api/user', { withCredentials: true })
      .subscribe(
        (res: any) => {
          if (res.firstName) {
            this.message = `Hi ${res.firstName}`;
            Emitters.authEmitter.emit(true)
            this.logged = true
          } else {
            this.message = "User data not available";
          }
        },
        (err) => {
          console.error("Error:", err);
          this.message = "You are not logged in";
          this.logged = false
          Emitters.authEmitter.emit(false)
        }
      );
  }
  

}
