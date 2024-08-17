import { Button, Input, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import "./index.css";
import { chatHistoryList, chatroomList } from "../../api/chatroom";
import { UserInfo } from "../UpdateInfo";
import React from "react";
import TextArea from "antd/es/input/TextArea";
import { getUserInfo } from "./utils";
import { useLocation } from "react-router-dom";
import { ChatMessageType } from "../../enum";
import { Chatroom, useGetChatHistory } from "./useGetChatHistory";
import { useGetChatRooms } from "./useGetChatRooms";

interface JoinRoomPayload {
  chatroomId: number;
  userId: number;
}

interface SendMessagePayload {
  sendUserId: number;
  chatroomId: number;
  message: Message;
}

interface Message {
  type: ChatMessageType;
  content: string;
}

type Reply =
  | {
      type: "sendMessage";
      userId: number;
      message: ChatHistory;
    }
  | {
      type: "joinRoom";
      userId: number;
    };

interface ChatHistory {
  id: number;
  content: string;
  type: ChatMessageType;
  chatroomId: number;
  senderId: number;
  createTime: Date;
  sender: UserInfo;
}

export function Chat() {
  const [messageList, setMessageList] = useState<Array<Message>>([]);
  const socketRef = useRef<Socket>();
  const userInfo = getUserInfo();
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [roomId, setChatroomId] = useState<number>();

  const { roomList, queryChatroomList } = useGetChatRooms();
  const { chatHistory, queryChatHistoryList, setChatHistory } =
    useGetChatHistory();

  useEffect(() => {
    if (!roomId) {
      return;
    }
    queryChatHistoryList(roomId);
    const socket = (socketRef.current = io("http://localhost:3009"));
    socket.on("connect", function () {
      const payload: JoinRoomPayload = {
        chatroomId: roomId,
        userId: userInfo.id,
      };
      socket.emit("joinRoom", payload);
      socket.on("message", (reply: Reply) => {
        if (reply.type === "sendMessage") {
          setChatHistory((chatHistory) => {
            return chatHistory
              ? [...chatHistory, reply.message]
              : [reply.message];
          });
        }
        setTimeout(() => {
          document
            .getElementById("bottom-bar")
            ?.scrollIntoView({ block: "end" });
        }, 500);
      });
    });
    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  function sendMessage(
    value: string,
    type: ChatMessageType = ChatMessageType.TEXT
  ) {
    if (!value) return;
    if (!roomId) {
      return;
    }

    const payload: SendMessagePayload = {
      sendUserId: getUserInfo().id,
      chatroomId: roomId,
      message: {
        type,
        content: value,
      },
    };

    socketRef.current?.emit("sendMessage", payload);
  }

  const [inputText, setInputText] = useState("");

  const location = useLocation();
  useEffect(() => {
    setChatroomId(location.state?.chatroomId);
  }, [location.state?.chatroomId]);

  return (
    <div id="chat-container">
      <div className="chat-room-list">
        {roomList?.map((item) => {
          return (
            <div
              className={`chat-room-item ${
                item.id === roomId ? "selected" : ""
              }`}
              data-id={item.id}
              key={item.id}
              onClick={() => {
                queryChatHistoryList(item.id);
                setChatroomId(item.id);
              }}
            >
              {item.name}
            </div>
          );
        })}
      </div>
      <div className={`message-list`}>
        {chatHistory?.map((item) => {
          return (
            <div
              className={`message-item ${
                item.senderId === userInfo.id ? "from-me" : ""
              }`}
              data-id={item.id}
              key={item.id}
            >
              <div className="message-sender">
                <img src={item.sender.headPic} />
                <span className="sender-nickname">{item.sender.nickName}</span>
              </div>
              <div className="message-content">{item.content}</div>
            </div>
          );
        })}
        <div id="bottom-bar" key="bottom-bar"></div>
      </div>
      <div className="message-input">
        <div className="message-type">
          <div className="message-type-item" key={1}>
            {/* <Popover
              content={
                <EmojiPicker
                  data={data}
                  onEmojiSelect={(emoji: any) => {
                    setInputText((inputText) => inputText + emoji.native);
                  }}
                />
              }
              title="Title"
              trigger="click"
            >
              表情
            </Popover> */}
          </div>
          <div
            className="message-type-item"
            key={2}
            onClick={() => {
              // setUploadType("image");
              // setUploadModalOpen(true);
            }}
          >
            图片
          </div>
          <div
            className="message-type-item"
            key={3}
            onClick={() => {
              // setUploadType("file");
              // setUploadModalOpen(true);
            }}
          >
            文件
          </div>
        </div>
        <div className="message-input-area">
          <TextArea
            className="message-input-box"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
            }}
          />
          <Button
            className="message-send-btn"
            type="primary"
            onClick={() => {
              sendMessage(inputText);
              setInputText("");
            }}
          >
            发送
          </Button>
        </div>
      </div>
    </div>
  );
}
