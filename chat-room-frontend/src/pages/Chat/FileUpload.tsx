import { InboxOutlined } from "@ant-design/icons";
import { message } from "antd";
import Dragger, { DraggerProps } from "antd/es/upload/Dragger";
import axios from "axios";
import { presignedUrl } from "../../api/user";
import { ChatMessageType } from "../../enum";

interface FileUploadProps {
  value?: string;
  onChange?: Function;
  type: ChatMessageType.FILE | ChatMessageType.IMAGE;
}

let onChange: Function;

const props: DraggerProps = {
  name: "file",
  action: async (file) => {
    const res = await presignedUrl(file.name);
    return res.data;
  },
  async customRequest(options) {
    const { onSuccess, file, action } = options;

    const res = await axios.put(action, file);

    onSuccess!(res.data);
  },
  onChange(info) {
    const { status } = info.file;
    if (status === "done") {
      onChange("http://localhost:9000/avatar/" + info.file.name);
      message.success(`${info.file.name} file uploaded`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed`);
    }
  },
};

const dragger = (
  <Dragger {...props}>
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text">click or drag file to this area to upload</p>
  </Dragger>
);

export function FileUpload(props: FileUploadProps) {
  onChange = props.onChange!;

  return props?.value ? (
    <div>
      {props.type === ChatMessageType.IMAGE ? (
        <img src={props.value} alt="image" width="100" height="100" />
      ) : (
        props.value
      )}
      {dragger}
    </div>
  ) : (
    <div>{dragger}</div>
  );
}
