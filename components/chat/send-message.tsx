import React, { useState } from "react";
import { Smile, Paperclip, SendHorizontal, Image, File } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { Appendix } from "./svgs";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-hooks";

const formSchema = z.object({
  content: z.string().min(1),
});

export interface attachedFile {
  file: File;
  type: string;
}
const SendMessage = ({ id, apiUrl }: { id: string; apiUrl: string }) => {
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  const { onOpen } = useModal();
  const [message, setMessage] = useState<attachedFile[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });
  const addFile = (file: attachedFile) => {
    setMessage((prevMessages) => [...prevMessages, file]);
  };

  const handlePaperclipClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.onchange = handleFileChange;
    fileInput.click();
  };

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const selectedFile = target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      onOpen("sendMessage", { file: selectedFile, id, apiUrl });
    }
  };

  const onPhotoAttaching = () => {
    handlePaperclipClick();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/socket/${apiUrl}`;
      let type = "text";
      let body;
      if (id.startsWith("-1")) {
        body = { ...values, groupId: id, type };
      } else if (id.startsWith("-")) {
        body = { ...values, conversationId: id };
      } else {
        body = { ...values, channelId: id, type };
      }
      await axios.post(url, body);
      form.reset();
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="h-[56px] w-full mb-[20px]">
        <div className="w-full h-full flex items-end">
          <div className="w-[95%] h-full bg-[#212121] rounded-tl-[1.25rem] rounded-br-[0] rounded-tr-[1.25rem] rounded-bl-[1.25rem] flex">
            <Form {...form}>
              <form
                className="w-[100%] flex items-center"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="h-full">
                      <FormControl className="h-full">
                        <div className="w-[98%] h-full bg-[#212121] rounded-tl-[1.25rem] rounded-br-[0] rounded-tr-[1.25rem] rounded-bl-[1.25rem] flex">
                          <Popover>
                            <PopoverTrigger>
                              <div className="h-full cursor-pointer ml-[10px] w-[32px] flex items-center justify-center">
                                <Smile
                                  color="rgb(170, 170, 170, 0.8)"
                                  width={24}
                                />
                              </div>
                            </PopoverTrigger>
                            <PopoverContent
                              side="right"
                              sideOffset={-55}
                              className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
                            >
                              <Picker
                                data={data}
                                theme="dark"
                                onEmojiSelect={(emoji: any) => {
                                  field.onChange(`${field.value}${emoji.native}`);
                                }}
                              />
                            </PopoverContent>
                          </Popover>

                          <input
                            className="h-full bg-transparent text-[15px] text-white outline-none ml-[7px] w-[90%]"
                            {...field}
                          />

                          <Popover>
                            <PopoverTrigger>
                              <Paperclip
                                color="rgb(170, 170, 170, 0.8)"
                                width={24}
                              />
                            </PopoverTrigger>
                            <PopoverContent
                              side="top"
                              className="mr-[160px] w-[200px] bg-[#212121]/85 backdrop-blur border-0 p-1 rounded-[8px]"
                            >
                              <div
                                onClick={() => onPhotoAttaching()}
                                className="w-full h-[32px] flex items-center hover:bg-[#000000]/40 rounded-[8px] transition cursor-pointer"
                              >
                                <Image
                                  className="ml-2"
                                  color="rgb(170, 170, 170)"
                                  width={19.6}
                                />
                                <h2 className="text-sm text-white ml-4">
                                  Photo or Video
                                </h2>
                              </div>
                              <div className="w-full h-[32px] flex items-center hover:bg-[#000000]/40 rounded-[8px] transition cursor-pointer mt-1">
                                <File
                                  className="ml-2"
                                  color="rgb(170, 170, 170)"
                                  width={19.6}
                                />
                                <h2 className="text-sm text-white ml-4">File</h2>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
          <Appendix isOwn={true} />
          <div className="cursor-pointer rounded-full bg-[#212121] w-[56px] h-[56px] p-[10px] ml-[10px] group flex justify-center items-center hover:bg-[#7b71c6] transition">
            <SendHorizontal
              color="rgb(135, 116, 225)"
              className="group-hover:stroke-white transition"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SendMessage;
