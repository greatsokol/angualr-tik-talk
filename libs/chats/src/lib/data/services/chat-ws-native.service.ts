import {ChatsWsServiceInterface, ChatWsConnectionParams} from "./chats-ws-service.interface";

export class ChatWsNativeService implements ChatsWsServiceInterface {

  #socket: WebSocket | null = null;

  connect(params: ChatWsConnectionParams): void {
    if (this.#socket) return;
    this.#socket = new WebSocket(params.url, [params.token]);
    this.#socket.onmessage = (event) => {
      params.handleMessage(JSON.parse(event.data));
    }

    this.#socket.onclose = () => {
      console.log('SOCKET closed');
    }

    this.#socket.onerror = (error) => {
      console.log(error);
      debugger;
    }
  }

  disconnect(): void {
    console.log('SOCKET disconnect');
    this.#socket?.close();
  }

  sendMessage(text: string, chatId: number): void {
    this.#socket?.send(JSON.stringify({
      text,
      chat_id: chatId
    }));
  }

}
