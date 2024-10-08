"use client"
import React, { useState } from "react";
import { Smile, Paperclip, SendHorizontal } from "lucide-react";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { Appendix } from "./svgs";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import * as z from 'zod'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { axiosInstance } from "@/core/axios";
import { useRouter } from "next/navigation";
import qs from 'query-string'
import axios from "axios";

const formSchema = z.object({
  content: z.string().min(1),
});

const SendMessage = ({ id }: { id: string }) => {
  const [file, setFile] = useState(null);
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: ""
    }
  })

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePaperclipClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.onchange = handleFileChange;
    fileInput.click();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const body = { ...values, channelId: id }
      await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/socket/channel/messages`, body);
      form.reset()
      router.refresh()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="h-[56px] w-full mb-[20px]" >
      <div className="w-full h-full flex items-end">
        <div className="w-[95%] h-full bg-[#212121] rounded-tl-[1.25rem] rounded-br-[0] rounded-tr-[1.25rem] rounded-bl-[1.25rem] flex">
          <Form {...form} >
            <form className="w-[100%] flex items-center" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="w-[95%] h-full bg-[#212121] rounded-tl-[1.25rem] rounded-br-[0] rounded-tr-[1.25rem] rounded-bl-[1.25rem] flex">
                        <Popover>
                          <PopoverTrigger>
                            <div className="h-full cursor-pointer ml-[10px] w-[32px] flex items-center justify-center">
                              <Smile color="rgb(170, 170, 170, 0.8)" width={24} />
                            </div>
                          </PopoverTrigger>
                          <PopoverContent
                            side="right"
                            sideOffset={-55}
                            className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
                          >
                            <Picker data={data} theme="dark" onSelect={(emo: any) => field.onChange(`${field.value} ${emo.native}`)} />
                          </PopoverContent>
                        </Popover>

                        <input
                          className="h-full bg-transparent text-[15px] text-white outline-none ml-[7px] w-[90%]"
                          {...field} // Это важно, чтобы форма знала об изменении значения
                        />

                        <button className="h-full cursor-pointer ml-[10px] w-[32px] flex items-center justify-center mr-[10px]">
                          <Paperclip
                            color="rgb(170, 170, 170, 0.8)"
                            width={24}
                            onClick={handlePaperclipClick}
                          />
                        </button>
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
          <SendHorizontal color="rgb(135, 116, 225)" className="group-hover:stroke-white transition" />
        </div>
      </div>
    </div>
  );
};

export default SendMessage;


/******  0dbc4254-b2b2-44e0-ac2c-7fbca003a593  *******/