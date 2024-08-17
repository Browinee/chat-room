import { message } from "antd";
import { useEffect, useState } from "react";
import { chatroomList } from "../../api/chatroom";
import "./index.css";
import { Chatroom } from "./useGetChatHistory";

export const useGetChatRooms = () => {
  const [roomList, setRoomList] = useState<Array<Chatroom>>();
  async function queryChatroomList() {
    try {
      const res = await chatroomList();

      if (res.status === 201 || res.status === 200) {
        setRoomList(
          res.data.map((item: Chatroom) => {
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
    queryChatroomList();
  }, []);
  return { roomList, queryChatroomList };
};
