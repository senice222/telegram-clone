import React from "react";
import {Paperclip, Image, File} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";

export const AttachmentPopover = ({onPaperclipClick}: { onPaperclipClick: (type: string) => void }) => (
    <Popover>
        <PopoverTrigger>
            <Paperclip color="rgb(170, 170, 170, 0.8)" width={24}/>
        </PopoverTrigger>
        <PopoverContent side="top"
                        className="mr-[160px] w-[200px] bg-[#212121]/85 backdrop-blur border-0 p-1 rounded-[8px]">
            <AttachmentOption icon={<Image color="rgb(170, 170, 170)" width={19.6} className="ml-2"/>}
                              text="Photo or Video" onClick={() => onPaperclipClick('imgs')}/>
            <AttachmentOption icon={<File color="rgb(170, 170, 170)" width={19.6} className="ml-2"/>} text="File"
                              onClick={() => onPaperclipClick('files')}/>
        </PopoverContent>
    </Popover>
);

const AttachmentOption = ({icon, text, onClick}: { icon: JSX.Element, text: string, onClick: (type: string) => void }) => (
    <div onClick={onClick}
         className="w-full h-[32px] flex items-center hover:bg-[#000000]/40 rounded-[8px] transition cursor-pointer mt-1">
        {icon}
        <h2 className="text-sm text-white ml-4">{text}</h2>
    </div>
);
