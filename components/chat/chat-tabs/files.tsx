import React from "react";
import { mediaFiles, fileList, fileColors } from "../data";
import { MessageType } from "@/types/Message";
import { format } from "date-fns";


const Files = ({ files }: { files: MessageType[] }) => {
  if (!files) return null;

  let globalIndex = 0; // Глобальный счётчик индекса

  return (
    <div className="grid grid-cols-1 gap-1 mt-2 w-full">
      {files.map((message) => {
          const timestamp = format(new Date(message.createdAt), "PPpp");
        return (
          message.files.fileUrls.map((file: any) => {
            const currentIndex = globalIndex++; // Увеличиваем глобальный индекс на каждом шаге
            const iconColor = fileColors[file.originalname.split(".")[file.originalname.split(".").length - 1]] || fileColors.unknown;
            // const timestamp = format(new Date(message.createdAt), "PPpp");
  
  
            return (
              <div
                key={file._id}
                className={`flex items-center justify-between p-2`}
              >
                <div
                  className={`flex items-center ${iconColor} w-[48px] h-[48px] justify-center rounded-[6px]`}
                >
                  <span className="text-white">{file.originalname.split(".")[file.originalname.split(".").length - 1]}</span>
                </div>
                <div className="flex flex-col flex-grow ml-2">
                  <span className="text-white">{file.originalname}</span>
                  <span className="text-[#aaaaaa] text-sm">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • {timestamp}
                  </span>
                </div>
              </div>
            );
          })
        )
      })}
    </div>
  );
};

export default Files;
