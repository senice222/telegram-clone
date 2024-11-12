import React, { FC } from "react";
import { MessageType } from "@/types/Message";
import { ChatData } from "@/types/Channel";
import { User } from "@/types/User";
import Message from "./message";
import { isGroup } from "@/lib/utils";

interface MessageListProps {
  data: any;
  channelData: ChatData;
  profile: User;
  bottomRef: React.RefObject<HTMLDivElement>;
  chatRef: React.RefObject<HTMLDivElement>;
  setIsReplying: React.Dispatch<React.SetStateAction<MessageType | null>>
  queryKey: string,
  categorizedMessages: {
    media: MessageType[];
    files: MessageType[];
    links: MessageType[];
  };
}

const MessageList: FC<MessageListProps> = ({ chatRef, data, channelData, profile, bottomRef, setIsReplying, queryKey, categorizedMessages }) => {
  const isModerator = isGroup(channelData) && channelData.members.some((moderator) => moderator.id === profile.id);
  return (
    <div ref={chatRef} className="h-[calc(100%-130px)] overflow-y-auto p-4">
      {data?.pages?.map((group: any, i: number) => (
        <div key={i}>
          {group.items.map((message: MessageType) => (
            <div key={message.id} id={message.id} className="message">
              <Message
                isModerator={isModerator}
                queryKey={queryKey}
                categorizedMessages={categorizedMessages}
                setIsReplying={setIsReplying}
                key={message.id}
                message={message}
                channel={channelData}
                profile={profile}
              />
            </div>
          ))}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
