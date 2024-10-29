import React from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-hooks";
import Video from "next-video"; 


const OpenImageModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "openImage";
  const { src, srcType } = data;
  
  if (!src) return null;
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] h-[90vh] border-none text-black items-center justify-center p-0 overflow-auto rounded-[12px]">
        <DialogHeader className="pt-4 px-6">
          {srcType === "img" ? (
            <img
              className="w-auto h-auto"
              src={`${process.env.NEXT_PUBLIC_SERVER_URL}/api/uploads/${src.filename}`}
              alt="photo"
            />
          ) : (
            <Video
              className="rounded-[12px] w-full h-full object-cover"
              src={`${process.env.NEXT_PUBLIC_SERVER_URL}/api/uploads/${src.filename}`}
              controls
            />
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default OpenImageModal;
