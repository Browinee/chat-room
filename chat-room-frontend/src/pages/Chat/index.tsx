import { Button, Input, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import "./index.css";
import { chatHistoryList, chatroomList } from "../../api/chatroom";
import { UserInfo } from "../UpdateInfo";
import React from "react";
import TextArea from "antd/es/input/TextArea";
import { getUserInfo } from "./utils";

interface JoinRoomPayload {
  chatroomId: number;
  userId: number;
}

interface SendMessagePayload {
  sendUserId: number;
  chatroomId: number;
  message: Message;
}
const enum ChatMessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  FILE = "FILE",
}

interface Message {
  type: ChatMessageType;
  content: string;
}

type Reply =
  | {
      type: "sendMessage";
      userId: number;
      message: Message;
    }
  | {
      type: "joinRoom";
      userId: number;
    };
interface Chatroom {
  id: number;
  name: string;
  createTime: Date;
}
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
  const [roomList, setRoomList] = useState<Array<Chatroom>>();
  const userInfo = getUserInfo();
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [roomId, setChatroomId] = useState<number>();

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
  useEffect(() => {
    if (!roomId) {
      return;
    }
    const socket = (socketRef.current = io("http://localhost:3009"));
    socket.on("connect", function () {
      const payload: JoinRoomPayload = {
        chatroomId: roomId,
        userId: userInfo.id,
      };

      socket.emit("joinRoom", payload);
      socket.on("message", (reply: Reply) => {
        queryChatHistoryList(roomId);
        setTimeout(() => {
          document
            .getElementById("bottom-bar")
            ?.scrollIntoView({ block: "end" });
        }, 500);
      });
      // socket.on("message", (reply: Reply) => {
      //   console.log("reply", reply);

      //   if (reply.type === "joinRoom") {
      //     setMessageList((messageList) => [
      //       ...messageList,
      //       {
      //         type: ChatMessageType.TEXT,
      //         content: "user " + reply.userId + "join room",
      //       },
      //     ]);
      //   } else {
      //     setMessageList((messageList) => [...messageList, reply.message]);
      //   }
      // });
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
        type: ChatMessageType.TEXT,
        content: value,
      },
    };

    socketRef.current?.emit("sendMessage", payload);
  }
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

  const [inputText, setInputText] = useState("");

  return (
    <div id="chat-container">
      <div className="chat-room-list">
        {roomList?.map((item) => {
          return (
            <div
              className="chat-room-item"
              data-id={item.id}
              key={item.id}
              onClick={() => {
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
