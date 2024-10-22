import React, { FC } from "react";
import { MessageType } from "@/types/Message";
import { ChatData } from "@/types/Channel";
import { User } from "@/types/User";
import Message from "./message";

interface MessageListProps {
  data: any;
  channelData: ChatData;
  profile: User;
  bottomRef: React.RefObject<HTMLDivElement>;
  chatRef: React.RefObject<HTMLDivElement>;
  setIsReplying: React.Dispatch<React.SetStateAction<MessageType | null>> 
}

const MessageList: FC<MessageListProps> = ({ chatRef, data, channelData, profile, bottomRef, setIsReplying }) => {
  return (
    <div ref={chatRef} className="h-[calc(100%-130px)] overflow-y-auto p-4">
      {data?.pages?.map((group: any, i: number) => (
        <div key={i}>
          {group.items.map((message: MessageType) => (
            <Message
              setIsReplying={setIsReplying}
              key={message.id}
              message={message}
              channel={channelData}
              profile={profile}
            />
          ))}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
