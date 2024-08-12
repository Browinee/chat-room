import { RegisterUser } from "../pages/Register";
import http from "./request";

export async function registerCaptcha(email: string) {
  return await http.get("/user/register-captcha", {
    params: {
      address: email,
    },
  });
}

export async function register(registerUser: RegisterUser) {
  return await http.post("/user/register", registerUser);
}
