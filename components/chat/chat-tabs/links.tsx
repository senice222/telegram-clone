import React, { useRef, useEffect, useCallback } from "react";
import { MessageType } from "@/types/Message";

const linkRegex = /(https?:\/\/[^\s]+)/g;

const Links = ({ links, fetchNextPage }: { links: MessageType[], fetchNextPage: () => void; }) => {
  const lastElementRef = useRef<HTMLDivElement | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    },
    [fetchNextPage]
  );

  useEffect(() => {
    if (lastElementRef.current) {
      const observer = new IntersectionObserver(handleIntersection, {
        root: null,
        threshold: 0.1
      });

      observer.observe(lastElementRef.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [handleIntersection, links.length]); // Обновляем наблюдение при изменении длины массива links

  const truncateUrl = (url: string, maxLength: number) => {
    if (url.length <= maxLength) return url;
    return url.slice(0, maxLength) + "...";
  };

  if (!links) return null;

  return (
    <div className="grid grid-cols-1 gap-2 mt-2 w-full">
      {links.map((message, messageIndex) => {
        const matchedLinks = message.content.match(linkRegex);

        return matchedLinks
          ? matchedLinks.map((link, index) => {
              const domain = new URL(link).hostname.replace("www.", "");
              const isLastElement =
                messageIndex === links.length - 1 && index === matchedLinks.length - 1;

              return (
                <div
                  key={messageIndex + "-" + index}
                  ref={isLastElement ? lastElementRef : null} // Устанавливаем реф на последний элемент
                  className="flex items-center justify-between p-2"
                >
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