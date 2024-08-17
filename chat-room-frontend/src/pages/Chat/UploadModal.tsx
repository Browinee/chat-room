import { Modal } from "antd";
import { useState } from "react";
import React from "react";
import { FileUpload } from "./FileUpload";
import { ChatMessageType } from "../../enum";
import { Chat } from ".";

interface UploadModalProps {
  isOpen: boolean;
  handleClose: (imageSrc?: string) => void;
  type: ChatMessageType.FILE | ChatMessageType.IMAGE;
}

export function UploadModal(props: UploadModalProps) {
  const [imgSrc, setImgSrc] = useState<string>("");
  const { isOpen, handleClose, type } = props;

  return (
    <Modal
      title={`upload ${type === ChatMessageType.IMAGE ? "image" : "doc"}`}
      open={isOpen}
      onOk={() => {
        handleClose(imgSrc);
        setImgSrc("");
      }}
      onCancel={() => handleClose()}
      okText={"confirm"}
      cancelText={"cancel"}
    >
      <FileUpload
        type={type}
        value={imgSrc}
        onChange={(value: string) => {
          setImgSrc(value);
        }}
      />
    </Modal>
  );
}
