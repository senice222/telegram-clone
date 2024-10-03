'use client'
import { Camera, X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { motion } from 'framer-motion'

interface InputFileProps {
    file: File | null;
    setFile: Dispatch<SetStateAction<File | null>>;
}

export default function InputFile({file, setFile}: InputFileProps) {

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };
    const handleRemoveFile = () => {
        setFile(null);
    };

    return (
        <div className="relative flex items-center justify-center w-full h-[120px]">
            <input
                id="picture"
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
            />
            <div
                className="flex cursor-pointer items-center justify-center bg-[rgb(135,116,225)] w-[120px] h-[120px] rounded-full overflow-hidden border border-gray-300"
            >
                {file ? (
                    <div>
                        <img
                            src={URL.createObjectURL(file)}
                            alt="Uploaded"
                            className="object-cover w-full h-full rounded-full"
                        />
                        <button
                            onClick={handleRemoveFile}
                            className="absolute top-1 right-1 flex items-center justify-center w-6 h-6 bg-red-600 rounded-full border-2 border-white hover:bg-red-700"
                            aria-label="Remove image"
                        >
                            <X className="w-4 h-4 text-white" />
                        </button>
                    </div>
                ) : (
                    <div className="transform hover:scale-125 transition">
                        <Camera className="w-12 h-12 text-white " />
                    </div>
                )}
            </div>
        </div>
    )
}