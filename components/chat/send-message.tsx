"use client"
import React, { useState } from "react";
import { Smile, Paperclip, SendHorizontal } from "lucide-react";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { Appendix } from "./svgs";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const SendMessage = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePaperclipClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.onchange = handleFileChange;
    fileInput.click();
  };

  
  return (
    <div className="h-[56px] w-full mb-[20px]">
      <div className="w-full h-full flex items-end">
        <div className="w-[95%] h-full bg-[#212121] rounded-tl-[1.25rem] rounded-br-[0] rounded-tr-[1.25rem] rounded-bl-[1.25rem] flex">
          <Popover>
            <PopoverTrigger>
              <div className="h-full cursor-pointer ml-[10px] w-[32px] flex items-center justify-center">
                <Smile color="rgb(170, 170, 170, 0.8)" width={24} />
              </div>
            </PopoverTrigger>
            <PopoverContent side="right" sideOffset={-55} className="bg-transparent border-none shadow-none drop-shadow-none mb-16">
                <Picker data={data} theme="dark" />
            </PopoverContent>
          </Popover>

          <input className="h-full bg-transparent text-[15px] text-white outline-none ml-[7px] w-[90%]" />
          <div className="h-full cursor-pointer ml-[10px] w-[32px] flex items-center justify-center mr-[10px]">
            <Paperclip color="rgb(170, 170, 170, 0.8)" width={24} onClick={handlePaperclipClick} />
            {/* <Paperclip color="rgb(170, 170, 170, 0.8)" width={24} /> */}
          </div>
        </div>
        <Appendix isOwn={true}/>
        <div className="cursor-pointer rounded-full bg-[#212121] w-[56px] h-[56px] p-[10px] ml-[10px] group flex justify-center items-center hover:bg-[#7b71c6] transition">
          <SendHorizontal color="rgb(135, 116, 225)" className="group-hover:stroke-white transition" />
        </div>
      </div>
    </div>
  );
};

export default SendMessage;


/******  0dbc4254-b2b2-44e0-ac2c-7fbca003a593  *******/