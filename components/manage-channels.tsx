"use client"
import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Pencil, Speaker, Users, MessageCircle, Cross, X } from 'lucide-react';
import { useModal } from '@/hooks/use-modal-hooks';
import { User } from '@/types/User';

interface ManageChannelsProps {
    hovered: boolean;
    profile: User;
    setIsCreatingGroup: Dispatch<SetStateAction<boolean>>
}

const ManageChannels: FC<ManageChannelsProps> = ({ hovered, profile, setIsCreatingGroup }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { onOpen } = useModal()

    useEffect(() => {
        if (!hovered) {
            setMenuOpen(false);
        }
    }, [hovered])

    return (
        <div className="absolute bottom-4 right-3">
            <AnimatePresence>
                <motion.div
                    onClick={() => setMenuOpen((prev) => !prev)}
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: hovered ? 1 : 0, y: hovered ? [100, -10, 0] : 100 }}
                    exit={{ opacity: 0, y: 100 }}
                    transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                >
                    <div
                        className="flex items-center justify-center w-[56px] h-[56px] rounded-full bg-[rgb(135,116,225)] hover:bg-[rgb(123,113,198)] transition shadow-lg cursor-pointer"
                    >
                        <AnimatePresence mode="wait">
                            {!menuOpen ? (
                                <motion.div
                                    key="pencil"
                                    initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
                                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                    exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                >
                                    <Pencil stroke="white" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="cross"
                                    initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                    exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                >
                                    <X stroke="white" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {(menuOpen && hovered) && (
                    <motion.div
                        className="absolute bottom-[70px] min-w-[13.5rem] right-0 bg-[rgba(37,37,37,0.87)] backdrop-blur-[10px] text-white rounded-lg shadow-lg p-1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ul className="flex flex-col gap-1">
                            <li onClick={() => onOpen("createChannel", { profile })} className="flex rounded-[.375rem] h-[32px] items-center gap-2 font-medium- hover:bg-gray-700 p-2 text-sm cursor-pointer hover:bg-[rgb(0,0,0,0.4)] transition">
                                <Speaker stroke="rgb(170,170,170)" className="w-5 h-5" />
                                New Channel
                            </li>
                            <li onClick={() => setIsCreatingGroup(true)} className="flex rounded-[.375rem] h-[32px] items-center gap-2 font-medium hover:bg-gray-700 p-2 text-sm cursor-pointer hover:bg-[rgb(0,0,0,0.4)] transition">
                                <Users stroke="rgb(170,170,170)" className="w-5 h-5" />
                                New Group
                            </li>
                            <li className="flex rounded-[.375rem] h-[32px] items-center gap-2 font-medium hover:bg-gray-700 p-2 text-sm cursor-pointer hover:bg-[rgb(0,0,0,0.4)] transition">
                                <MessageCircle stroke="rgb(170,170,170)" className="w-5 h-5" />
                                New Message
                            </li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ManageChannels;
