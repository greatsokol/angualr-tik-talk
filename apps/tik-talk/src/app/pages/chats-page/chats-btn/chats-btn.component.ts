import {Component, input} from '@angular/core';
import {LastMessage} from '../../../data/interfaces/chats.interface';
import {AvatarCircleComponent} from "@tt/common-ui";

@Component({
  selector: 'button[chats]',
  standalone: true,
  imports: [AvatarCircleComponent],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss',
})
export class ChatsBtnComponent {
  chat = input<LastMessage>();
}
