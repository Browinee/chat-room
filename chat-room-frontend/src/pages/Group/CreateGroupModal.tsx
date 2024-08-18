import { Button, Form, Input, InputNumber, Modal, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { createGroup } from "../../api/groupChat";

interface CreateGroupModalProps {
  isOpen: boolean;
  handleClose: Function;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

export interface GroupGroup {
  name: string;
}

export function CreateGroupModal(props: CreateGroupModalProps) {
  const [form] = useForm<GroupGroup>();

  const handleOk = async function () {
    await form.validateFields();

    const values = form.getFieldsValue();

    try {
      const res = await createGroup(values.name);

      if (res.status === 201 || res.status === 200) {
        message.success("group chat created");
        form.resetFields();
        props.handleClose();
      }
    } catch (e: any) {
      message.error(e.response?.data?.message || "Please try again later");
    }
  };

  return (
    <Modal
      title="Create group chat"
      open={props.isOpen}
      onOk={handleOk}
      onCancel={() => props.handleClose()}
      okText={"create"}
      cancelText={"cancel"}
    >
      <Form form={form} colon={false} {...layout}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input group name!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
