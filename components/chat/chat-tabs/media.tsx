"use client";
import React from "react";
import { mediaFiles } from "../data";
import { MessageType } from "@/types/Message";
import { useModal } from "@/hooks/use-modal-hooks";



const Media = ({ media }: { media: MessageType[] }) => {
  const {onOpen} = useModal()

  if (!media) return null;

  let globalIndex = 0;
  return (
    <div className="grid grid-cols-3 mt-0 w-full">
      {media.map((message) =>
        message.files.fileUrls.map((file: any) => {
          const currentIndex = globalIndex++;
          const isVideo = file.filename.split(".").pop() === "mp4";
          const fileSrc = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/uploads/${file.filename}`;

          return (
            <div
              key={file._id}
              className={`relative border-[1px] border-[#212121] shadow-[0_0_1px_0px_#212121] ${
                currentIndex % 3 === 0 ? "border-l-0 border-r-0" : ""
              } ${currentIndex % 3 === 2 ? "border-r-0 border-l-0" : ""} ${
                currentIndex < 3 ? "border-t-0" : ""
              } ${currentIndex >= mediaFiles.length - 3 ? "border-b-0" : ""}`}
            >
              {isVideo ? (
                <div onClick={() => onOpen("openImage", {src: file, srcType: "video"})} className="flex items-center justify-center w-full h-[150px] bg-[#363636]">
                  <span className="text-xl text-white cursor-pointer">Video</span>
                  <div className="absolute top-[5px] left-[5px] bg-black/20 text-white text-xs px-1 py-[1px]">
                    {file.duration}
                  </div>
                </div>
              ) : (
                <img
                onClick={() => onOpen("openImage", {src: file, srcType: "img"})}
                  src={fileSrc}
                  alt="image"
                  className="w-full h-[150px] object-cover cursor-pointer"
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Media;