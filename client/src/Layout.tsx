import { Outlet } from "react-router-dom";
import ListOfRooms from "./ListOfRooms";
import { ContextType, useSocket } from "./SocketContext";

const Layout = () => {
  const { loggedIn } = useSocket() as ContextType;

  // Different layout depending on logged in our not
  return (
    <div>
      {loggedIn ? (
        <div style={{ display: "flex" }}>
          <ListOfRooms />
          <Outlet />
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default Layout;
