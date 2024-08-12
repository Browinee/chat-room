import http from "./request";

export async function friendshipList(name?: string) {
  return http.get(`/friendship/list?name=${name || ""}`);
}
