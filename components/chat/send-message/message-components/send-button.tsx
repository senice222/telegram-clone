import React from "react";
import { SendHorizontal } from "lucide-react";

export const SendButton = () => (
    <div className="cursor-pointer rounded-full bg-[#212121] w-[56px] h-[56px] p-[10px] ml-[10px] group flex justify-center items-center hover:bg-[#7b71c6] transition">
        <SendHorizontal color="rgb(135, 116, 225)" className="group-hover:stroke-white transition" />
    </div>
);
