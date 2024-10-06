"use client";
import CreateChannelModal from "@/components/modals/create-channel-modal";
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
        </>
    );
};

export default ModalProvider;
