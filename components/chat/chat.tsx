import React, { FC } from "react";
import Image from "next/image";
import { Search, EllipsisVertical } from "lucide-react";
import SendMessage from "./send-message";
import Header from "./header";

interface Props {}

const Chat: FC<Props> = () => {
  return (
    <div className="w-full flex flex-col h-[100vh] items-center">
      <Header />
      <div className="w-[728px] h-full flex flex-col items-center">
        <div className="h-[calc(100%-56px)]"></div>
        <SendMessage />
      </div>
    </div>
  );
};

export default Chat;
