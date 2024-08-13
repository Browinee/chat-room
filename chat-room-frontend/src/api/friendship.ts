import { AddFriend } from "../pages/Friendship/AddFriendModal";
import http from "./request";

export async function friendshipList(name?: string) {
  return http.get(`/friendship/list?name=${name || ""}`);
}

export async function friendAdd(data: AddFriend) {
  return http.post("/friendship", data);
}

export async function friendRequestList() {
  return http.get("/friendship/request-list");
}

export async function agreeFriendRequest(id: number) {
  return http.get(`/friendship/agree/${id}`);
}

export async function rejectFriendRequest(id: number) {
  return http.get(`/friendship/reject/${id}`);
}
