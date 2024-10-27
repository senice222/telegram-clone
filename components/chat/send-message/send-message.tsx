import React, { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-hooks";
import { MessageInput } from "@/components/chat/send-message/message-components/message-input";
import { SendButton } from "@/components/chat/send-message/message-components/send-button";
import { Appendix } from "@/components/chat/svgs";
import { MessageType } from "@/types/Message";
import { User } from "@/types/User";
import { axiosInstance } from "@/core/axios";
import qs from "query-string";

const formSchema = z.object({
  content: z.string().min(1),
});

interface SendMessageProps {
  currentProfile: User
  id: string;
  apiUrl: string;
  profile: User;
  isReplying: MessageType | null;
  setIsReplying: React.Dispatch<React.SetStateAction<MessageType | null>>;
}

const SendMessage: React.FC<SendMessageProps> = ({
  currentProfile,
  id,
  apiUrl,
  isReplying,
  setIsReplying,
  profile,
}) => {
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
      onOpen("sendMessage", {
        profile,
        file: selectedFile,
        id,
        apiUrl,
        defaultType: type,
      });
    }
  };

  const handlePaperclipClick = (type: string) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";

    if (type === "imgs") {
      fileInput.accept = "image/*, video/*";
    } else if (type === "files") {
      fileInput.accept = "";
    }

    fileInput.onchange = (e) => handleFileChange(e, type);
    fileInput.click();
  };
  
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();
      const query: any = {
        profileId: currentProfile.id,
      };

      if (id.startsWith("-1")) {
        query.groupId = id;
      } else if (id.startsWith("-")) {
        query.conversationId = id;
      } else {
        query.channelId = id;
      }
      const url = qs.stringifyUrl({
        url: `/api/${apiUrl}`,
        query
      });
      formData.append("content", values.content);
      formData.append("type", "text");
      formData.append("reply", isReplying?.id || "");

      if (id.startsWith("-1")) {
        formData.append("groupId", id);
      } else if (id.startsWith("-")) {
        formData.append("conversationId", id);
      } else {
        formData.append("channelId", id);
        formData.append("type", "text");
      }

      await axiosInstance.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIsReplying(null);
      form.reset();
      router.refresh();
    } catch (e) {
      console.error("Ошибка при отправке формы:", e);
    }
  };

  return (
    <div className="h-[56px] w-full mb-[20px]">
      <div className="w-full h-full flex items-end">
        <Form {...form}>
          <form
            className="w-[100%] h-[100%] flex items-center"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <MessageInput
              profile={profile}
              isReplying={isReplying}
              setIsReplying={setIsReplying}
              form={form}
              handlePaperclipClick={handlePaperclipClick}
              isSubmitting={form.formState.isSubmitting}
            />
            <Appendix isOwn={true} />
            <SendButton />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SendMessage;
