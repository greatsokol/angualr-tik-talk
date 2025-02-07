import {Component, inject, input, OnInit, signal} from '@angular/core';
import {Post, PostComment, PostService} from '../../data';
import {AvatarCircleComponent, SvgIconComponent} from '@tt/common-ui';
import {DatePipe} from '@angular/common';
import {CommentComponent, PostInputComponent} from '../../ui';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    DatePipe,
    SvgIconComponent,
    PostInputComponent,
    CommentComponent,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent implements OnInit {
  post = input<Post>();
  comments = signal<PostComment[]>([]);

  postService = inject(PostService);

  onCommentCreated(commentText: string): void {
    firstValueFrom(
      this.postService.createComment({
        text: commentText,
        authorId: this.post()!.author.id,
        postId: this.post()!.id,
      })
    ).then((_) => {
      firstValueFrom(
        this.postService.getCommentsByPostId(this.post()!.id)
      ).then((comments) => this.comments.set(comments));
    });
  }

  ngOnInit(): void {
    this.comments.set(this.post()!.comments);
  }
}
