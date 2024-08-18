import http from "./request";

export async function groupMembers(chatroomId: number) {
  return http.get(`/chatroom/members`, {
    params: {
      chatroomId,
    },
  });
}
export async function addMember(chatroomId: number, joinUsername: string) {
  return http.get(`/chatroom/join/${chatroomId}`, {
    params: {
      joinUsername,
    },
  });
}
export async function createGroup(name: string) {
  return http.post(`/chatroom/create-group`, {
    name,
  });
}
