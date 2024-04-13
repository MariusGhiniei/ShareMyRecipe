import { Component, Input } from '@angular/core';
import { Post } from '../post-model/post'
@Component({
  selector: 'app-post-model',
  standalone: true,
  imports: [],
  templateUrl: './post-model.component.html',
  styleUrl: './post-model.component.scss'
})
export class PostModelComponent {
  @Input() post: Post
}
