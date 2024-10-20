import React, {FC} from "react";
import {ControllerRenderProps} from "react-hook-form";

interface MessageTextFieldI {
    field: ControllerRenderProps<{content: string}, "content">;
    isSubmitting: boolean
}

export const MessageTextField:FC<MessageTextFieldI> = ({ field, isSubmitting }) => (
    <input
        className="h-full bg-transparent text-[15px] text-white outline-none ml-[7px] w-[90%]"
        {...field}
        disabled={isSubmitting}
    />
);
