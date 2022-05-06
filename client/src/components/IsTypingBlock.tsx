import { CSSProperties } from "react";
import { useSocket } from "../SocketContext";

const IsTypingBlock = () => {
  const { isTypingBlock } = useSocket();

  return <div style={rootStyle}>{isTypingBlock}</div>;
};

const rootStyle: CSSProperties = {
  color: "grey",
  fontSize: ".9rem",
  textAlign: "center",
};

export default IsTypingBlock;
