"use client";
import SendImageModal from "@/components/modals/send-image-modal/send-image-modal";
import CreateChannelModal from "@/components/modals/create-channel-modal";
import CreateGroupModal from "@/components/modals/create-group-modal";
import OpenImageModal from "@/components/modals/open-full-image/OpenImage.modal";
import { User } from "@/types/User";
import { FC, useEffect, useState } from "react";


const ModalProvider = () => {
	const [isMounted, setIsMounted] = useState<boolean>(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	if (!isMounted) return null

    return (
        <>
            <CreateChannelModal />
            <CreateGroupModal />
            <SendImageModal />
            <OpenImageModal />
        </>
    );
};

export default ModalProvider;
