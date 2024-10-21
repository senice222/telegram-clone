import React from "react";
import { mediaFiles, fileList, fileColors, RightPanelProps } from "../data";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Card, CardBody } from "@nextui-org/react";

const Files = ({files} : {files: MessageType[]}) => {
  return (
    <div className="grid grid-cols-1 gap-1 mt-2 w-full">
      {fileList.map((file) => {
        const iconColor = fileColors[file.type] || fileColors.unknown;
        return (
          <div
            key={file.id}
            className={`flex items-center justify-between p-2`}
          >
            <div
              className={`flex items-center ${iconColor} w-[48px] h-[48px] justify-center rounded-[6px]`}
            >
              <span className="text-white">{file.type}</span>
            </div>
            <div className="flex flex-col flex-grow ml-2">
              <span className="text-white">{file.name}</span>
              <span className="text-[#aaaaaa] text-sm">
                {file.size} • {file.date}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Files;
