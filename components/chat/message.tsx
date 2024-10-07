import React, {FC} from 'react'
import { Appendix } from "./svgs"; 
export interface Message {
    id: number;
    author: string;
    avatar: string;
    text: string;
    isOwn: boolean;
    time: string;
  }
interface MessageProps {
    message: Message
}
const Message : FC<MessageProps> = ({message}) => {
  return (
    <div
                    key={message.id}
                    className={`flex items-center mb-4 ${
                      message.isOwn ? "justify-end" : "justify-start"
                    }`}
                  >
                    {/* Аватарка сообщения */}
                    {!message.isOwn && (
                      <img
                        src={message.avatar}
                        alt={message.author}
                        className="w-10 h-10 rounded-full mr-4"
                      />
                    )}
                    {/* Само сообщение с хвостиком */}
                    <div
                      style={message.isOwn ? {borderRadius: '20px 10px 0px 20px'} : {borderRadius: '10px 20px 20px 0px'}}
                      className={`relative min-h-[32px] flex items-center px-2 max-w-xs ${
                        message.isOwn ? "bg-[#766ac8]  text-black" : "bg-[#212121] text-white"
                      }`}
                    >
                      <p className="text-[16px] text-white">{message.text}</p>
                      <div className="text-right text-xs mt-3 ml-[6px] mr-1 text-gray-400">
                        {message.time}
                      </div>
                      {/* Хвостик сообщения */}
                      <Appendix isOwn={!message.isOwn}  classNames={`absolute ${!message.isOwn ? "left-[-9px] scale-x-[-1] scale-y-100 top-[74%] transform -translate-y-1/2" : "right-[-9px] top-[74%] transform -translate-y-1/2"}`} />
                    </div>
                    {/* Аватарка чужого сообщения справа */}
                    {message.isOwn && (
                      <img
                        src={message.avatar}
                        alt={message.author}
                        className="w-10 h-10 rounded-full ml-4"
                      />
                    )}
                  </div>
  )
}

export default Message