import { Button, Form, Input, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { useCallback, useEffect } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { getUserInfo, updateInfo, updateUserInfoCaptcha } from "../../api/user";
import { HeadPicUpload } from "./HeadPicUpload";
export interface UserInfo {
  headPic: string;
  nickName: string;
  email: string;
  captcha: string;
}

const layout1 = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

export function UpdateInfo() {
  const [form] = useForm();
  const navigate = useNavigate();

  const onFinish = async (values: UserInfo) => {
    try {
      const res = await updateInfo(values);
      if (res.status === 201 || res.status === 200) {
        message.success("update user info success");
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
          const info = JSON.parse(userInfo);
          info.headPic = values.headPic;
          info.nickName = values.nickName;

          localStorage.setItem("userInfo", JSON.stringify(info));
        }
      }
    } catch (e: any) {
      message.error(e.response?.data?.message || "Please try again later");
    }
  };
  const sendCaptcha = async function () {
    try {
      const res = await updateUserInfoCaptcha();
      if (res.status === 201 || res.status === 200) {
        message.success("sendCaptcha success");
      }
    } catch (e: any) {
      message.error(e.response?.data?.message || "Please try again later");
    }
  };
  useEffect(() => {
    async function query() {
      const res = await getUserInfo();

      if (res.status === 201 || res.status === 200) {
        form.setFieldValue("headPic", res.data.headPic);
        form.setFieldValue("nickName", res.data.nickName);
        form.setFieldValue("email", res.data.email);
        form.setFieldValue("username", res.data.username);
      }
    }
    query();
  }, []);

  return (
    <div id="updateInfo-container">
      <Form
        form={form}
        {...layout1}
        onFinish={onFinish}
        colon={false}
        autoComplete="off"
      >
        <Form.Item
          label="Avatar"
          name="headPic"
          rules={[{ required: true, message: "Please enter an avatar!" }]}
        >
          <HeadPicUpload></HeadPicUpload>
        </Form.Item>

        <Form.Item
          label="Nickname"
          name="nickName"
          rules={[{ required: true, message: "Please enter a nickname!" }]}
        >
          <Input />
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

        <div className="">
          <Form.Item
            label="Captcha"
            name="captcha"
            rules={[{ required: true, message: "Please enter the captcha!" }]}
          >
            <Input />
          </Form.Item>
        </div>
        <div>
          <Form.Item label="" name="">
            <Button type="primary" onClick={sendCaptcha}>
              Send Captcha
            </Button>
          </Form.Item>
        </div>
        <Form.Item {...layout1} label=" ">
          <Button className="btn" type="primary" htmlType="submit">
            Update Info
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
