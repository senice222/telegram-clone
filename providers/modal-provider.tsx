"use client";
import SendImageModal from "@/components/chat/modals/sendImage.modal";
import CreateChannelModal from "@/components/modals/create-channel-modal";
import CreateGroupModal from "@/components/modals/create-group-modal";
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
        </>
    );
};

export default ModalProvider;
