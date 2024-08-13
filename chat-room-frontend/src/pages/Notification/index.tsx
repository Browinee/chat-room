import {
  Button,
  Form,
  Input,
  Popconfirm,
  Table,
  Tabs,
  TabsProps,
  message,
} from "antd";
import { useForm } from "antd/es/form/Form";
import "./index.css";
import { useEffect, useState } from "react";
import {
  agreeFriendRequest,
  friendRequestList,
  rejectFriendRequest,
} from "../../api/friendship";
import { ColumnsType } from "antd/es/table";

interface User {
  id: number;
  headPic: string;
  nickName: string;
  email: string;
  captcha: string;
}

interface FriendRequest {
  id: number;
  fromUserId: number;
  toUserId: number;
  reason: string;
  createTime: Date;
  fromUser: User;
  toUser: User;
  status: number;
}

export function Notification() {
  const [form] = useForm();
  const [fromMe, setFromMe] = useState<Array<FriendRequest>>([]);
  const [toMe, setToMe] = useState<Array<FriendRequest>>([]);

  async function queryFriendRequestList() {
    try {
      const res = await friendRequestList();

      if (res.status === 201 || res.status === 200) {
        setFromMe(
          res.data.fromMe.map((item: FriendRequest) => {
            return {
              ...item,
              key: item.id,
            };
          })
        );
        setToMe(
          res.data.toMe.map((item: FriendRequest) => {
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
  }

  useEffect(() => {
    queryFriendRequestList();
  }, []);

  async function agree(id: number) {
    try {
      const res = await agreeFriendRequest(id);

      if (res.status === 201 || res.status === 200) {
        message.success("Approve");
        queryFriendRequestList();
      }
    } catch (e: any) {
      message.error(e.response?.data?.message || "Please try again later");
    }
  }

  async function reject(id: number) {
    try {
      const res = await rejectFriendRequest(id);

      if (res.status === 201 || res.status === 200) {
        message.success("Reject");
        queryFriendRequestList();
      }
    } catch (e: any) {
      message.error(e.response?.data?.message || "Please try again later");
    }
  }
  const onChange = (key: string) => {
    console.log(key);
  };
  const toMeColumns: ColumnsType<FriendRequest> = [
    {
      title: "User",
      render: (_, record) => {
        return (
          <div>
            <img src={record.fromUser.headPic} width={30} height={30} />
            {" " + record.fromUser.nickName + " send your friend request"}
          </div>
        );
      },
    },
    {
      title: "Reason",
      dataIndex: "reason",
    },
    {
      title: "create time",
      render: (_, record) => {
        return new Date(record.createTime).toLocaleString();
      },
    },
    {
      title: "Action",
      render: (_, record) => {
        if (record.status === "PENDING") {
          return (
            <div>
              <a href="#" onClick={() => agree(record.fromUserId)}>
                Approve
              </a>
              <br />
              <a href="#" onClick={() => reject(record.fromUserId)}>
                Disapproved
              </a>
            </div>
          );
        } else {
          const map: Record<string, any> = {
            ACCEPTED: "Approved",
            REJECTED: "Rejected",
          };
          return <div>{map[record.status]}</div>;
        }
      },
    },
  ];
  const fromMeColumns: ColumnsType<FriendRequest> = [
    {
      title: "User",
      render: (_, record) => {
        return (
          <div>
            {" 请求添加好友 " + record.toUser.nickName}
            <img src={record.toUser.headPic} width={30} height={30} />
          </div>
        );
      },
    },
    {
      title: "Reason",
      dataIndex: "reason",
    },
    {
      title: "create time",
      render: (_, record) => {
        return new Date(record.createTime).toLocaleString();
      },
    },
    {
      title: "status",
      render: (_, record) => {
        console.log("record", record);
        const map: Record<string, any> = {
          PENDING: "Pending",
          ACCEPTED: "Approved",
          2: "Rejected",
        };
        return <div>{map[record.status]}</div>;
      },
    },
  ];

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Received",
      children: (
        <div style={{ width: 1000 }}>
          <Table
            columns={toMeColumns}
            dataSource={toMe}
            style={{ width: "1000px" }}
          />
        </div>
      ),
    },
    {
      key: "2",
      label: "Sent",
      children: (
        <div style={{ width: 1000 }}>
          <Table
            columns={fromMeColumns}
            dataSource={fromMe}
            style={{ width: "1000px" }}
          />
        </div>
      ),
    },
  ];

  return (
    <div id="notification-container">
      <div className="notification-list">
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </div>
    </div>
  );
}
