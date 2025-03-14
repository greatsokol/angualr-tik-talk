import {AfterViewInit, Component, effect, ElementRef, HostListener, inject, input, Renderer2,} from '@angular/core';
import {PostInputComponent} from '../../ui';
import {PostComponent} from '../post/post.component';
import {PostService} from '../../data';
import {firstValueFrom} from 'rxjs';
import {DebounceMethod} from "@tt/shared";
import {Profile} from "@tt/interfaces/profile";
import {Store} from "@ngrx/store";
import {selectMe} from "@tt/profile";


@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [PostInputComponent, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent implements AfterViewInit {
  postService = inject(PostService);
  r2 = inject(Renderer2);
  hostElement = inject(ElementRef);
  me = inject(Store).selectSignal(selectMe);
  profile = input<Profile>();
  feed = this.postService.posts;

  @DebounceMethod
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.resizeFeed();
  }

  constructor() {
    effect(() => {
      firstValueFrom(this.postService.fetchPosts(this.profile()!.id));
    });
  }

  ngAfterViewInit() {
    this.resizeFeed();
  }

  resizeFeed() {
    const {top} = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 24 - 16;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  onPostCreated(postText: string) {
    firstValueFrom(
      this.postService.createPost({
        title: '',
        content: postText,
        authorId: this.profile()!.id,
      })
    );
  }
}
