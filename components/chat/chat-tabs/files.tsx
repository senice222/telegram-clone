import React, { useRef, useEffect, useCallback } from "react";
import { fileColors } from "../data";
import { MessageType } from "@/types/Message";
import { format } from "date-fns";

const Files = ({ files, fetchNextPage }: { files: MessageType[], fetchNextPage: () => void; }) => {
  if (!files) return null;

  let globalIndex = 0;
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
  }, [handleIntersection, files.length]); // Обновляем наблюдение при изменении длины массива files

  return (
    <div className="grid grid-cols-1 gap-1 mt-2 w-full">
      {files.map((message, index) =>
        message.files.fileUrls.map((file: any, fileIndex: number) => {
          const currentIndex = globalIndex++;
          const iconColor = fileColors[file.originalname.split(".").pop()] || fileColors.unknown;
          const timestamp = format(new Date(message.createdAt), "PPpp");

          const isLastElement =
            index === files.length - 1 && fileIndex === message.files.fileUrls.length - 1;

          return (
            <div
              key={file._id}
              ref={isLastElement ? lastElementRef : null}
              className={`flex items-center justify-between p-2`}
            >
              <div
                className={`flex items-center ${iconColor} w-[48px] h-[48px] justify-center rounded-[6px]`}
              >
                <span className="text-white">
                  {file.originalname.split(".").pop()}
                </span>
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
      )}
    </div>
  );
};

export default Files;