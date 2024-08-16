import http from "./request";

export async function chatroomList(name: string = "") {
  return http.get(`/chatroom/list?name=${name}`);
}

export async function chatHistoryList(id: number) {
  return http.get(`/chat-history/list?chatroomId=${id}`);
}

export async function findChatroom(userId1: number, userId2: number) {
  return http.get(`/chatroom/findChatroom`, {
    params: {
      userId1,
      userId2,
    },
  });
}

export async function createOneToOne(friendId: number) {
  return http.post(`/chatroom/create-one-to-one`, {
    friendId,
  });
}
