import {Component, EventEmitter, inject, Output, Renderer2,} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {AvatarCircleComponent, SvgIconComponent} from "@tt/common-ui";
import {ProfileService, selectMe} from "@tt/profile";
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [AvatarCircleComponent, FormsModule, SvgIconComponent, NgIf],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss',
})
export class MessageInputComponent {
  r2 = inject(Renderer2);
  store = inject(Store)
  me = this.store.selectSignal(selectMe);

  @Output() postCreated = new EventEmitter<string>();

  postText: string = '';

  onTextAreaInput($event: Event) {
    const textArea = $event.target as HTMLTextAreaElement;
    this.r2.setStyle(textArea, 'height', 'auto');
    this.r2.setStyle(textArea, 'height', textArea.scrollHeight + 'px');
  }

  onCreatePost(): void {
    if (!this.postText) return;
    this.postCreated.emit(this.postText);
    this.postText = '';
  }
}
