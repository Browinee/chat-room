import { Button, Checkbox, Form, Input, message } from "antd";
import "./index.css";
import { login } from "../../api/login";
import { useNavigate } from "react-router-dom";

interface LoginUser {
  username: string;
  password: string;
}

const layout1 = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const layout2 = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
};

export function Login() {
  const navigate = useNavigate();
  const onFinish = async (values: LoginUser) => {
    try {
      const res = await login(values.username, values.password);
      if (res.status === 201 || res.status === 200) {
        message.success("Login success");

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userInfo", JSON.stringify(res.data.user));
        navigate("/");
      }
    } catch (e: any) {
      message.error(e.response?.data?.message || "please try later");
    }
  };
  return (
    <div id="login-container">
      <h1>Chat Room</h1>
      <Form {...layout1} onFinish={onFinish} colon={false} autoComplete="off">
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please enter your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...layout2}>
          <div className="links">
            <a href="/register">Create Account</a>
            <a href="/update_password">Forgot Password</a>
          </div>
        </Form.Item>

        <Form.Item {...layout2}>
          <Button className="btn" type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
