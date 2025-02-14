import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Chat, LastMessage, Message} from '../interfaces/chats.interface';
import {map} from 'rxjs';
import {ProfileService} from "@tt/profile";
import {baseUrl} from "@tt/globals";

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  #http = inject(HttpClient);
  #me = inject(ProfileService).me;
  activeChatMessages = signal<Message[]>([]);

  #chatsUrl = `${baseUrl}chat/`;
  #messageUrl = `${baseUrl}message/`;

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
