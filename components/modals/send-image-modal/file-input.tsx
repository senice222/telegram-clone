import React from 'react';

interface FileInputProps {
    onFileSelect: (file: File) => void;
    accept: string;
}

export const FileInput: React.FC<FileInputProps> = ({ onFileSelect, accept }) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            onFileSelect(selectedFile);
        }
    };

    return (
        <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            style={{ display: 'none' }}
        />
    );
};
