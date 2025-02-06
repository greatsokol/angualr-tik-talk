import {AfterViewInit, Component, effect, ElementRef, HostListener, inject, input, Renderer2} from '@angular/core';
import {PostInputComponent} from "../post-input/post-input.component";
import {PostComponent} from "../post/post.component";
import {PostService} from "../../../data/services/post.service";
import {firstValueFrom} from "rxjs";
import {DebounceMethod} from "../../../helpers/decorators/debounce.decorator";
import {ProfileService} from "../../../data/services/profile.service";
import {Profile} from "../../../data/interfaces/profile.interface";

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [
    PostInputComponent,
    PostComponent
  ],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss'
})
export class PostFeedComponent implements AfterViewInit {
  postService = inject(PostService);
  r2 = inject(Renderer2);
  hostElement = inject(ElementRef);
  me = inject(ProfileService).me;
  profile = input<Profile>();
  feed = this.postService.posts;

  @DebounceMethod
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.resizeFeed();
  }

  constructor() {
    effect(() => {
      console.log(this.profile());
      firstValueFrom(this.postService.fetchPosts(this.profile()!.id));
    });

    // toObservable(this.profile).subscribe(
    //   profile => {
    //     console.log(profile);
    //     firstValueFrom(this.postService.fetchPosts(profile!.id))
    //   }
    // )
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
    firstValueFrom(this.postService.createPost({
      title: '',
      content: postText,
      authorId: this.profile()!.id
    }));
  }
}
