import { AddFriend } from "../pages/Friendship/AddFriendModal";
import http from "./request";

export async function friendshipList(name?: string) {
  return http.get(`/friendship/list?name=${name || ""}`);
}

export async function friendAdd(data: AddFriend) {
  return http.post("/friendship", data);
}
