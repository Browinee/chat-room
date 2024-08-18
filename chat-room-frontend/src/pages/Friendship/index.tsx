import { Button, Form, Input, Table, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOneToOne, findChatroom } from "../../api/chatroom";
import { friendshipList } from "../../api/friendship";
import { getUserInfo } from "../Chat/utils";
import { AddFriendModal } from "./AddFriendModal";
import "./index.css";

interface SearchFriend {
  name: string;
}

interface FriendshipSearchResult {
  id: number;
  username: string;
  nickName: string;
  headPic: string;
  email: string;
}

export function Friendship() {
  const [friendshipResult, setFriendshipResult] = useState<
    Array<FriendshipSearchResult>
  >([]);

  const [isAddFriendModalOpen, setAddFriendModalOpen] = useState(false);
  const navigate = useNavigate();

  const goToChat = async (friendId: number) => {
    const userId = getUserInfo().id;
    try {
      const res = await findChatroom(userId, friendId);
      if (res.data) {
        // NOTE: 這裡是用state 而不是放到url中
        navigate("/chat", {
          state: {
            chatroomId: res.data,
          },
        });
      } else {
        const res2 = await createOneToOne(friendId);
        navigate("/chat", {
          state: {
            chatroomId: res2.data,
          },
        });
      }
    } catch (error) {}
  };

  const columns: ColumnsType<FriendshipSearchResult> = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
      },
      {
        title: "username",
        dataIndex: "username",
      },
      {
        title: "nickName",
        dataIndex: "nickName",
      },
      {
        title: "headPic",
        dataIndex: "headPic",
        render: (_, record) => (
          <div>
            <img src={record.headPic} />
          </div>
        ),
      },
      {
        title: "Email",
        dataIndex: "email",
      },
      {
        title: "Action",
        render: (_, record) => (
          <div>
            <a
              href="#"
              onClick={() => {
                goToChat(record.id);
              }}
            >
              Chat
            </a>
          </div>
        ),
      },
    ],
    []
  );

  const searchFriend = async (values: SearchFriend) => {
    try {
      const res = await friendshipList(values.name || "");

      if (res.status === 201 || res.status === 200) {
        setFriendshipResult(
          res.data.map((item: FriendshipSearchResult) => {
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
    searchFriend({
      name: form.getFieldValue("name"),
    });
  }, []);

  return (
    <div id="friendship-container">
      <div className="friendship-form">
        <Form
          form={form}
          onFinish={searchFriend}
          name="search"
          layout="inline"
          colon={false}
        >
          <Form.Item label="Name" name="name">
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
              onClick={() => setAddFriendModalOpen(true)}
            >
              Add Friend
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="friendship-table">
        <Table
          columns={columns}
          dataSource={friendshipResult}
          style={{ width: "1000px" }}
        />
      </div>
      <AddFriendModal
        isOpen={isAddFriendModalOpen}
        handleClose={() => {
          setAddFriendModalOpen(false);
        }}
      />
    </div>
  );
}
