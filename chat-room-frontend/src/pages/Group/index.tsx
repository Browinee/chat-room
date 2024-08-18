import { Button, Form, Input, Table, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import { chatroomList } from "../../api/chatroom";
import "./index.css";
import { MembersModal } from "./MembersModal";
import { useNavigate } from "react-router-dom";
import { AddMemberModal } from "./AddMemberModal";
import { CreateGroupModal } from "./CreateGroupModal";

interface SearchGroup {
  name: string;
}

interface GroupSearchResult {
  id: number;
  name: string;
  createTime: Date;
  type: boolean;
  userCount: number;
  userIds: number[];
}

export function Group() {
  const [groupResult, setGroupResult] = useState<Array<GroupSearchResult>>([]);
  const [isMembersModalOpen, setMembersModalOpen] = useState(false);
  const [isMemberAddModalOpen, setMemberAddModalOpen] = useState(false);
  const [chatroomId, setChatroomId] = useState<number>(-1);
  const navigate = useNavigate();
  const [queryKey, setQueryKey] = useState("");

  const [isCreateGroupModalOpen, setCreateGroupModalOpen] = useState(false);

  const columns: ColumnsType<GroupSearchResult> = useMemo(
    () => [
      {
        title: "name",
        dataIndex: "name",
      },

      {
        title: "creation time",
        dataIndex: "createTime",
        render: (_, record) => {
          return new Date(record.createTime).toLocaleString();
        },
      },
      {
        title: "users count",
        dataIndex: "userCount",
      },

      {
        title: "Action",
        render: (_, record) => (
          <div>
            <a
              href=""
              onClick={() => {
                navigate("/chat", {
                  state: {
                    chatroomId: record.id,
                  },
                });
              }}
            >
              Chat{" "}
            </a>
            &nbsp;
            <a
              href="#"
              onClick={() => {
                setChatroomId(record.id);
                setMembersModalOpen(true);
              }}
            >
              {" "}
              Detail
            </a>
            &nbsp; &nbsp;
            <a
              href="#"
              onClick={() => {
                setChatroomId(record.id);
                setMemberAddModalOpen(true);
              }}
            >
              Add memeber
            </a>
          </div>
        ),
      },
    ],
    []
  );

  const searchGroup = async (values: SearchGroup) => {
    try {
      const res = await chatroomList(values.name || "");

      if (res.status === 201 || res.status === 200) {
        setGroupResult(
          res.data
            .filter((item: GroupSearchResult) => {
              return item.type === true;
            })
            .map((item: GroupSearchResult) => {
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

  const [form] = useForm();

  useEffect(() => {
    searchGroup({
      name: form.getFieldValue("name"),
    });
  }, []);

  return (
    <div id="group-container">
      <div className="group-form">
        <Form
          form={form}
          onFinish={searchGroup}
          name="search"
          layout="inline"
          colon={false}
        >
          <Form.Item label="name" name="name">
            <Input />
          </Form.Item>

          <Form.Item label=" ">
            <Button type="primary" htmlType="submit">
              Search
            </Button>
          </Form.Item>
          <Form.Item label=" ">
            <Button
              type="primary"
              style={{ background: "green" }}
              onClick={() => setCreateGroupModalOpen(true)}
            >
              create group chat
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="group-table">
        <Table
          columns={columns}
          dataSource={groupResult}
          style={{ width: "1000px" }}
        />
      </div>
      <MembersModal
        queryKey={queryKey}
        isOpen={isMembersModalOpen}
        handleClose={() => {
          setMembersModalOpen(false);
        }}
        chatroomId={chatroomId}
      />
      <AddMemberModal
        isOpen={isMemberAddModalOpen}
        handleClose={() => {
          setMemberAddModalOpen(false);
          setQueryKey(Math.random().toString().slice(2, 10));
          searchGroup({
            name: form.getFieldValue("name"),
          });
        }}
        chatroomId={chatroomId}
      />
      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        handleClose={() => {
          setCreateGroupModalOpen(false);

          searchGroup({
            name: form.getFieldValue("name"),
          });
        }}
      />
    </div>
  );
}
