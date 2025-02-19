import {ChatWsMessage} from "../interfaces/chat-ws-message.interface";
import {Observable} from "rxjs";

export interface ChatWsConnectionParams {
  url: string,
  token: string,
  handleMessage: (message: ChatWsMessage) => void
}

export interface ChatsWsServiceInterface {
  connect: (params: ChatWsConnectionParams) => void | Observable<ChatWsMessage>,
  sendMessage: (text: string, chatId: number) => void,
  disconnect: () => void
}
