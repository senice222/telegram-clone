import React from 'react'
import { X, AtSign } from "lucide-react";

interface RightPanelProps {
    isMenuOpen: boolean;
    setMenuOpen: (value: boolean) => void;
    menuRef: React.RefObject<HTMLDivElement>;
}

const RightPanel = ({isMenuOpen, setMenuOpen, menuRef}: RightPanelProps) => {
  return (
    <div
        ref={menuRef}
        className={`fixed top-0 h-full overflow-hidden w-[25vw] bg-[#212121] border-l-[1px] border-[#303030] shadow-lg transition-all duration-300 ease-in-out ${
          isMenuOpen ? "right-[0]" : "right-[-25vw]"
        }`}
      >
        {/* {isMenuOpen && (
          <div className="p-4">
            <p>Меню контент</p>
          </div>
        )} */}
        <div className="flex items-center flex-col">
          <div className="h-[56px] w-full flex items-center">
            <div onClick={() => setMenuOpen(false)} className="ml-[10px] flex w-[40px] h-[40px] items-center justify-center rounded-full hover:bg-[#aaaaaa]/[.08] transition-colors duration-200">
              <X color="rgb(170, 170, 170)" />
            </div>
            <h2 className="ml-[25px] text-white text-xl font-medium">
              User Info
            </h2>
          </div>
          <div className="w-[25vw] h-[25vw] flex flex-col justify-end bg-[url('https://i.imgur.com/NSRi1n5.jpg')] bg-cover">
            <div className={`ml-[20px] mb-[10px] transition-opacity duration-300`}>
              <h1 className="text-white whitespace-pre font-medium text-[18px] text-lg leading-5">
                Кодеры PandaStudio
              </h1>
              <p className="text-[#aaaaaa] font-normal text-sm leading-4 mt-[3px]">
                last seen 1m ago
              </p>
            </div>
          </div>
          <div className="flex flex-col w-full items-center">
          <div className="flex w-[95%] cursor-pointer h-[60px] mt-[10px] items-center rounded-2xl hover:bg-[#2c2c2c]">
            <AtSign className="ml-[15px]" color="rgb(170, 170, 170)"/>
            <div className="ml-[30px] ">
              <h3 className="text-white">@sosiso4ki</h3>
              <p className="text-[#aaaaaa] text-sm">username</p>
            </div>
          </div>
          </div>
        </div>
      </div>
  )
}

export default RightPanel