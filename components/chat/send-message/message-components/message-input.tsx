import React from "react";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { EmojiPicker } from "@/components/chat/send-message/message-components/emoji-picker";
import { MessageTextField } from "@/components/chat/send-message/message-components/message-text-field";
import { AttachmentPopover } from "@/components/chat/send-message/message-components/attachment-popover";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { User } from "@/types/User";
import { Reply, X } from "lucide-react";
import { MessageType } from "@/types/Message";

const formSchema = z.object({
  content: z.string().min(1),
});

interface MessageInputProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  handlePaperclipClick: (type: string) => void;
  isSubmitting: boolean;
  handleSubmit: any;
  profile: User;
  isReplying: MessageType | null;
  setIsReplying: React.Dispatch<React.SetStateAction<MessageType | null>>;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  form,
  handlePaperclipClick,
  isSubmitting,
  handleSubmit,
  isReplying,
  setIsReplying,
}) => {

  return (
    
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="h-full">
              <FormControl className="h-full">
                <div
                  className={`w-[100%] min-h-[100%] relative bg-[#212121] rounded-tl-[1.25rem] transition-all rounded-br-[0] rounded-tr-[1.25rem] rounded-bl-[1.25rem] ${
                    isReplying ? "rounded-tl-[0] rounded-tr-[0]" : ""
                  }`}
                >
                  <div
                    
                    className={`absolute rounded-tl-[1.25rem] flex items-center justify-between rounded-tr-[1.25rem] w-full min-h-[50px] bg-[#212121] mt-0 transition-all opacity-0 pointer-events-none ${
                      isReplying
                        ? "mt-[-50px] opacity-100 pointer-events-auto"
                        : ""
                    }`}
                  >
                    <div className="flex items-center">
                    <Reply color="white" className="mx-3"/>
                    <div
                      className={`mt-2 mb-1 h-[50px] rounded-[10px] relative flex items-center`}
                    >
                      <div
                        style={{ borderRadius: "990px 0 0 990px" }}
                        className="bg-white absolute w-[3px] h-[calc(100%-10px)] mr-2"
                      />
                      <div className="flex flex-col items-start my-2 ml-2">
                        <p className="text-sm text-gray-300">{isReplying && isReplying.ownerProfile?.name}</p>
                        <p className="text-sm text-white">
                          {isReplying && isReplying.content}
                        </p>
                      </div>
                    </div>
                    </div>
                    <div onClick={() => setIsReplying(null)} className="mr-4 cursor-pointer p-2"><X color="white" /></div>
                  </div>
                  <div className="w-full h-full flex">
                    <EmojiPicker field={field} />
                    <MessageTextField
                      field={field}
                      isSubmitting={isSubmitting}
                    />
                    <div className={"flex items-center mr-2"}>
                      <AttachmentPopover
                        onPaperclipClick={handlePaperclipClick}
                      />
                    </div>
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

  );
};
