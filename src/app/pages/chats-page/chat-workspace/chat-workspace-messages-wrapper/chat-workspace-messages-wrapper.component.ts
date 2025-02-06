import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {ChatWorkspaceMessageComponent} from "./chat-workspace-message/chat-workspace-message.component";
import {MessageInputComponent} from "../../../../common-ui/message-input/message-input.component";
import {ChatsService} from "../../../../data/services/chats.service";
import {Chat} from "../../../../data/interfaces/chats.interface";
import {firstValueFrom, timer} from "rxjs";
import {DebounceMethod} from "../../../../helpers/decorators/debounce.decorator";

@Component({
  selector: 'app-chat-workspace-messages-wrapper',
  standalone: true,
  imports: [
    ChatWorkspaceMessageComponent,
    MessageInputComponent
  ],
  templateUrl: './chat-workspace-messages-wrapper.component.html',
  styleUrl: './chat-workspace-messages-wrapper.component.scss'
})
export class ChatWorkspaceMessagesWrapperComponent implements OnInit, AfterViewInit {
  chatsService = inject(ChatsService);
  @ViewChild('messagesScroller') messagesScroller!: ElementRef;
  r2 = inject(Renderer2);

  chat = input.required<Chat>()
  messages = this.chatsService.activeChatMessages;

  @DebounceMethod
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.resizeFeed();
  }

  ngOnInit() {
    this.repeatingLoadMessages();
  }

  ngAfterViewInit() {
    this.resizeFeed();
  }

  resizeFeed() {
    const {top} = this.messagesScroller.nativeElement.getBoundingClientRect();
    const scrollerHeight = window.innerHeight - top - (1 + 16 + 44) - 16;
    this.r2.setStyle(this.messagesScroller.nativeElement, 'height', `${scrollerHeight}px`);
  }

  async onSendMessage(message: string) {
    await firstValueFrom(this.chatsService.sendMessage(this.chat().id, message));
    await firstValueFrom(this.chatsService.getChatById(this.chat().id));
  }

  repeatingLoadMessages() {
    firstValueFrom(this.chatsService.getChatById(this.chat().id))
      .then(_ => {
        firstValueFrom(timer(30000)).then(_ => {
          this.repeatingLoadMessages()
        });
      })
  }
}
