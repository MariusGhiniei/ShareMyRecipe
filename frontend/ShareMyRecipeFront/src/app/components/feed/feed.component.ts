import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Emitters } from '../../emitters/emitter';
import { Post} from '../post/post'


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

  posts: Post[] = []

  constructor(
    private http: HttpClient,
    private router : Router,
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

      this.http.get<any[]>('http://localhost:3000/api/getPosts',{withCredentials: true})
      .subscribe(
        (res : any[]) => {
          res.forEach((postItem: any) => {
            console.log(postItem);

            const post = postItem.post
            const user = postItem.user

            if(post && user){
              const { title, content, imageUrl } = post;
              const { firstName, lastName, country } = user;
        
            const data : Post = {
              _id : postItem._id,
              post: {
                title: title,
                content: content,
                imageUrl: imageUrl
              },
              user: {
                firstName: firstName,
                lastName: lastName,
                country: country
              }
            }
            this.posts.push(data)
          } else {console.error("Imcomplete post data: ", postItem);}

            
          });
          console.log(res);
        },
        (err) => {
          console.error("error", err);
        }
      )
  }

}
