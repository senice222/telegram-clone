import React, { FC } from 'react'
import { Appendix } from "../svgs";
import { MessageType } from "@/types/Message";
import { ChatData } from "@/types/Channel";
import { User } from "@/types/User";
import { isChannel, isConversation } from '@/lib/utils';

interface MessageProps {
    message: MessageType;
    channel: ChatData;
    profile: User
}

const Message: FC<MessageProps> = ({ message, channel, profile }) => {
    if (!channel) return "no channel"
    const c = isChannel(channel)
    const otherUser: User | undefined =
        isConversation(channel)
            ? (profile.id === channel.memberOne.id ? channel.memberTwo : channel.memberOne)
            : undefined
    const isOwn = message.memberId === profile.id;

    return (
        <div
            key={message.id}
            className={`flex items-center mb-4 ${isOwn ? "justify-end" : "justify-start"}`}
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
                style={isOwn ? { borderRadius: '20px 10px 0px 20px' } : { borderRadius: '10px 20px 20px 0px' }}
                className={`relative min-h-[32px] flex items-center px-2 max-w-xs ${isOwn ? "bg-[#766ac8] text-black" : "bg-[#212121] text-white"}`}
            >
                <p className="text-[16px] text-white">{message.content}</p>
                <div className="text-right text-xs mt-3 ml-[6px] mr-1 text-gray-400">
                    {/* {message.time} */} 15:00
                </div>
                <Appendix
                    isOwn={!isOwn}
                    classNames={`absolute ${!isOwn ? "left-[-9px] scale-x-[-1] scale-y-100 top-[74%] transform -translate-y-1/2" : "right-[-9px] top-[74%] transform -translate-y-1/2"}`}
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
    )
}

export default Message