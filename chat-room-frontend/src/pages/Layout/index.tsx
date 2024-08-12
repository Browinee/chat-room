import { UserOutlined } from "@ant-design/icons";
import { Outlet, Link } from "react-router-dom";
import "./index.css";

export function Layout() {
  return (
    <div id="index-container">
      <div className="header">
        <h1>Chat Room</h1>
        <Link to="/update-info">
          <UserOutlined className="icon" />
        </Link>
      </div>
      <div className="body">
        <Outlet></Outlet>
      </div>
    </div>
  );
}
