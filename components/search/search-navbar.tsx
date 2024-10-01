import React from 'react'
import { motion } from "framer-motion";
import ChatItem from '../chats/chat-item';

const SearchNavbar = () => {
    return (
        <motion.div
            className="flex flex-col h-full text-primary w-full bg-[rgb(33,33,33)] relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
        >
            <div className='ml-1 p-1'>
                <ChatItem />
            </div>
            <div className='ml-1 p-1'>
                <ChatItem />
            </div>
        </motion.div>
    )
}

export default SearchNavbar