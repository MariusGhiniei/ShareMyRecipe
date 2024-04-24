import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Emitters } from '../../emitters/emitter';
@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent implements OnInit {
  showPost = true
  user : any
  authentificated = false
  details = { firstName: '', lastName: '', country: '' } as { firstName: string, lastName: string, country: string };


  posts: any
  

  constructor(
    private http: HttpClient,
    private router : Router
  ) {}

  ngOnInit(): void {
    this.http.get('http://localhost:3000/api/user', { withCredentials: true })
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res.firstName) {
            this.user = res.firstName
            Emitters.authEmitter.emit(true)
            this.details = { 
              firstName : res.firstName,
              lastName : res.lastName,
              country : res.country
            } 
            // this.user.firstName = res.firstName
            // this.user.lastName = res.lastName
            // this.user.country = res.country
            this.getPostInfo()
          } else {
            this.showPost = false
          }
        },
        (err) => {
          console.error("Error:", err);
          Emitters.authEmitter.emit(false)
        }
      );
  }
  getPostInfo(): void {
      this.http.get('http://localhost:3000/api/getPosts', {withCredentials: true})
      .subscribe(
        (posts) => {
          console.log(posts);
          this.posts = posts
          
        },
        (err) => {
          console.error("error", err);
        }
      ) 
  }

}
