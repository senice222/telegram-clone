import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-hooks";
import axios from "axios";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { EllipsisVertical } from "lucide-react";
import { PhotoItem } from "@/components/modals/send-image-modal/photo-item";
import { axiosInstance } from "@/core/axios";
import qs from "query-string";

interface Photo {
  file: File;
  url: string;
  name: string;
  size: number;
  type: string;
}

const SendImageModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "sendMessage";
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [typeMsg, setTypeMsg] = useState<string>(data.defaultType ? data.defaultType : "imgs");
  const [text, setText] = useState<string>("");
  const {id, apiUrl, profile} = data

  useEffect(() => {
    if (data?.file && data.file instanceof File) {
      const selectedFile = data.file;
      const url = URL.createObjectURL(selectedFile);
      setPhotos((prevPhotos) => [
        ...prevPhotos,
        {
          file: selectedFile,
          url,
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
        },
      ]);
    }
  }, [data]);

  useEffect(() => {
    setTypeMsg(data.defaultType ? data.defaultType : "imgs");
  }, [data.defaultType])

  const handleDeletePhoto = (index: number) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };

  const handleAddPhotoClick = (file: File) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";

    if (typeMsg === "imgs") {
      fileInput.accept = "image/*, videos/*";
    } else {
      fileInput.accept = "";
    }

    fileInput.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const selectedFile = target.files?.[0];
      if (selectedFile) {
        const url = URL.createObjectURL(selectedFile);
        setPhotos((prevPhotos) => [
          ...prevPhotos,
          {
            file: selectedFile,
            url: url,
            name: selectedFile.name,
            size: selectedFile.size,
            type: selectedFile.type,
          },
        ]);
      }
    };
    fileInput.click();
  };

  const onSubmit = async () => {
    try {
      if (id && profile) {
        const query: any = {
          profileId: profile.id,
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
        const formData = new FormData();
        formData.append("content", text);
        formData.append("type", typeMsg);
        formData.append("conversationId", id);
        formData.append("channelId", id);
  
        photos.forEach((photo) => {
          formData.append("fileUrls", photo.file);
        });
  
        await axiosInstance.post(url, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        handleClose();
      }
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
    }
  };

  const handleClose = () => {
    setPhotos([]);
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#212121] border-none text-black items-start p-0 overflow-auto w-[420px] rounded-[12px]">
        <DialogHeader className="pt-4 px-6">
          <div className="flex items-center">
            <h2 className="text-xl w-[120px] text-white">
              {typeMsg === "files" ? "Send file" : "Send photo"}
            </h2>
            <Popover>
              <PopoverTrigger>
                <div className="h-full cursor-pointer">
                  <EllipsisVertical color="white" />
                </div>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                className="mr-[160px] w-[200px] relative z-[100] pointer-events-auto bg-[#212121]/85 backdrop-blur border-0 p-1 rounded-[8px]"
              >
                <div
                  onClick={() =>
                    setTypeMsg(typeMsg === "files" ? "imgs" : "files")
                  }
                  className="w-full h-[32px] flex items-center hover:bg-[#000000]/40 rounded-[8px] transition cursor-pointer"
                >
                  <h2 className="text-sm text-white ml-4">
                    {typeMsg === "files" ? "Send as photo" : "Send as file"}
                  </h2>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </DialogHeader>
        <div className="px-2 h-full flex flex-col">
          <div className={`max-h-[400px] overflow-auto ${typeMsg === "imgs" ? "grid gap-2 h-full grid-cols-2" : "flex flex-col"}`}>
            {photos.map((photo, index) => (
              <PhotoItem
                key={index}
                photo={photo}
                index={index}
                photos={photos}
                onDelete={handleDeletePhoto}
                globalType={typeMsg}
              />
            ))}
          </div>
          <div className="w-full h-[56px] relative z-20 py-2 mt-1 flex items-center">
            {/* <FileInput onFileSelect={handleAddPhotoClick} accept={typeMsg === "imgs" ? "image/*" : ""}/> */}
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
