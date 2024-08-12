import { Button, Form, Input, message } from "antd";
import "./index.css";
import { useForm } from "antd/es/form/Form";
import { register, registerCaptcha } from "../../api/register";
import { useNavigate } from "react-router-dom";

export interface RegisterUser {
  username: string;
  nickName: string;
  password: string;
  confirmPassword: string;
  email: string;
  captcha: string;
}

const onFinish = async (values: RegisterUser) => {
  console.log(values);
};

const layout1 = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const layout2 = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
};

export function Register() {
  const [form] = useForm();
  const navigate = useNavigate();
  const onFinish = async (values: RegisterUser) => {
    if (values.password !== values.confirmPassword) {
      return message.error("Password does not match");
    }
    const res = await register(values);

    if (res.status === 201 || res.status === 200) {
      message.success("register success");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      message.error(res.data.data || "Please try again later");
    }
  };

  const sendCaptcha = async () => {
    const address = form.getFieldValue("email");
    if (!address) {
      return message.error("Please enter email");
    }
    try {
      const res = await registerCaptcha(address);
      if (res.status === 201 || res.status === 200) {
        message.success("Captcha sent successfully");
      }
    } catch (e: any) {
      message.error(e.response?.data?.message || "Please try again later");
    }
  };

  return (
    <div id="register-container">
      <h1>Chat Room Register</h1>
      <Form
        form={form}
        {...layout1}
        onFinish={onFinish}
        colon={false}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please enter a username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Nickname"
          name="nickName"
          rules={[{ required: true, message: "Please enter a nickname!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter a password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          rules={[{ required: true, message: "Please confirm your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter an email!" },
            { type: "email", message: "Please enter a valid email address!" },
          ]}
        >
          <Input />
        </Form.Item>

        <div className="captcha-wrapper">
          <Form.Item
            label="Captcha"
            name="captcha"
            rules={[{ required: true, message: "Please enter the captcha!" }]}
          >
            <Input />
          </Form.Item>
          <Button type="primary" onClick={sendCaptcha}>
            Send Captcha
          </Button>
        </div>

        <Form.Item {...layout2}>
          <div className="links">
            Already have an account? Go to <a href="/login">Login</a>
          </div>
        </Form.Item>

        <Form.Item {...layout1} label=" ">
          <Button className="btn" type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
