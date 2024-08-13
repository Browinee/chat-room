import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu as AntdMenu, MenuProps } from "antd";
import "./index.css";
import { MenuClickEventHandler } from "rc-menu/lib/interface";
import React from "react";

const items: MenuProps["items"] = [
  {
    key: "1",
    label: "好友",
  },
  {
    key: "2",
    label: "群聊",
  },
  {
    key: "3",
    label: "聊天",
  },
  {
    key: "4",
    label: "收藏",
  },
  {
    key: "5",
    label: "通知",
  },
];

export function Menu() {
  const location = useLocation();
  const navigate = useNavigate();
  const handleMenuItemClick: MenuClickEventHandler = (info) => {
    let path = "";
    switch (info.key) {
      case "1":
        path = "/";
        break;
      case "2":
        path = "/group";
        break;
      case "3":
        path = "/chat";
        break;
      case "4":
        path = "/collection";
        break;
      case "5":
        path = "/notification";
        break;
    }
    navigate(path);
  };
  function getSelectedKeys() {
    if (location.pathname === "/group") {
      return ["2"];
    } else if (location.pathname === "/chat") {
      return ["3"];
    } else if (location.pathname === "/collection") {
      return ["4"];
    } else if (location.pathname === "/notification") {
      return ["5"];
    } else {
      return ["1"];
    }
  }

  return (
    <div id="menu-container">
      <div className="menu-area">
        <AntdMenu
          defaultSelectedKeys={getSelectedKeys()}
          items={items}
          onClick={handleMenuItemClick}
        />
      </div>
      <div className="content-area">
        <Outlet></Outlet>
      </div>
    </div>
  );
}