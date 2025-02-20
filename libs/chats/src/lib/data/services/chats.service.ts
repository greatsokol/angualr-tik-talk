import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Chat, LastMessage, Message} from '../interfaces/chats.interface';
import {firstValueFrom, map, Observable, of, switchMap} from 'rxjs';
import {selectMe} from "@tt/profile";
import {baseUrl} from "@tt/globals";
import {Store} from "@ngrx/store";
import {ChatsWsServiceInterface} from "./chats-ws-service.interface";
import {AuthService} from "@tt/auth";
import {ChatWsMessage} from "../interfaces/chat-ws-message.interface";
import {isInvalidTokenErrorMessage, isNewMessage, isUnreadMessage} from "../interfaces/type-guards";
import {ChatWsRxjsService} from "./chat-ws-rxjs.service";

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  #http = inject(HttpClient);
  #authService = inject(AuthService);
  #store = inject(Store);
  #me = this.#store.selectSignal(selectMe);
  //#me = inject(ProfileService).me;

  wsAdapter: ChatsWsServiceInterface = new ChatWsRxjsService();

  activeChatMessages = signal<Message[]>([]);

  #chatsUrl = `${baseUrl}chat/`;
  #messageUrl = `${baseUrl}message/`;

  connectWs(): Observable<ChatWsMessage> {
    return (this.wsAdapter.connect({
      url: `${this.#chatsUrl}ws`,
      token: this.#authService.token ?? '',
      handleMessage: this.handleWsMessage
    }) as Observable<ChatWsMessage>)
      .pipe(
        switchMap(message => {
          return isInvalidTokenErrorMessage(message)
            ? firstValueFrom(this.#authService.refreshAuthToken().pipe(switchMap(_ => this.connectWs())))
            : of(message);
        }))
  }

  handleWsMessage = (message: ChatWsMessage) => {
    if (isUnreadMessage(message)) {

    } else if (isNewMessage(message)) {
      this.activeChatMessages.set([
        ...this.activeChatMessages(),
        {
          id: message.data.id,
          userFromId: message.data.author,
          personalChatId: message.data.chat_id,
          text: message.data.message,
          createdAt: message.data.created_at,
          isRead: false,
          isMine: false

        }
      ])
    }
  }

  createChat(userId: number) {
    return this.#http.post<Chat>(`${this.#chatsUrl}${userId}`, {});
  }

  getMyChats() {
    return this.#http.get<LastMessage[]>(`${this.#chatsUrl}get_my_chats/`);
  }

  getChatById(chatId: number) {
    return this.#http.get<Chat>(`${this.#chatsUrl}${chatId}`).pipe(
      map((chat: Chat) => {
        const patchedMessages = chat.messages.map((message) => {
          return {
            ...message,
            user:
              chat.userFirst.id === message.userFromId
                ? chat.userFirst
                : chat.userSecond,
            isMine: message.userFromId === this.#me()?.id,
          };
        });

        this.activeChatMessages.set(patchedMessages);

        return {
          ...chat,
          companion:
            chat.userFirst.id === this.#me()?.id
              ? chat.userSecond
              : chat.userFirst,
          messages: patchedMessages,
        };
      })
    );
  }

  sendMessage(chatId: number, message: string) {
    return this.#http.post<Message>(
      `${this.#messageUrl}send/${chatId}`,
      {},
      {
        params: {
          message,
        },
      }
    );
  }
}
