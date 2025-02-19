import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {ChatWorkspaceMessageComponent} from './chat-workspace-message/chat-workspace-message.component';
import {MessageInputComponent} from '../../../ui';
import {Chat, ChatsService} from '../../../data';
import {DebounceMethod} from "@tt/shared";

@Component({
  selector: 'app-chat-workspace-messages-wrapper',
  standalone: true,
  imports: [ChatWorkspaceMessageComponent, MessageInputComponent],
  templateUrl: './chat-workspace-messages-wrapper.component.html',
  styleUrl: './chat-workspace-messages-wrapper.component.scss',
})
export class ChatWorkspaceMessagesWrapperComponent
  implements OnInit, AfterViewInit {
  chatsService = inject(ChatsService);
  @ViewChild('messagesScroller') messagesScroller!: ElementRef;
  r2 = inject(Renderer2);

  chat = input.required<Chat>();
  messages = this.chatsService.activeChatMessages;

  @DebounceMethod
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.resizeFeed();
  }

  ngOnInit() {
    //this.repeatingLoadMessages();
  }

  ngAfterViewInit() {
    this.resizeFeed();
  }

  resizeFeed() {
    const {top} = this.messagesScroller.nativeElement.getBoundingClientRect();
    const scrollerHeight = window.innerHeight - top - (1 + 16 + 44) - 16 - 50;
    this.r2.setStyle(
      this.messagesScroller.nativeElement,
      'height',
      `${scrollerHeight}px`
    );
  }

  async onSendMessage(message: string) {
    this.chatsService.wsAdapter.sendMessage(message, this.chat().id);
    // await firstValueFrom(
    //   this.chatsService.sendMessage(this.chat().id, message)
    // );
    //await firstValueFrom(this.chatsService.getChatById(this.chat().id));
  }
}
