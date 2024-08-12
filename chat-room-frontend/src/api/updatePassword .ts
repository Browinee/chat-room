import { UpdatePassword } from "../pages/UpdatePassword";
import http from "./request";

export async function updatePasswordCaptcha(email: string) {
  return await http.get("/user/update_password/captcha", {
    params: {
      address: email,
    },
  });
}

export async function updatePassword(data: UpdatePassword) {
  return await http.post("/user/update_password", data);
}
