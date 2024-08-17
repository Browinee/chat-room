import { message } from "antd";
import { useState } from "react";
import { chatHistoryList } from "../../api/chatroom";
import "./index.css";
import { ChatMessageType } from "../../enum";
import { UserInfo } from "../UpdateInfo";

export interface Chatroom {
  id: number;
  name: string;
  createTime: Date;
}
export interface ChatHistory {
  id: number;
  content: string;
  type: ChatMessageType;
  chatroomId: number;
  senderId: number;
  createTime: Date;
  sender: UserInfo;
}

export const useGetChatHistory = () => {
  const [chatHistory, setChatHistory] = useState<Array<ChatHistory>>();
  async function queryChatHistoryList(chatroomId: number) {
    try {
      const res = await chatHistoryList(chatroomId);

      if (res.status === 201 || res.status === 200) {
        setChatHistory(
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
  return { chatHistory, queryChatHistoryList, setChatHistory };
};
