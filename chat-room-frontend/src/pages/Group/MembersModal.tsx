import { message, Modal, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { groupMembers } from "../../api/groupChat";

export interface MembersModalProps {
  isOpen: boolean;
  chatroomId: number;
  handleClose: () => void;
}

interface User {
  id: number;
  username: string;
  nickName: string;
  headPic: string;
  email: string;
}

export function MembersModal(props: MembersModalProps) {
  const [members, setMembers] = useState<Array<User>>();

  const queryMembers = async () => {
    try {
      const res = await groupMembers(props.chatroomId);

      if (res.status === 201 || res.status === 200) {
        setMembers(
          res.data.map((item: User) => {
            return {
              ...item,
              key: item.id,
            };
          })
        );
      }
    } catch (e: any) {
      message.error(e.response?.data?.message || "Please try again later");
    }
  };

  useEffect(() => {
    if (props.chatroomId !== -1) {
      queryMembers();
    }
  }, [props.chatroomId]);

  const columns: ColumnsType<User> = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Username",
      dataIndex: "username",
    },
    {
      title: "Nickname",
      dataIndex: "nickName",
    },
    {
      title: "Avatar",
      dataIndex: "headPic",
      render: (_, record) => {
        return <img src={record.headPic} width={50} height={50} />;
      },
    },
    {
      title: "Email",
      dataIndex: "email",
    },
  ];

  return (
    <Modal
      title="Group chat members"
      open={props.isOpen}
      onCancel={() => props.handleClose()}
      onOk={() => props.handleClose()}
      width={1000}
    >
      <Table columns={columns} dataSource={members} pagination={false} />
    </Modal>
  );
}
