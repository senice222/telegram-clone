import React, { useState } from "react";
import { File } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-hooks";
import {MessageInput} from "@/components/chat/send-message/message-components/message-input";
import {SendButton} from "@/components/chat/send-message/message-components/send-button";
import {Appendix} from "@/components/chat/svgs";
import { MessageType } from "@/types/Message";
import { User } from "@/types/User";


const formSchema = z.object({
    content: z.string().min(1),
});

const SendMessage: React.FC<{ id: string; apiUrl: string, profile : User, isReplying: MessageType | null, setIsReplying: React.Dispatch<React.SetStateAction<MessageType | null>> }> = ({ id, apiUrl, isReplying, setIsReplying, profile }) => {
    const router = useRouter();
    const { onOpen } = useModal();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { content: "" },
    });

    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: Event, type: string) => {
        const target = event.target as HTMLInputElement;
        const selectedFile = target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            onOpen("sendMessage", { file: selectedFile, id, apiUrl, defaultType: type });
        }
    };

    const handlePaperclipClick = (type: string) => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
      
        if (type === "imgs") {
          fileInput.accept = "image/*"; 
        } else if (type === "files") {
          fileInput.accept = "";
        }
      
        fileInput.onchange = (e) => handleFileChange(e, type);
        fileInput.click();
      };

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/socket/${apiUrl}`;
            const type = "text";
            const body = {
                ...values,
                ...(id.startsWith("-1") && { groupId: id }),
                ...(id.startsWith("-") && { conversationId: id }),
                ...(!id.startsWith("-") && { channelId: id, type }),
            };

            await axios.post(url, body);
            form.reset();
            router.refresh();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="h-[56px] w-full mb-[20px]">
            <div className="w-full h-full flex items-end">
                <MessageInput
                    profile={profile}
                    isReplying={isReplying}
                    setIsReplying={setIsReplying}
                    form={form}
                    handleSubmit={handleSubmit}
                    handlePaperclipClick={handlePaperclipClick}
                    isSubmitting={form.formState.isSubmitting}
                />
                <Appendix isOwn={true} />
                <SendButton />
            </div>
        </div>
    );
};

export default SendMessage;
