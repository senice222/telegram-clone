'use client';
import React from "react";
import { mediaFiles, fileList, fileColors } from "../data";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Card, CardBody } from "@nextui-org/react";
import { MessageType } from "@/types/Message";

const Media = ({ media }: { media: MessageType[] }) => {
  if (!media) return null;

  let globalIndex = 0; 

  return (
    <div className="grid grid-cols-3 mt-0 w-full">
      {media.map((message, messageIndex) => (
        message.files.fileUrls.map((file: any) => {
          const currentIndex = globalIndex++; 

          return (
            <div
              key={file._id}
              className={`relative border-[1px] border-[#212121] shadow-[0_0_1px_0px_#212121] ${
                currentIndex % 3 === 0 ? "border-l-0 border-r-0" : ""
              } ${currentIndex % 3 === 2 ? "border-r-0 border-l-0" : ""} ${
                currentIndex < 3 ? "border-t-0" : ""
              } ${currentIndex >= mediaFiles.length - 3 ? "border-b-0" : ""}`}
            >
              {file.type === "video" ? (
                <>
                  <img
                    src={`${process.env.NEXT_PUBLIC_SERVER_URL}/api/uploads/${file.filename}`}
                    alt="video preview"
                    className="w-full h-[200px] object-cover"
                  />
                  <div className="absolute top-[5px] left-[5px] bg-black/20 text-white text-xs px-1 py-[1px]">
                    {file.duration}
                  </div>
                </>
              ) : (
                <img
                  src={`${process.env.NEXT_PUBLIC_SERVER_URL}/api/uploads/${file.filename}`}
                  alt="image"
                  className="w-full h-[200px] object-cover"
                />
              )}
            </div>
          );
        })
      ))}
    </div>
  );
};

export default Media;
