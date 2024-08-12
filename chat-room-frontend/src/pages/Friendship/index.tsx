import { Badge, Button, Form, Input, Popconfirm, Table, message } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import "./index.css";
import { ColumnsType } from "antd/es/table";
import { useForm } from "antd/es/form/Form";
import { friendshipList } from "../../api/friendship";

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

  const columns: ColumnsType<FriendshipSearchResult> = useMemo(
    () => [
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
            <a href="#">Chat</a>
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
        </Form>
      </div>
      <div className="friendship-table">
        <Table
          columns={columns}
          dataSource={friendshipResult}
          style={{ width: "1000px" }}
        />
      </div>
    </div>
  );
}
