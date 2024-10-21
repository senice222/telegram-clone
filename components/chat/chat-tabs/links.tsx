import React from "react";
import { mediaFiles, fileList, fileColors, RightPanelProps } from "../data";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Card, CardBody } from "@nextui-org/react";

const links = [
    "https://stackoverflow.com/questions/65241794/how-can-i-",
    "https://github.com/facebook/react",
    "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    "https://www.npmjs.com/package/axios",
    "https://nextjs.org/docs/api-reference/next/head",
    "https://codepen.io/",
    "https://www.google.com/search?q=react+tutorial",
  ];
const Links = ({links} : {links: MessageType[]}) => {
    const truncateUrl = (url: string, maxLength: number) => {
        if (url.length <= maxLength) return url;
        return url.slice(0, maxLength) + "...";
      };
  return (
    <div className="grid grid-cols-1 gap-2 mt-2 w-full">
      {links.map((link, index) => {
        const domain = new URL(link).hostname.replace("www.", "");
        return (
          <div key={index} className="flex items-center justify-between p-2">
            {/* Иконка с первой буквой */}
            <div className="flex items-center bg-[#2d2d2d] w-[40px] h-[40px] justify-center rounded-full">
              <span className="text-white text-lg">
                {domain.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col flex-grow ml-3">
              {/* Домен без https */}
              <span className="text-white">{domain}</span>
              {/* Полная ссылка с обрезкой */}
              <span className="text-[#aaaaaa] text-sm">
                {truncateUrl(link, 40)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Links;
