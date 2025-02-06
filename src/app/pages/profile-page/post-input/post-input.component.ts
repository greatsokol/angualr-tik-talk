import {Component, EventEmitter, HostBinding, inject, input, Output, Renderer2} from '@angular/core';
import {AvatarCircleComponent} from "../../../common-ui/avatar-circle/avatar-circle.component";
import {ProfileService} from "../../../data/services/profile.service";
import {SvgIconComponent} from "../../../common-ui/svg-icon/svg-icon.component";
import {PostService} from "../../../data/services/post.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-post-input',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    SvgIconComponent,
    FormsModule
  ],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss'
})
export class PostInputComponent {
  r2 = inject(Renderer2);
  postService: PostService = inject(PostService);

  profile = inject(ProfileService).me;
  isCommentInput = input<boolean>(false);
  postId = input<number>(0);

  @Output() postCreated = new EventEmitter<string>();
  @Output() commentCreated = new EventEmitter<string>();

  @HostBinding('class.comment')
  get isComment() {
    return this.isCommentInput();
  }

  postText: string = '';

  onTextAreaInput($event: Event) {
    const textArea = $event.target as HTMLTextAreaElement;
    this.r2.setStyle(textArea, 'height', 'auto');
    this.r2.setStyle(textArea, 'height', textArea.scrollHeight + 'px');
  }

  onCreatePost(): void {
    if (!this.postText) return;

    if (this.isCommentInput()) {
      this.commentCreated.emit(this.postText);
    } else {
      this.postCreated.emit(this.postText);
    }

    this.postText = '';
  }

}
