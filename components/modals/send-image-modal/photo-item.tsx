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
}

const truncateUrl = (url: string, maxLength: number) => {
    return url.length <= maxLength ? url : url.slice(0, maxLength) + '...';
};

export const PhotoItem: React.FC<PhotoItemProps> = ({ photo, index, onDelete }) => {
    const iconColor = fileColors[photo.type.split('/')[photo.type.split.length - 1]] || fileColors.unknown;

    return (
        <div className="relative mt-2" key={index}>
            {photo.type.startsWith('image/') ? (
                <img className="rounded-[12px] w-full h-full object-cover" src={photo.url} alt={`photo-${index}`} />
            ) : (
                <div className="flex items-center justify-between p-2">
                    <div className={`flex items-center ${iconColor} w-[48px] h-[48px] justify-center rounded-[6px]`}>
                        <span className="text-white">{photo.type.split('/')[photo.type.split.length - 1]}</span>
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
        </div>
    );
};
