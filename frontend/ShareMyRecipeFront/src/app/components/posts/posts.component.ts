import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Emitters } from '../../emitters/emitter';
import { Post } from '../post/post';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit{
  authenticated = false
  posts: any[] = []
  updatedPost : any
  editing : boolean = false
  editingSubmit : boolean = false
  selectedPost : any

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
      this.getPosts()
      },
      (err) => {
        console.error("Error nav/post:", err);
        Emitters.authEmitter.emit(false)
      }
    );
  }

  getPosts(){
    this.http.get<any>('http://localhost:3000/api/getContent', {withCredentials: true})
    .subscribe(
      (res : any) => {
        this.posts = res
        console.log(res);
      },
      (err) => {
        console.error("Error on fetching posts:", err);
      }
    )
  }

  editPost( post : any){
    this.selectedPost = post
    this.editingSubmit = true
  }

  isEditing(post: any){
    return this.selectedPost === post
  }

  updatePost(post:any){
    this.http.put<any>('http://localhost:3000/api/updatePost',post)
    .subscribe(
      (res:any) => {
        console.log("Post updated succesfully", res)
        console.log(post);
      },
      (err) => {
        console.error("Error on updating post: ", err);
      } 
    )
  }
}
