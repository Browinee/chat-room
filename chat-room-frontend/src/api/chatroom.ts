import http from "./request";

export async function chatroomList(name: string = "") {
  return http.get(`/chatroom/list?name=${name}`);
}

export async function chatHistoryList(id: number) {
  return http.get(`/chat-history/list?chatroomId=${id}`);
}
