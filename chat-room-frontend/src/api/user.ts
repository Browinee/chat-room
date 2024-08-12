import { UserInfo } from "../pages/UpdateInfo";
import http from "./request";

export async function getUserInfo() {
  return await http.get("/user");
}

export async function updateInfo(data: UserInfo) {
  return await http.put("/user", data);
}

export async function updateUserInfoCaptcha() {
  return await http.get("/user/update/captcha");
}
