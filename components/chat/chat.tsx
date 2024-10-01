import React, { FC } from "react";
import Image from "next/image";
import { Search, EllipsisVertical } from "lucide-react";
import Header from "./header";

interface Props {}

const Chat: FC<Props> = () => {
  return (
    <div className="w-full flex flex-col">
      <Header />
    </div>
  );
};

export default Chat;
