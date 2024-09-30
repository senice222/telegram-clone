"use client"
import React, { FC, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Pencil, Speaker, Users, MessageCircle } from 'lucide-react';
import { useModal } from '@/hooks/use-modal-hooks';

interface ManageChannelsProps {
    hovered: boolean;
}

const ManageChannels: FC<ManageChannelsProps> = ({ hovered }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false); 
    const {onOpen} = useModal()
    const menuRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setMenuOpen(false);
        }
    };

    useEffect(() => {
        if (menuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen]);

    useEffect(() => {
        setMenuOpen(isHovered); 
    }, [isHovered]);

    return (
        <div className="absolute bottom-4 right-3">
            <motion.div
                onMouseEnter={() => setIsHovered(true)} 
                onMouseLeave={() => setIsHovered(false)} 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: hovered ? 1 : 0, y: hovered ? [100, -10, 0] : 100 }}
                transition={{ duration: 0.3, type: "spring", bounce: 0.3 }} 
            >
                <div
                    className="flex items-center justify-center w-[56px] h-[56px] rounded-full bg-[rgb(135,116,225)] hover:bg-[rgb(123,113,198)] transition shadow-lg cursor-pointer"
                >
                    <Pencil stroke="white" />
                </div>
            </motion.div>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        ref={menuRef}
                        onMouseEnter={() => setIsHovered(true)}  
                        onMouseLeave={() => setIsHovered(false)} 
                        className="absolute bottom-[70px] min-w-[13.5rem] right-0 bg-[rgba(37,37,37,0.87)] backdrop-blur-[10px] text-white rounded-lg shadow-lg p-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}  
                        transition={{ duration: 0.2 }}
                    >
                        <ul className="flex flex-col gap-2">
                            <li className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded-md text-sm cursor-pointer" onClick={() => onOpen("createChannel")}>
                                <Speaker stroke="rgb(170,170,170)" className="w-5 h-5" />
                                New Channel
                            </li>
                            <li className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded-md text-sm cursor-pointer">
                                <Users stroke="rgb(170,170,170)" className="w-5 h-5" />
                                New Group
                            </li>
                            <li className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded-md text-sm cursor-pointer">
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
