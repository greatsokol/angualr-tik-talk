import {Component, inject, input, OnInit, signal} from '@angular/core';
import {Post, PostComment} from "../../../data/interfaces/post.interface";
import {AvatarCircleComponent} from "../../../common-ui/avatar-circle/avatar-circle.component";
import {DatePipe} from "@angular/common";
import {SvgIconComponent} from "../../../common-ui/svg-icon/svg-icon.component";
import {PostInputComponent} from "../post-input/post-input.component";
import {CommentComponent} from "./comment/comment.component";
import {PostService} from "../../../data/services/post.service";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    DatePipe,
    SvgIconComponent,
    PostInputComponent,
    CommentComponent
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {
  post = input<Post>();
  comments = signal<PostComment[]>([]);

  postService = inject(PostService);

  onCommentCreated(commentText: string): void {
    firstValueFrom(this.postService.createComment({
      text: commentText,
      authorId: this.post()!.author.id,
      postId: this.post()!.id
    })).then(_ => {
      firstValueFrom(this.postService.getCommentsByPostId(this.post()!.id))
        .then(comments => this.comments.set(comments));
    });
  }

  ngOnInit(): void {
    this.comments.set(this.post()!.comments);
  }


}
