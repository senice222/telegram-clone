import React, { FC } from "react";
import { Appendix } from "../svgs";
import { MessageType } from "@/types/Message";
import { ChatData } from "@/types/Channel";
import { User } from "@/types/User";
import { isChannel, isConversation, isGroup } from "@/lib/utils";
import { fileColors } from "../data";
import { Member } from "@/types/Group";
import { format } from 'date-fns';

interface MessageProps {
  message: MessageType;
  channel: ChatData;
  profile: User;
}

const Message: FC<MessageProps> = ({ message, channel, profile }) => {
  if (!channel) return "no channel";
  const isOwn = message.memberId === profile.id;

  const otherUser: User | undefined = isConversation(channel)
    ? profile?.id === channel?.memberOne?.id
      ? channel?.memberTwo
      : channel?.memberOne
    : isGroup(channel)
      ? channel?.members?.find((member: Member) => member?.profile?.id !== profile?.id)?.profile
      : undefined;

  const truncateUrl = (url: string, maxLength: number) => {
    if (url?.length <= maxLength) return url;
    return url?.slice(0, maxLength) + "...";
  };
  const timestamp = format(new Date(message.createdAt), 'PPpp');

  return (
    <div
      key={message.id}
      className={`flex items-center mb-4 ${isOwn ? "justify-end" : "justify-start"
        }`}
    >
      {/* Avatar on the left for incoming messages */}
      {!isOwn && message.channel && (
        <img
          src={`${process.env.NEXT_PUBLIC_SERVER_URL}/api/uploads/${message.channel.image}`}
          alt="Channel avatar"
          className="w-10 h-10 rounded-full mr-4"
        />
      )}
      {!isOwn && !message.channel && otherUser?.imageUrl && (
        <img
          src={otherUser.imageUrl}
          alt="Other user's avatar"
          className="w-10 h-10 rounded-full mr-4"
        />
      )}

      {/* Message bubble */}
      <div
        style={
          isOwn
            ? { borderRadius: "20px 10px 0px 20px" }
            : { borderRadius: "10px 20px 20px 0px" }
        }
        className={`relative min-h-[32px] flex flex-col justify-center px-2 max-w-xs ${isOwn ? "bg-[#766ac8] text-black" : "bg-[#212121] text-white"
          }`}
      >
        <div className="overflow-auto grid gap-2 h-full grid-cols-2">
          {
            message.files.type === "imgs" ? message.files?.fileUrls?.map((photo: any, index: number) => (
              <div
                key={index}
                className={`relative mt-2 ${message.files.fileUrls.length % 2 !== 0 &&
                    index === message.files.fileUrls.length - 1
                    ? "col-span-2"
                    : ""
                  }`}
              >
                <img
                  className="rounded-[12px] max-h-[500px] w-full h-full object-cover"
                  src={`${process.env.NEXT_PUBLIC_SERVER_URL}/api/uploads/${photo.filename}`}
                  alt={`photo-${index}`}
                />
              </div>
            )) : message.files.fileUrls.map((file: any) => {
              const iconColor = fileColors[file.mimetype?.split('/')[file.mimetype.split.length - 1]] || fileColors.unknown;
              if (file) {
                return (
                  <div
                    key={file.originalname}
                    className={`flex items-center justify-between p-2`}
                  >
                    <div
                      className={`flex items-center ${iconColor} w-[48px] h-[48px] justify-center rounded-[6px]`}
                    >
                      <span className="text-white">{file.mimetype?.split('/')[file.mimetype.split.length - 1]}</span>
                    </div>
                    <div className="flex flex-col flex-grow ml-2">
                      <span className="text-white">{truncateUrl(file.originalname, 20)}</span>
                      <span className="text-[#aaaaaa] text-sm">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                );
              } else {
                return null;
              }
            })
          }
        </div>
        <div className="flex w-full min-h-[32px] mt-1 items-center justify-end">
          <p className="text-[16px] text-white">{message.content}</p>
          <div className="text-right text-xs mt-3 ml-[6px] mr-1 text-gray-400">
            {timestamp}
          </div>
        </div>
        <Appendix
          isOwn={!isOwn}
          classNames={`absolute ${!isOwn
              ? "left-[-9px] scale-x-[-1] scale-y-100 top-[74%] transform -translate-y-1/2"
              : "right-[-9px] top-[calc(100%-9px)] transform -translate-y-1/2"
            }`}
        />
      </div>

      {/* Avatar on the right for outgoing messages */}
      {isOwn && (
        <img
          src={profile.imageUrl}
          alt="Current user's avatar"
          className="w-10 h-10 rounded-full ml-4"
        />
      )}
    </div>
  );
};

export default Message;
