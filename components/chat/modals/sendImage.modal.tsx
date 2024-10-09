import React from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/hooks/use-modal-hooks";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Channel name is required.",
  }),
  description: z.string().optional(),
});

const SendImageModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "sendMessage";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = () => {};

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#212121] border-none text-black items-start p-0 overflow-hidden w-[420px] max-h-[500px] rounded-[12px]">
        <DialogHeader className="pt-8 px-6">
          <h2 className="text-xl text-white">Send Photo</h2>
        </DialogHeader>
        <div className="px-2 h-full flex flex-col">
          <img
            className="rounded-[12px] w-full object-cover h-[78%]"
            src="https://i.imgur.com/0anVQsR.jpeg"
            alt=""
          />
          <div className="w-full h-[56px] mt-1 flex items-center">
            <input placeholder="Add a caption..." className="h-[56px] text-white text-base px-3 w-[90%] bg-transparent outline-none" />
            <button className="bg-[#7b71c6] text-white h-[75%] w-[72px] rounded-[6px]">SEND</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendImageModal;
