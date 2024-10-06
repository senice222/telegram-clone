"use client";
import React, { FC, useEffect, useRef, useState } from "react";
import SendMessage from "./send-message";
import Header from "./header";
import RightPanel from "./right-panel";

interface Props {}

const Chat: FC<Props> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null); 

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
          className={`transition-all duration-300 ${
            isMenuOpen ? "w-[calc(100%-25vw)]" : "w-[100%]"
          }`}
        >
          <Header />
        </div>

        <div className="flex w-full h-full">
          <div
            className={`transition-all flex flex-col h-full items-center duration-300 ${
              isMenuOpen ? "w-[calc(100%-25vw)]" : "w-[100%]"
            }`}
          >
            <div className="w-[728px] h-[calc(100%-20px)]">
              <div className="h-[calc(100%-56px)]"></div>
              <SendMessage />
            </div>
          </div>
        </div>
      </div>

      <RightPanel menuRef={menuRef} isMenuOpen={isMenuOpen} setMenuOpen={setIsMenuOpen}/>
    </div>
  );
};

export default Chat;
