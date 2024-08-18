import { Table, message, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { favoriteDel, queryFavoriteList } from "../../api/favorite";

interface Favorite {
  id: number;
  chatHistory: {
    id: number;
    content: string;
    type: number;
    createTime: Date;
  };
}

export function Collection() {
  const [favoriteList, setFavoriteList] = useState<Array<Favorite>>([]);

  const columns: ColumnsType<Favorite> = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "content",
      render: (_, record) => (
        <div>
          {record.chatHistory.type === 0 ? (
            record.chatHistory.content
          ) : record.chatHistory.type === 1 ? (
            <img src={record.chatHistory.content} style={{ maxHeight: 200 }} />
          ) : (
            <a href={record.chatHistory.content} download>
              {record.chatHistory.content}
            </a>
          )}
        </div>
      ),
    },
    {
      title: "create time",
      render: (_, record) => (
        <div>{new Date(record.chatHistory.createTime).toLocaleString()}</div>
      ),
    },
    {
      title: "Action",
      render: (_, record) => (
        <div>
          <Popconfirm
            title="Delete favoriate"
            description="Ready to confirm?"
            onConfirm={() => delFavorite(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <a href="#">Delete</a>
          </Popconfirm>
        </div>
      ),
    },
  ];
  async function delFavorite(id: number) {
    try {
      const res = await favoriteDel(id);

      if (res.status === 201 || res.status === 200) {
        message.success("delete success");
        query();
      }
    } catch (e: any) {
      message.error(e.response?.data?.message || "Please try again later");
    }
  }
  const query = async () => {
    try {
      const res = await queryFavoriteList();

      if (res.status === 201 || res.status === 200) {
        setFavoriteList(
          res.data.map((item: Favorite) => {
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
    query();
  }, []);

  return (
    <div id="friendship-container">
      <div className="favorite-table">
        <Table
          columns={columns}
          dataSource={favoriteList}
          style={{ width: "1000px" }}
        />
      </div>
    </div>
  );
}
