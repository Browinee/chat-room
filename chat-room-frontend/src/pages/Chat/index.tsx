import data from "@emoji-mart/data";
import EmojiPicker from "@emoji-mart/react";
import { Button, message, Popover } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { ChatMessageType } from "../../enum";
import { UserInfo } from "../UpdateInfo";
import "./index.css";
import { UploadModal } from "./UploadModal";
import { useGetChatHistory } from "./useGetChatHistory";
import { useGetChatRooms } from "./useGetChatRooms";
import { getUserInfo } from "./utils";
import { favoriteAdd } from "../../api/favorite";

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

  const [uploadType, setUploadType] = useState<
    ChatMessageType.FILE | ChatMessageType.IMAGE
  >(ChatMessageType.FILE);

  async function addToFavorite(chatHistoryId: number) {
    try {
      const res = await favoriteAdd(chatHistoryId);

      if (res.status === 201 || res.status === 200) {
        message.success("add to favorite");
      }
    } catch (e: any) {
      message.error(e.response?.data?.message || "Please try again later");
    }
  }

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
              onDoubleClick={() => {
                addToFavorite(item.id);
              }}
            >
              <div className="message-sender">
                <img src={item.sender.headPic} />
                <span className="sender-nickname">{item.sender.nickName}</span>
              </div>
              <div className="message-content">
                {" "}
                {item.type === ChatMessageType.TEXT ? (
                  item.content
                ) : item.type === ChatMessageType.IMAGE ? (
                  <img src={item.content} style={{ maxWidth: 200 }} />
                ) : (
                  <div>
                    <a download href={item.content}>
                      {item.content}
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div id="bottom-bar" key="bottom-bar"></div>
      </div>
      <div className="message-input">
        <div className="message-type">
          <div className="message-type-item" key={1}>
            <Popover
              content={
                <EmojiPicker
                  data={data}
                  onEmojiSelect={(emoji: any) => {
                    setInputText((inputText) => inputText + emoji.native);
                  }}
                />
              }
              title="Title"
              // trigger="click"
            >
              Emoji
            </Popover>
          </div>
          <div
            className="message-type-item"
            key={2}
            onClick={() => {
              setUploadType(ChatMessageType.IMAGE);
              setUploadModalOpen(true);
            }}
          >
            Image
          </div>
          <div
            className="message-type-item"
            key={3}
            onClick={() => {
              setUploadType(ChatMessageType.FILE);
              setUploadModalOpen(true);
            }}
          >
            doc
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
            Send
          </Button>
        </div>
      </div>
      <UploadModal
        isOpen={isUploadModalOpen}
        type={uploadType}
        handleClose={(fileUrl) => {
          setUploadModalOpen(false);

          if (fileUrl) {
            sendMessage(fileUrl, uploadType);
          }
        }}
      />
    </div>
  );
}
