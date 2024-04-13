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
          if (res.firstName) {
            Emitters.authEmitter.emit(true)
          } else {
            this.showForm = false
          }
        },
        (err) => {
          console.error("Error:", err);
          Emitters.authEmitter.emit(false)
        }
      );
  }

  onSubmit(){
    this.http.post<any>('http://localhost:3000/api/post', this.postData)
    .subscribe(res => {
      console.log('Post created successfully', res);
      Swal.fire({
        title:"Well done!",
        text:"You post has been made successfully",
        icon: "success"
      })
      this.router.navigate(['/'])
    }, error => {
      console.error('Error creating post', error);
    })
  }
}
