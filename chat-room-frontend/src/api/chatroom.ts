import http from "./request";

export async function chatroomList(name?: string) {
  return http.get(`/chatroom/list?name=${name}`);
}
