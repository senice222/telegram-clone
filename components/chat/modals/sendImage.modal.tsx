import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-hooks";
import axios from "axios";
import { EllipsisVertical } from "lucide-react";

const SendImageModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "sendMessage";

  const [photos, setPhotos] = useState<File[]>([]);
  const [typeMsg, setTypeMsg] = useState<string>("imgs");
  const [text, setText] = useState<string>("");

  useEffect(() => {
    if (data?.file && data.file instanceof File) {
      setPhotos([data.file]);
    }
  }, [data]);

  const handleDeletePhoto = (index: number) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };

  const onSubmit = async () => {
    try {
      const url = `/api/socket/${data.apiUrl}`;
      const formData = new FormData();
      formData.append("content", text);
      formData.append("type", typeMsg);
      formData.append("conversationId", data?.id);
      formData.append("channelId", data?.id);

      photos.forEach((photo) => {
        formData.append("fileUrls", photo);
      });

      await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Сообщение отправлено успешно");
      handleClose();
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
    }
  };

  const handleClose = () => {
    setPhotos([]);
    onClose();
  };

  const handleAddPhotoClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const selectedFile = target.files?.[0];
      if (selectedFile && selectedFile.type.startsWith("image/")) {
        setPhotos((prevPhotos) => [...prevPhotos, selectedFile]);
      }
    };
    fileInput.click();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#212121] border-none text-black items-start p-0 overflow-auto w-[420px] rounded-[12px]">
        <DialogHeader className="pt-4 px-6">
          <div className='flex items-center'>
            <h2 className="text-xl w-[120px] text-white">Send Photo</h2>
            <div className="h-full cursor-pointer">
              <EllipsisVertical color="white" />
            </div>
          </div>
        </DialogHeader>
        <div className="px-2 h-full flex flex-col">
          <div className="max-h-[400px] overflow-auto grid gap-2 h-full grid-cols-2">
            {photos.map((photo, index) => (
              <div
                key={index}
                className={`relative ${
                  photos.length % 2 !== 0 && index === photos.length - 1
                    ? "col-span-2"
                    : ""
                }`}
              >
                <img
                  className="rounded-[12px] w-full h-full object-cover"
                  src={URL.createObjectURL(photo)}
                  alt={`photo-${index}`}
                />
                <div
                  onClick={() => handleDeletePhoto(index)}
                  className="absolute bottom-2 right-2 p-1 bg-gray-800 rounded-full text-white cursor-pointer"
                >
                  🗑️
                </div>
              </div>
            ))}
          </div>
          <div className="w-full h-[56px] relative z-20 py-2 mt-1 flex items-center">
            <div
              className="h-[42px] text-[16px] cursor-pointer w-[56px] text-white flex items-center justify-center bg-[#7b71c6] rounded-[6px]"
              onClick={handleAddPhotoClick}
            >
              <p>+</p>
            </div>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a caption..."
              className="h-[56px] text-white text-base px-3 w-[90%] bg-transparent outline-none"
            />
            <button
              onClick={onSubmit}
              className="bg-[#7b71c6] text-white h-[75%] w-[72px] rounded-[6px]"
            >
              SEND
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendImageModal;
