import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { UpdatePassword } from "./pages/UpdatePassword";
import { Layout } from "./pages/Layout";
const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "aaa",
        element: <div>aaa</div>,
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "update_password",
    element: <UpdatePassword />,
  },
];
const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<RouterProvider router={router} />);
