import React, {useState, useEffect} from "react";
import {Dialog, DialogContent, DialogHeader} from "@/components/ui/dialog";
import {useModal} from "@/hooks/use-modal-hooks";
import axios from "axios";
import {Popover, PopoverContent, PopoverTrigger} from "../../ui/popover";
import {EllipsisVertical} from "lucide-react";
import {PhotoItem} from "@/components/modals/send-image-modal/photo-item";
import {FileInput} from "@/components/modals/send-image-modal/file-input";

interface Photo {
    file: File;
    url: string;
    name: string;
    size: number;
    type: string;
}

const SendImageModal = () => {
    const {isOpen, onClose, type, data} = useModal();
    const isModalOpen = isOpen && type === "sendMessage";
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [typeMsg, setTypeMsg] = useState<string>("imgs");
    const [text, setText] = useState<string>("");

    useEffect(() => {
        if (data?.file && data.file instanceof File) {
            const selectedFile = data.file;
            const url = URL.createObjectURL(selectedFile);
            setPhotos((prevPhotos) => [
                ...prevPhotos,
                {file: selectedFile, url, name: selectedFile.name, size: selectedFile.size, type: selectedFile.type}
            ]);
        }
    }, [data]);

    const handleDeletePhoto = (index: number) => {
        setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
    };

    const handleAddPhotoClick = (file: File) => {
        const url = URL.createObjectURL(file);
        setPhotos((prevPhotos) => [
            ...prevPhotos,
            {file, url, name: file.name, size: file.size, type: file.type}
        ]);
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

            await axios.post(url, formData, {headers: {"Content-Type": "multipart/form-data"}});
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
    
    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent
                className="bg-[#212121] border-none text-black items-start p-0 overflow-auto w-[420px] rounded-[12px]">
                <DialogHeader className="pt-4 px-6">
                    <div className="flex items-center">
                        <h2 className="text-xl w-[120px] text-white">
                            {typeMsg === "files" ? "Send file" : "Send photo"}
                        </h2>
                        <Popover>
                            <PopoverTrigger>
                                <div className="h-full cursor-pointer">
                                    <EllipsisVertical color="white"/>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent
                                side="top"
                                className="mr-[160px] w-[200px] relative z-[100] pointer-events-auto bg-[#212121]/85 backdrop-blur border-0 p-1 rounded-[8px]"
                            >
                                <div
                                    onClick={() => setTypeMsg(typeMsg === "files" ? "imgs" : "files")}
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
                    <div className="max-h-[400px] overflow-auto grid gap-2 h-full">
                        {photos.map((photo, index) => (
                            <PhotoItem key={index} photo={photo} index={index} onDelete={handleDeletePhoto}/>
                        ))}
                    </div>
                    <div className="w-full h-[56px] relative z-20 py-2 mt-1 flex items-center">
                        <FileInput onFileSelect={handleAddPhotoClick} accept={typeMsg === "imgs" ? "image/*" : ""}/>
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Add a caption..."
                            className="h-[56px] text-white text-base px-3 w-[90%] bg-transparent outline-none"
                        />
                        <button onClick={onSubmit} className="bg-[#7b71c6] text-white h-[75%] w-[72px] rounded-[6px]">
                            SEND
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SendImageModal;