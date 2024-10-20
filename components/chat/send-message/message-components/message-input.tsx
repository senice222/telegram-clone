import React from "react";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import {EmojiPicker} from "@/components/chat/send-message/message-components/emoji-picker";
import {MessageTextField} from "@/components/chat/send-message/message-components/message-text-field";
import {AttachmentPopover} from "@/components/chat/send-message/message-components/attachment-popover";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form";

const formSchema = z.object({
    content: z.string().min(1),
});

interface MessageInputProps {
    form: UseFormReturn<z.infer<typeof formSchema>>;
    handlePaperclipClick: () => void;
    isSubmitting: boolean;
    handleSubmit: any
}

export const MessageInput: React.FC<MessageInputProps> = ({
                                                              form,
                                                              handlePaperclipClick,
                                                              isSubmitting,
                                                              handleSubmit
                                                          }) => {
    return (
        <Form {...form}>
            <form className="w-[100%] h-[100%] flex items-center" onSubmit={form.handleSubmit(handleSubmit)}>
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem className="h-full">
                            <FormControl className="h-full">
                                <div className="w-[100%] h-full bg-[#212121] rounded-tl-[1.25rem] rounded-br-[0] rounded-tr-[1.25rem] rounded-bl-[1.25rem] flex">
                                    <EmojiPicker field={field} />
                                    <MessageTextField field={field} isSubmitting={isSubmitting} />
                                    <div className={"flex items-center mr-2"}>
                                        <AttachmentPopover onPaperclipClick={handlePaperclipClick} />
                                    </div>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
};
