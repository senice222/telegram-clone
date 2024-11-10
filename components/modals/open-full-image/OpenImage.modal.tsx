import React, { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-hooks";
import Video from "next-video";
import { ArrowRight, ArrowLeft } from 'lucide-react';

const OpenImageModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "openImage";
  const { src, categorizedMessages } = data || {};

  // Инициализация mediaUrls с использованием useMemo для кэширования
  const mediaUrls =  categorizedMessages?.media?.flatMap(item => item.files.fileUrls) || []
  

  // Определяем начальный индекс на основе src.filename
  const [currentIndex, setCurrentIndex] = useState(0);

  // Обновляем currentIndex только при изменении src
  useEffect(() => {
    if (src) {
      const newIndex = mediaUrls.findIndex(file => file.filename === src.filename);
      if (newIndex >= 0) {
        setCurrentIndex(newIndex);
      }
    }
  }, [src]);

  // Обработка нажатия стрелки влево
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? mediaUrls.length - 1 : prevIndex - 1
    );
  };

  // Обработка нажатия стрелки вправо
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === mediaUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Получаем текущий файл или null, если mediaUrls пуст
  const currentFile = mediaUrls.length > 0 ? mediaUrls[currentIndex] : null;
  // сделайть чтоб кнопки не прыгали!!!
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] h-[90vh] border-none text-black items-center justify-center p-0 overflow-auto rounded-[12px]">
        <DialogHeader className="pt-4 px-6 flex items-center w-full justify-between h-full flex-row gap-4">
          <ArrowLeft className="cursor-pointer" width={50} color="white" onClick={handlePrev} />
          <div className="w-[80%]">
            {currentFile ? (
              currentFile.filename.endsWith(".mp4") || currentFile.filename.endsWith(".webm") ? (
                <Video
                  className="rounded-[12px] w-full h-full object-cover"
                  src={`${process.env.NEXT_PUBLIC_SERVER_URL}/api/uploads/${currentFile.filename}`}
                  controls
                />
              ) : (
                <img
                  className="w-full h-auto"
                  src={`${process.env.NEXT_PUBLIC_SERVER_URL}/api/uploads/${currentFile.filename}`}
                  alt="media content"
                />
              )
            ) : (
              <p>No media available</p>
            )}
          </div>
          <ArrowRight className="cursor-pointer" width={50} color="white" onClick={handleNext} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default OpenImageModal;
