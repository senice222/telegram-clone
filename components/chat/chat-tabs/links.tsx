import React from "react";
import { MessageType } from "@/types/Message";

// Пример регулярного выражения для поиска ссылок
const linkRegex = /(https?:\/\/[^\s]+)/g;

const Links = ({ links }: { links: MessageType[] }) => {
  const truncateUrl = (url: string, maxLength: number) => {
    if (url.length <= maxLength) return url;
    return url.slice(0, maxLength) + "...";
  };
  if (!links) return null;
  return (
    <div className="grid grid-cols-1 gap-2 mt-2 w-full">
      {links.map((message, messageIndex) => {
        // Ищем ссылки в content
        const matchedLinks = message.content.match(linkRegex);
        
        // Если ссылки найдены, то отображаем их
        return matchedLinks
          ? matchedLinks.map((link, index) => {
              const domain = new URL(link).hostname.replace("www.", "");
              return (
                <div key={messageIndex + "-" + index} className="flex items-center justify-between p-2">
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
            })
          : null;
      })}
    </div>
  );
};

export default Links;
