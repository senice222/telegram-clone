import React from 'react';
import {fileColors} from "@/components/chat/data";

interface Photo {
    file: File;
    url: string;
    name: string;
    size: number;
    type: string;
}

interface PhotoItemProps {
    photo: Photo;
    index: number;
    onDelete: (index: number) => void;
    photos: Photo[];
    globalType: string;
}

const truncateUrl = (url: string, maxLength: number) => {
    return url.length <= maxLength ? url : url.slice(0, maxLength) + '..';
};

export const PhotoItem: React.FC<PhotoItemProps> = ({ photo, index, onDelete, photos, globalType }) => {
    const iconColor = fileColors[photo.type.split('/')[photo.type.split.length - 1]] || fileColors.unknown;

    return (
        <>
            {globalType === "imgs" ? (
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
                  onClick={() => onDelete(index)}
                  className="absolute bottom-2 right-2 p-1 bg-gray-800 rounded-full text-white cursor-pointer"
                >
                  🗑️
                </div>
              </div>
            ) : (
                <div className="flex items-center justify-between p-2">
                    <div className={`flex items-center ${iconColor} w-[48px] h-[48px] justify-center rounded-[6px]`}>
                        <span className="text-white">{truncateUrl(photo.type.split('/')[photo.type.split.length - 1], 4)}</span>
                    </div>
                    <div className="flex flex-col flex-grow ml-2">
                        <span className="text-white">{truncateUrl(photo.name, 30)}</span>
                        <span className="text-[#aaaaaa] text-sm">{(photo.size / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>
                </div>
            )}
            <div onClick={() => onDelete(index)} className="absolute bottom-2 right-2 p-1 bg-gray-800 rounded-full text-white cursor-pointer">
                🗑️
            </div>
        </>
    );
};
