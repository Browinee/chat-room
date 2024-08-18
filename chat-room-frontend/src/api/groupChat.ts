import http from "./request";

export async function groupMembers(chatroomId: number) {
  return http.get(`/chatroom/members`, {
    params: {
      chatroomId,
    },
  });
}
