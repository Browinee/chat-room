import { Button, Form, Input, InputNumber, Modal, message } from "antd";
import { addMember } from "../../api/groupChat";
import { useForm } from "antd/es/form/Form";

interface AddMemberModalProps {
  chatroomId: number;
  isOpen: boolean;
  handleClose: Function;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

export interface AddMember {
  username: string;
}

export function AddMemberModal(props: AddMemberModalProps) {
  const [form] = useForm<AddMember>();

  const handleOk = async function () {
    await form.validateFields();

    const values = form.getFieldsValue();

    try {
      const res = await addMember(props.chatroomId, values.username);

      if (res.status === 201 || res.status === 200) {
        message.success("add member success");
        form.resetFields();
        props.handleClose();
      }
    } catch (e: any) {
      message.error(e.response?.data?.message || "Please try again laters");
    }
  };

  return (
    <Modal
      title="Add member"
      open={props.isOpen}
      onOk={handleOk}
      onCancel={() => props.handleClose()}
      okText={"add"}
      cancelText={"cancel"}
    >
      <Form form={form} colon={false} {...layout}>
        <Form.Item
          label="username"
          name="username"
          rules={[{ required: true, message: "Please enter username!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
