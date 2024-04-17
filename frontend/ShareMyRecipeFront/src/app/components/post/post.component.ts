import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, NgModule, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router'
import { Emitters } from '../../emitters/emitter';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-post',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule, ReactiveFormsModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {
  showForm = true
  authenticated = false
  postData = {
    title: '',
    content: '',
    imageUrl: ''
  }

  constructor(
    private http:HttpClient,
     private router: Router
     ){}

  ngOnInit(): void {
    this.http.get('http://localhost:3000/api/user', { withCredentials: true })
    .subscribe(
      (res: any) => {
        if (res) {
          Emitters.authEmitter.emit(true)
        } 
      },
      (err) => {
        console.error("Error nav/post:", err);
        Emitters.authEmitter.emit(false)
      }
    );
  }

  onSubmit(){
    if(!this.postData.title || !this.postData.content){
      Swal.fire("Error", "Title or content are required", "error")
      return
    }
    this.http.post<any>('http://localhost:3000/api/post', this.postData, {withCredentials : true})
    .subscribe(res => {
      console.log('Post created successfully', res);
      Swal.fire({
        title:"Well done!",
        text:"You post has been made successfully",
        icon: "success"
      })
    }, error => {
      console.error('Error creating post', error);
    })
  }
}
