import { Button, Form, Input, InputNumber, Modal, message } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { friendAdd } from "../../api/friendship";

interface AddFriendModalProps {
  isOpen: boolean;
  handleClose: Function;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

export interface AddFriend {
  username: string;
  reason: string;
}

export function AddFriendModal(props: AddFriendModalProps) {
  const [form] = useForm<AddFriend>();

  const handleOk = async function () {
    await form.validateFields();

    const values = form.getFieldsValue();

    try {
      const res = await friendAdd(values);

      if (res.status === 201 || res.status === 200) {
        message.success("friend request sent");
        form.resetFields();
        props.handleClose();
      }
    } catch (e: any) {
      message.error(e.response?.data?.message || "Please try again later");
    }
  };

  return (
    <Modal
      title="Add Friend"
      open={props.isOpen}
      onOk={handleOk}
      onCancel={() => props.handleClose()}
      okText="Send Friend Request"
      cancelText="Cancel"
    >
      <Form form={form} colon={false} {...layout}>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please enter a username!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Reason"
          name="reason"
          rules={[
            { required: true, message: "Please enter a reason for adding!" },
          ]}
        >
          <TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
}
