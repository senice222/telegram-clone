import React, {FC} from 'react'
import {Appendix} from "../svgs";
import {MessageType} from "@/types/Message";
import {ChannelType} from "@/types/Channel";
import {User} from "@/types/User";

interface MessageProps {
    message: MessageType;
    channel: ChannelType
}

const Message: FC<MessageProps> = ({message, channel}) => {
    if (!channel) return "no channel"

    return (
        <div
            key={message.id}
            className={`flex items-center mb-4 ${message.isOwn ? "justify-end" : "justify-start"
            }`}
        >
            <img
                src={`${process.env.NEXT_PUBLIC_SERVER_URL}/api/uploads/${channel.image}`}
                alt="Channel avatar"
                className="w-10 h-10 rounded-full mr-4"
            />
            {/*/!*{!message.isOwn && message.channel ? (*!/*/}
            {/*    <img*/}
            {/*        src={`${process.env.NEXT_PUBLIC_SERVER_URL}/api/uploads/${message.channel.image}`}*/}
            {/*        alt="Channel avatar"*/}
            {/*        className="w-10 h-10 rounded-full mr-4"*/}
            {/*    />*/}
            {/*// ) : (*/}
            {/*//     <img*/}
            {/*//         src={"message.avatar"}*/}
            {/*//         alt={"message.author"}*/}
            {/*//         className="w-10 h-10 rounded-full mr-4"*/}
            {/*//     />*/}
            {/*// )}*/}
            <div
                style={message.isOwn ? {borderRadius: '20px 10px 0px 20px'} : {borderRadius: '10px 20px 20px 0px'}}
                className={`relative min-h-[32px] flex items-center px-2 max-w-xs ${message.isOwn ? "bg-[#766ac8]  text-black" : "bg-[#212121] text-white"
                }`}
            >
                <p className="text-[16px] text-white">{message.content}</p>
                <div className="text-right text-xs mt-3 ml-[6px] mr-1 text-gray-400">
                    {/*{message.time}*/} 15:00
                </div>
                {/* Хвостик сообщения */}
                <Appendix isOwn={!message.isOwn}
                          classNames={`absolute ${!message.isOwn ? "left-[-9px] scale-x-[-1] scale-y-100 top-[74%] transform -translate-y-1/2" : "right-[-9px] top-[74%] transform -translate-y-1/2"}`}/>
            </div>

            {/* Аватарка чужого сообщения справа */}
            {(message.isOwn && !message.channel) && (
                <img
                    src={"message.avatar"}
                    alt={"message.author"}
                    className="w-10 h-10 rounded-full ml-4"
                />
            )}
        </div>
    )
}

export default Message