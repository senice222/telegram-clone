"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import SearchInput from "../search-input";
import { Search, EllipsisVertical } from "lucide-react";

const Header = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [isVisible, setIsVisible] = useState(true); 
  const [showContent, setShowContent] = useState(true); 

  const startSearchTransition = () => {
    setIsVisible(false); 
    setTimeout(() => {
      setShowContent(false); 
      setIsSearching(true); 
      setTimeout(() => setIsVisible(true), 10); 
    }, 300); 
  };

  const closeSearch = () => {
    setIsVisible(false); 
    setTimeout(() => {
      setIsSearching(false); 
      setShowContent(true); 
      setTimeout(() => setIsVisible(true), 10); 
    }, 300);
  };

  return (
    <div className="w-full flex justify-between bg-[#212121] h-[56px] items-center">
      <div className={`ml-[25px] flex items-center font-medium transition-all duration-300 ${isSearching ? "w-full" : ""}`}>
        <Image
          className="rounded-full"
          src={"https://i.imgur.com/33leJV4.png"}
          alt="avatar"
          width={40}
          height={40}
        />
        <div
          className={`ml-[10px] transition-opacity duration-300 ${isVisible && showContent ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          style={{ display: showContent ? "block" : "none" }} 
        >
          <h1 className="text-white whitespace-pre font-medium text-[18px] text-lg leading-5">
            Кодеры PandaStudio
          </h1>
          <p className="text-[#aaaaaa] font-normal text-sm leading-4">
            last seen 1m ago
          </p>
        </div>
        {isSearching && (
          <div className={`w-full ml-[20px] mr-[20px] transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <SearchInput closeSearch={closeSearch} />
          </div>
        )}
      </div>
      <div
        className={`flex items-center gap-[4px] mr-[10px] transition-opacity duration-300 ${isVisible && showContent ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ display: showContent ? "flex" : "none" }} 
      >
        <div
          onClick={startSearchTransition}
          className="flex w-[40px] h-[40px] items-center justify-center rounded-full hover:bg-[#aaaaaa]/[.08] transition-colors duration-200"
        >
          <Search color="rgb(170, 170, 170)" />
        </div>
        <div className="flex w-[40px] h-[40px] items-center justify-center rounded-full hover:bg-[#aaaaaa]/[.08] transition-colors duration-200">
          <EllipsisVertical color="rgb(170, 170, 170)" />
        </div>
      </div>
    </div>
  );
};

export default Header;
