"use client";
import React, { useEffect, useRef, useCallback } from "react";
import { mediaFiles } from "../data";
import { MessageType } from "@/types/Message";
import { useModal } from "@/hooks/use-modal-hooks";

const Media = ({
  media,
  categorizedMessages,
  fetchNextPage
}: {
  fetchNextPage: () => void;
  media: MessageType[];
  categorizedMessages: {
    media: MessageType[];
    files: MessageType[];
    links: MessageType[];
  };
}) => {
  const { onOpen } = useModal();
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
  }, [handleIntersection, media.length]); // Обновляем наблюдение при изменении длины массива media

  if (!media) return null;

  let globalIndex = 0;
  return (
    <div className="grid grid-cols-3 mt-0 w-full">
      {media.map((message, index) =>
        message.files.fileUrls.map((file: any, fileIndex: number) => {
          const currentIndex = globalIndex++;
          const isVideo = file.filename.split(".").pop() === "mp4";
          const fileSrc = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/uploads/${file.filename}`;

          const isLastElement =
            index === media.length - 1 && fileIndex === message.files.fileUrls.length - 1;

          return (
            <div
              key={file._id}
              ref={isLastElement ? lastElementRef : null}
              className={`relative border-[1px] border-[#212121] shadow-[0_0_1px_0px_#212121] ${
                currentIndex % 3 === 0 ? "border-l-0 border-r-0" : ""
              } ${currentIndex % 3 === 2 ? "border-r-0 border-l-0" : ""} ${
                currentIndex < 3 ? "border-t-0" : ""
              } ${currentIndex >= mediaFiles.length - 3 ? "border-b-0" : ""}`}
            >
              {isVideo ? (
                <div
                  onClick={() =>
                    onOpen("openImage", { src: file, srcType: "video", categorizedMessages })
                  }
                  className="flex items-center justify-center w-full h-[150px] bg-[#363636]"
                >
                  <span className="text-xl text-white cursor-pointer">
                    Video
                  </span>
                  <div className="absolute top-[5px] left-[5px] bg-black/20 text-white text-xs px-1 py-[1px]">
                    {file.duration}
                  </div>
                </div>
              ) : (
                <img
                  onClick={() =>
                    onOpen("openImage", { src: file, srcType: "img", categorizedMessages })
                  }
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
