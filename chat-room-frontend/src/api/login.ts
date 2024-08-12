import http from "./request";

export async function login(username: string, password: string) {
  return await http.post("/user/login", {
    username,
    password,
  });
}
