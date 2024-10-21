// @ts-nocheck
'use client';
import React from "react";
import { mediaFiles, fileList, fileColors, RightPanelProps } from "../data";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Card, CardBody } from "@nextui-org/react";
import MessageType from "@/types/Message";

const Media = ({ media }: { media: MessageType[] }) => {
  // console.log(media);
  if (!media) return null;
  return (
    <div className="grid grid-cols-3 mt-0 w-full">
      {media.map((message, index) => (
        message.files.fileUrls.map((file, index) => (
          <div
            key={file._id}
            className={`relative border-[1px] border-[#212121] shadow-[0_0_1px_0px_#212121] ${
              index % 3 === 0 ? "border-l-0 border-r-0" : ""
            } ${index % 3 === 2 ? "border-r-0 border-l-0" : ""} ${
              index < 3 ? "border-t-0" : ""
            } ${index >= mediaFiles.length - 3 ? "border-b-0" : ""}`}
          >
            {file.type === "video" ? (
              <>
                <img
                  src={`${process.env.NEXT_PUBLIC_SERVER_URL}/api/uploads/${file.filename}`}
                  alt="video preview"
                  className="w-full"
                />
                <div className="absolute top-[5px] left-[5px] bg-black/20 text-white text-xs px-1 py-[1px]">
                  {file.duration}
                </div>
              </>
            ) : (
              <>
              <img
                src={`${process.env.NEXT_PUBLIC_SERVER_URL}/api/uploads/${file.filename}`}
                alt="image"
                className="w-full"
              />
              </>
              
            )}
          </div>
        ))
      ))}
    </div>
  );
};

export default Media;
