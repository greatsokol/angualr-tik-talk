import {Component, EventEmitter, HostBinding, inject, input, Output, Renderer2,} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AvatarCircleComponent, SvgIconComponent} from "@tt/common-ui";
import {GlobalStoreService} from "@tt/shared";

@Component({
  selector: 'app-post-input',
  standalone: true,
  imports: [AvatarCircleComponent, SvgIconComponent, FormsModule, AvatarCircleComponent],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss',
})
export class PostInputComponent {
  r2 = inject(Renderer2);
  globalStoreService: GlobalStoreService = inject(GlobalStoreService);

  profile = this.globalStoreService.me;
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
