import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Emitters } from '../../emitters/emitter';
import { Post} from '../post-model/post'
import { PostService } from '../../services/post.service';
import { PostModelComponent } from '../post-model/post-model.component';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule, PostModelComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent implements OnInit {
  showPost = true
  user : any

  posts: Post[] = []

  constructor(
    private http: HttpClient,
    private router : Router,
    private postService : PostService
  ) {}

  ngOnInit(): void {
    this.http.get('http://localhost:3000/api/user', { withCredentials: true })
      .subscribe(
        (res: any) => {
          if (res.firstName) {
            Emitters.authEmitter.emit(true)
            this.user = res
          } else {
            this.showPost = false
          }
        },
        (err) => {
          console.error("Error:", err);
          Emitters.authEmitter.emit(false)
        }
      );

      this.http.get('http//localhost:300/api/post',{withCredentials: true})
      .subscribe(
        (res:any) => {
          console.log(res);
        },
        (err) => {
          console.error("error", err);
        }
      )
  }

}
