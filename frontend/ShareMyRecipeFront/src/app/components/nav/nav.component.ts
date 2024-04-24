import { Component } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Emitters } from '../../emitters/emitter';
import { CommonModule } from '@angular/common';
import { PostComponent } from '../post/post.component';
import { FeedComponent } from '../feed/feed.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    NavComponent,
    LoginComponent,
    RegisterComponent,
    PostComponent,
    FeedComponent,
    RouterOutlet,
    RouterLink,
    CommonModule
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {

  authenticated = false

  constructor(private http:HttpClient){}

  ngOnInit():void{
    Emitters.authEmitter.subscribe((auth:boolean) => {
      this.authenticated = auth
    })
  }

  logout(): void{
    this.http.post("http://localhost:3000/api/logout", {}, {withCredentials: true})
    .subscribe(() => this.authenticated = false)
  }
}
