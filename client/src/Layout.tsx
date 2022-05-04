import { Outlet } from "react-router-dom";
import ListOfRooms from "./ListOfRooms";

const Layout = () => {
  return (
    <div style={{ display: "flex" }}>
      <ListOfRooms />
      <Outlet />
    </div>
  );
};

export default Layout;
