import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-hooks";
import axios from "axios";
import { fileColors } from "../data";
import { EllipsisVertical } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
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
  const [typeMsg, setTypeMsg] = useState<string>("imgs");
  const [text, setText] = useState<string>("");

  useEffect(() => {
    if (data?.file && data.file instanceof File) {
      const selectedFile = data.file;
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
        formData.append("fileUrls", photo.file);
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

    // Условно меняем атрибут accept в зависимости от typeMsg
    if (typeMsg === "imgs") {
      fileInput.accept = "image/*"; // Принимать только изображения
    } else {
      fileInput.accept = ""; // Принимать любые файлы
    }

    fileInput.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const selectedFile = target.files?.[0];
      if (selectedFile) {
        // Создаем URL для изображений
        const url = URL.createObjectURL(selectedFile);

        // Добавляем объект с файлом, его URL, именем, размером и типом в состояние
        setPhotos((prevPhotos) => [
          ...prevPhotos,
          {
            file: selectedFile,
            url: url,
            name: selectedFile.name,
            size: selectedFile.size, // Размер в байтах
            type: selectedFile.type, // Тип файла
          },
        ]);
      }
    };
    fileInput.click();
  };
  const truncateUrl = (url: string, maxLength: number) => {
    if (url.length <= maxLength) return url;
    return url.slice(0, maxLength) + "...";
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
                  onClick={() => {
                    if (typeMsg === "files") {
                      setTypeMsg("imgs");
                    } else {
                      setTypeMsg("files");
                    }
                  }}
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
          {typeMsg === "imgs" ? (
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
                    src={photo.url}
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
          ) : (
            <div className="grid grid-cols-1 gap-1 mt-2 w-full">
              {
                photos.map((file: Photo) => {
                  const iconColor = fileColors[file.type.split('/')[file.type.split.length - 1]] || fileColors.unknown;
                  return (
                    <div
                      key={file.name}
                      className={`flex items-center justify-between p-2`}
                    >
                      <div
                        className={`flex items-center ${iconColor} w-[48px] h-[48px] justify-center rounded-[6px]`}
                      >
                        <span className="text-white">{file.type.split('/')[file.type.split.length - 1]}</span>
                      </div>
                      <div className="flex flex-col flex-grow ml-2">
                        <span className="text-white">{truncateUrl(file.name, 30)}</span>
                        <span className="text-[#aaaaaa] text-sm">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          )}
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
