"use client";
import React, { FC, useEffect, useRef, useState } from "react";
import SendMessage from "./send-message";
import Header from "./header";
import Message from "./message";
import RightPanel from "./right-panel";
import { MessageI } from "@/types/Message";
import { ChannelChatProps } from "@/types/Channel";

const Chat: FC<ChannelChatProps> = ({ channelData }) => {
    console.log(channelData)
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const headerRef = useRef<HTMLDivElement | null>(null);

    // Пример сообщений
    const [messages, setMessages] = useState<MessageI[]>([
      {
        id: 1,
        author: "User1",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        text: "Привет, как дела?",
        isOwn: true,
        time: "20:40",
      },
      {
        id: 2,
        author: "Me",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        text: "Привет! Все хорошо, спасибо.",
        isOwn: false,
        time: "20:40",
      },
      {
        id: 3,
        author: "User1",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        text: "Отлично!",
        isOwn: true,
        time: "20:41",
      },
    ]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;

        if (
          menuRef.current &&
          !menuRef.current.contains(target) &&
          headerRef.current &&
          !headerRef.current.contains(target)
        ) {
          setIsMenuOpen(false);
        }
      };

      if (isMenuOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      } else {
        document.removeEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isMenuOpen]);

    const handleHeaderClick = (event: React.MouseEvent) => {
      event.stopPropagation();
      setIsMenuOpen(!isMenuOpen);
    };

    return (
      <div className="w-full h-[100vh] flex">
        <div className="w-full h-[100vh] flex flex-col">
          <div
            ref={headerRef}
            onClick={handleHeaderClick}
            className={`transition-all duration-300 ${isMenuOpen ? "w-[calc(100%-25vw)]" : "w-[100%]"
              }`}
          >
            <Header channelData={channelData} />
          </div>

          <div className="flex w-full h-full">
            <div
              className={`transition-all flex flex-col h-full items-center duration-300 ${isMenuOpen ? "w-[calc(100%-25vw)]" : "w-[100%]"
                }`}
            >
              <div className="w-[728px] h-[calc(100%-20px)]">
                <div className="h-[calc(100%-56px)] overflow-y-auto p-4">
                  {/* тут сообщения */}
                  {messages.map((message) => (
                    <Message message={message} key={message.id} />
                  ))}
                </div>
                <SendMessage />
              </div>
            </div>
          </div>
        </div>

        <RightPanel
          menuRef={menuRef}
          channelData={channelData}
          isMenuOpen={isMenuOpen}
          setMenuOpen={setIsMenuOpen}
        />
      </div>
    );
};

export default Chat;
