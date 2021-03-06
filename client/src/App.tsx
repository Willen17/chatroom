import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ChatInput from "./ChatInput";
import DmInput from "./DmInput";
import Layout from "./Layout";
import NameInput from "./NameInput";
import RoomInput from "./RoomInput";
import SocketProvider from "./SocketContext";

function App() {
  return (
    <BrowserRouter>
      <SocketProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<NameInput />} />
            <Route path="/room" element={<RoomInput />} />
            <Route path="/chat" element={<ChatInput />} />
            <Route path="/dm" element={<DmInput />} />
          </Route>
        </Routes>
      </SocketProvider>
    </BrowserRouter>
  );
}

export default App;
