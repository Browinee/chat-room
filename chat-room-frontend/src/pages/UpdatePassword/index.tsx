import { Button, Form, Input, message } from "antd";
import { useForm } from "antd/es/form/Form";
import "./index.css";
import { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  updatePassword,
  updatePasswordCaptcha,
} from "../../api/updatePassword ";

export interface UpdatePassword {
  email: string;
  captcha: string;
  password: string;
  confirmPassword: string;
}

const layout1 = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

export function UpdatePassword() {
  const [form] = useForm();
  const navigate = useNavigate();

  const onFinish = async (values: UpdatePassword) => {
    if (values.password !== values.confirmPassword) {
      return message.error("Password not match");
    }
    try {
      const res = await updatePassword(values);

      if (res.status === 201 || res.status === 200) {
        message.success("Update password successfully.");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (e: any) {
      message.error(e.response?.data?.message || "Please try again later");
    }
  };

  const sendCaptcha = async function () {
    const address = form.getFieldValue("email");
    if (!address) {
      return message.error("Please enter email");
    }

    try {
      const res = await updatePasswordCaptcha(address);
      if (res.status === 201 || res.status === 200) {
        message.success("Send success");
      }
    } catch (e: any) {
      message.error(e.response?.data?.message || "Please try again later");
    }
  };

  return (
    <div id="updatePassword-container">
      <h1>Chat Room</h1>
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
          rules={[{ required: true, message: "Please enter your username!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email!" },
            { type: "email", message: "Please enter a valid email address!" },
          ]}
        >
          <Input />
        </Form.Item>

        <div className="captcha-wrapper">
          <Form.Item
            label="Verification Code"
            name="captcha"
            rules={[
              {
                required: true,
                message: "Please enter the verification code!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Button type="primary" onClick={sendCaptcha}>
            Send Code
          </Button>
        </div>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password!" }]}
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

        <Form.Item {...layout1} label=" ">
          <Button className="btn" type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
