import React, { FC, useState, useRef, useEffect } from "react";
import { Appendix } from "../svgs";
import Video from "next-video";
import { MessageType } from "@/types/Message";
import { ChatData } from "@/types/Channel";
import { User } from "@/types/User";
import { isConversation, isGroup } from "@/lib/utils";
import { fileColors } from "../data";
import { Member } from "@/types/Group";
import { format } from "date-fns";
import { Copy, Download, Pencil, Reply, Trash2, Check, X, CheckCheck } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";
import { useMessageReadSocket } from "@/hooks/use-message-read-socket";
import { useModal } from "@/hooks/use-modal-hooks";

interface MessageProps {
  message: MessageType;
  channel: ChatData;
  profile: User;
  setIsReplying: React.Dispatch<React.SetStateAction<MessageType | null>>;
  queryKey: string
}

const Message: FC<MessageProps> = ({
  message,
  channel,
  profile,
  setIsReplying,
  queryKey
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState<string>(message.content);
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const {onOpen} = useModal()
  const isOwn = message.memberId === profile.id;
  const readKey = `message:${message.id}:read`
  useMessageReadSocket({ queryKey, readKey })

  const otherUser: User | undefined = isConversation(channel)
    ? profile?.id === channel?.memberOne?.id
      ? channel?.memberTwo
      : channel?.memberOne
    : isGroup(channel)
      ? channel?.members?.find(
        (member: Member) => member?.profile?.id !== profile?.id
      )?.profile
      : undefined;

  const truncateUrl = (url: string, maxLength: number) => {
    if (url?.length <= maxLength) return url;
    return url?.slice(0, maxLength) + "...";
  };

  const imgsOrVideos = (message: MessageType) => {
    return message.files?.fileUrls?.map((photo: any, index: number) => {
      const videoRef = useRef<HTMLVideoElement>(null);
      const [isMuted, setIsMuted] = useState(true);
      const [duration, setDuration] = useState("00:00");
      const [currentTime, setCurrentTime] = useState("00:00");

      useEffect(() => {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                videoRef.current?.play();
              } else {
                videoRef.current?.pause();
              }
            });
          },
          { threshold: 0.5 }
        );

        if (videoRef.current) {
          observer.observe(videoRef.current);
          videoRef.current.onloadedmetadata = () => {
            setDuration(formatTime(videoRef.current?.duration || 0));
          };
          videoRef.current.ontimeupdate = () => {
            setCurrentTime(formatTime(videoRef.current?.currentTime || 0));
          };
        }

        return () => {
          if (videoRef.current) {
            observer.unobserve(videoRef.current);
          }
        };
      }, []);

      const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`;
      };

      const toggleMute = () => {
        if (videoRef.current) {
          videoRef.current.muted = !videoRef.current.muted;
          setIsMuted(videoRef.current.muted);
        }
      };

      if (
        photo.filename.split(".")[photo.filename.split(".").length - 1] ===
        "mp4"
      ) {
        return (
          <div
            key={index}
            onClick={() => onOpen("openImage", {src: photo, srcType: "video"})}
            className={`relative mt-2 ${message.files.fileUrls.length % 2 !== 0 &&
              index === message.files.fileUrls.length - 1
              ? "col-span-2"
              : ""
              }`}
          >
            <video
              ref={videoRef}
              className="w-full h-full rounded-[12px] object-cover"
              controls={false}
              loop
              muted={true}
              src={`${process.env.NEXT_PUBLIC_SERVER_URL}/api/uploads/${photo.filename}`}
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
              {currentTime} / {duration}
            </div>
            <div
              className="absolute top-2 right-2 bg-black bg-opacity-50 p-1 rounded cursor-pointer"
              onClick={toggleMute}
            >
              {isMuted ? ":mute:" : ":loud_sound:"}
            </div>
          </div>
        );
      }
      return (
        <div
          onClick={() => onOpen("openImage", {src: photo, srcType: "img"})}
          key={index}
          className={`relative mt-2 ${message.files.fileUrls.length % 2 !== 0 &&
            index === message.files.fileUrls.length - 1
            ? "col-span-2"
            : ""
            }`}
        >
          <img
            className="rounded-[12px] max-h-[500px] w-full h-full object-cover"
            src={`${process.env.NEXT_PUBLIC_SERVER_URL}/api/uploads/${photo.filename}`}
            alt={`photo-${index}`}
          />
        </div>
      );
    });
  };

  const timestamp = format(new Date(message.createdAt), "PPpp");

  const handleReply = () => {
    setIsReplying(message);
    setPopoverOpen(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setPopoverOpen(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setPopoverOpen(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/socket/conversation/messages/${message.id}`
      );
      setPopoverOpen(false);
    } catch (e) {
      console.log("error editing message", e);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewMessage(message.content);
  };

  const handleSave = async () => {
    setIsEditing(false);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/socket/conversation/messages/${message.id}`,
        {
          content: newMessage,
          owner: message.memberId,
        }
      );
    } catch (e) {
      console.log("error editing message", e);
    }
  };
  // console.log(message.readBy);
  
  return (
    <div
      key={message.id}
      className={`flex items-center mb-4 ${isOwn ? "justify-end" : "justify-start"
        }`}
    >
      {!isOwn && otherUser?.imageUrl && (
        <img
          src={otherUser.imageUrl}
          alt="Other user's avatar"
          className="w-10 h-10 rounded-full mr-4"
        />
      )}

      {!isEditing ? (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger>
            <div
              style={
                isOwn
                  ? { borderRadius: "20px 10px 0px 20px" }
                  : { borderRadius: "10px 20px 20px 0px" }
              }
              className={`relative min-h-[32px] flex flex-col justify-center px-2 max-w-[25rem] ${isOwn ? "bg-[#766ac8] text-black" : "bg-[#212121] text-white"}`}
            >
              {message.replyToMessage && (
                <div
                  className={`mt-2 mb-1 min-h-[40px] rounded-[10px] relative flex items-center ${isOwn ? "bg-[#5d4fa7]" : "bg-[#353535]"
                    }`}
                >
                  <div style={{ borderRadius: "990px 0 0 990px" }} className="bg-white absolute w-[3px] h-[54px] mr-2" />
                  <div className="flex flex-col items-start my-2 ml-2">
                    <p className="text-sm text-gray-300">{message.replyToMessage.ownerProfile.name}</p>
                    <p className="text-sm text-white">{message.replyToMessage.content}</p>
                  </div>
                </div>
              )}
              <div
                className={`overflow-auto ${message.files?.type === "imgs"
                  ? "grid gap-2 h-full grid-cols-2"
                  : "flex flex-col"
                  }`}
              >
                {message.files?.type === "imgs"
                  ? imgsOrVideos(message)
                  : message.files?.fileUrls.map((file: any) => {
                    const iconColor =
                      fileColors[
                      file.mimetype?.split("/")[1]
                      ] || fileColors.unknown;
                    return (
                      <div
                        key={file.originalname}
                        className="flex items-center justify-between p-2 w-full"
                      >
                        <div className="flex items-center relative">
                          <div
                            className={`flex items-center ${iconColor} min-w-[48px] h-[48px] justify-center rounded-[6px] relative group`}
                          >
                            <span className="text-white">
                              {file.mimetype?.split("/")[1]}
                            </span>
                            <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <a
                                href={file.url}
                                download={file.originalname}
                                className="text-white"
                              >
                                <Download />
                              </a>
                            </div>
                          </div>
                          <div className="flex flex-col flex-grow ml-2">
                            <span className="text-white">
                              {truncateUrl(file.originalname, 20)}
                            </span>
                            <span className="text-[#aaaaaa] text-sm">
                              {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="flex w-full min-h-[32px] mt-1 items-center justify-end">
                <p className="text-[16px] text-white text-left break-all">
                  {message.content}
                </p>
                <div className="text-right text-xs mt-3 ml-[6px] mr-1 text-gray-400">
                  {timestamp}
                </div>
                {isOwn && (
                  <span className="read-status ml-2">
                    {message.conversationId ? (
                      message.isRead ? (
                        <CheckCheck className="text-gray-400" />
                      ) : (
                        <Check className="text-gray-400" />
                      )
                    ) : (
                      message.readBy?.some((user: User) => user.id === profile.id) ? (
                        <CheckCheck className="text-gray-400" />
                      ) : (
                        <Check className="text-gray-400" />
                      )
                    )}
                  </span>
                )}
              </div>
              <Appendix
                isOwn={!isOwn}
                classNames={`absolute ${!isOwn
                  ? "left-[-9px] scale-x-[-1] scale-y-100 top-[74%] transform -translate-y-1/2"
                  : "right-[-9px] top-[calc(100%-9px)] transform -translate-y-1/2"
                  }`}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="bg-[rgb(33,33,33)] w-[190px] border-0 p-1 rounded-[8px] text-white">
            <div className="flex flex-col space-y-2">
              <button
                className="flex items-center gap-2 hover:bg-[rgb(0,0,0,0.4)] px-2 py-1 text-[.875rem] font-medium rounded-[0.375rem]"
                onClick={handleReply}
              >
                <Reply width={20} color="rgb(170,170,170)" />
                Reply
              </button>
              <button
                className="flex items-center gap-2 hover:bg-[rgb(0,0,0,0.4)] px-2 py-1 text-[.875rem] font-medium rounded-[0.375rem]"
                onClick={handleCopy}
              >
                <Copy width={20} color="rgb(170,170,170)" />
                Copy text
              </button>
              {isOwn && (
                <>
                  <button
                    className="flex items-center gap-2 hover:bg-[rgb(0,0,0,0.4)] px-2 py-1 text-[.875rem] font-medium rounded-[0.375rem]"
                    onClick={handleEdit}
                  >
                    <Pencil width={20} color="rgb(170,170,170)" />
                    Edit
                  </button>
                  <button
                    className="flex items-center gap-2 hover:bg-[rgb(0,0,0,0.4)] px-2 py-1 text-[.875rem] font-medium rounded-[0.375rem]"
                    onClick={handleDelete}
                  >
                    <Trash2 width={20} color="rgb(170,170,170)" />
                    Delete
                  </button>
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <div className="flex flex-col justify-center px-2 max-w-xs bg-[#766ac8] text-black rounded-tl-[1.25rem] rounded-br-[0] rounded-tr-[1.25rem] rounded-bl-[1.25rem]">
          <textarea
            className="w-full resize-none p-2 bg-transparent text-white outline-none"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <div className="flex justify-end mt-1">
            <button onClick={handleSave}>
              <Check size={20} color="white" />
            </button>
            <button onClick={handleCancel} className="ml-2">
              <X size={20} color="white" />
            </button>
          </div>
        </div>
      )}
      {isOwn && (
        <img
          src={profile.imageUrl}
          alt="Current user's avatar"
          className="w-10 h-10 rounded-full ml-4"
        />
      )}
    </div>
  );
};

export default Message;