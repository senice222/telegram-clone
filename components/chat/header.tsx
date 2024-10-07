"use client";
import React, { useState, FC } from "react";
import SearchInput from "../search-input";
import { Search, EllipsisVertical } from "lucide-react";
import { ChannelChatProps } from "@/types/Channel";
import qs from "query-string";
import { axiosInstance } from "@/core/axios";
import { useRouter } from "next/navigation";

const Header: FC<ChannelChatProps> = ({ channelData, profile }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showContent, setShowContent] = useState(true);
  const isUserMember = channelData?.members?.some(item => item.profileId === profile.id)
  const router = useRouter()

  const startSearchTransition = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
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

  const handleJoinChannel = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    const url = qs.stringifyUrl({
      url: "/api/channel/join",
      query: {
        profileId: profile.id,
        channelId: channelData.id
      }
    })

    try {
      await axiosInstance.post(url);
      router.refresh();
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="w-full flex justify-between bg-[#212121] h-[56px] items-center">
      <div className={`ml-[25px] flex items-center font-medium transition-all duration-300 ${isSearching ? "w-full" : ""}`}>
        <img
          className="rounded-full w-[40px] h-[40px] object-cover"
          src={`${process.env.NEXT_PUBLIC_SERVER_URL}/api/uploads/${channelData.image}`}
          alt="avatar"
        />
        <div
          className={`ml-[10px] transition-opacity duration-300 ${isVisible && showContent ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          style={{ display: showContent ? "block" : "none" }}
        >
          <h1 className="text-white whitespace-pre font-medium text-[18px] text-lg leading-5">
            {channelData.name}
          </h1>
          <p className="text-[#aaaaaa] font-normal text-sm leading-4">
            {channelData.type !== "channel" && "last seen 1m ago"}
          </p>
        </div>
        {isSearching && (
          <div onClick={(e) => e.stopPropagation()} className={`w-full ml-[20px] mr-[20px] transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <SearchInput placeholder="Search messages" closeSearch={closeSearch} />
          </div>
        )}
      </div>
      <div
        className={`flex items-center gap-[4px] mr-[10px] transition-opacity duration-300 ${isVisible && showContent ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ display: showContent ? "flex" : "none" }}
      >
        {
          !isUserMember && (
            <button
              className='w-[135px] h-[36px] rounded-xl font-medium text-sm text-white bg-[rgb(135,116,225)] mr-2 hover:bg-[rgb(123,113,198)] transition'
              onClick={(e) => handleJoinChannel(e)}
            >
              JOIN CHANNEL
            </button>
          )
        }
        <div
          onClick={(e) => startSearchTransition(e)}
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
