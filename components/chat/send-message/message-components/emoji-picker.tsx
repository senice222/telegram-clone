import React from "react";
import {Smile} from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {ControllerRenderProps} from "react-hook-form";

export const EmojiPicker = ({field}: { field: ControllerRenderProps<{ content: string }, "content"> }) => (
    <Popover>
        <PopoverTrigger>
            <div className="h-full cursor-pointer ml-[10px] w-[32px] flex items-center justify-center">
                <Smile color="rgb(170, 170, 170, 0.8)" width={24}/>
            </div>
        </PopoverTrigger>
        <PopoverContent side="right" sideOffset={-55}
                        className="bg-transparent border-none shadow-none drop-shadow-none mb-16">
            <Picker
                data={data}
                theme="dark"
                onEmojiSelect={(emoji: any) => field.onChange(`${field.value}${emoji.native}`)}
            />
        </PopoverContent>
    </Popover>
);
