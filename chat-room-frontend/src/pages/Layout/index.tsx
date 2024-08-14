import { UserOutlined } from "@ant-design/icons";
import { Outlet, Link } from "react-router-dom";
import "./index.css";
import { useEffect, useState } from "react";

export function Layout() {
  const [headPic, setHeadPic] = useState();

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const info = JSON.parse(userInfo);
      setHeadPic(info.headPic);
    }
  }, []);
  return (
    <div id="index-container">
      <div className="header">
        <h1>Chat Room</h1>
        <Link to="/update-info">
          {headPic ? (
            <img src={headPic} width={40} height={40} className="icon" />
          ) : (
            <UserOutlined className="icon" />
          )}
        </Link>
      </div>
      <div className="body">
        <Outlet></Outlet>
      </div>
    </div>
  );
}
