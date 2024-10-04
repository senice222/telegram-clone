"use client"
import Image from 'next/image';
import Link from 'next/link';
import React, { FC } from 'react'
import { motion, useAnimation } from "framer-motion"

interface ChatItemProps {
    data: any
}

const ChatItem:FC<ChatItemProps> = ({data}) => {
    const controls = useAnimation()

    const handleClick = () => {
        controls.start({
            scale: [1, 1.05, 1],
            transition: {
                duration: 0.3,
                ease: "easeInOut",
            },
        })
    }

    return (
        <motion.div
            className="w-[97%] h-[72px] text-white rounded-xl hover:bg-[rgb(44,44,44)] transition cursor-pointer flex items-center"
            onClick={handleClick}
            animate={controls}
        >
            <Link href={"/123123"} className="flex items-center">
                <div className='ml-1'>
                    <Image className="rounded-[50%]" width={54} height={54} src="https://i.imgur.com/33leJV4.png" alt="/" />
                </div>
                <div className="flex flex-col ml-3">
                    <p className="sender-name font-medium text-[rgb(233,238,244)] mr-1">Panda:</p>
                    <p className="text-[rgb(160,160,160)] text-sm">Фак, все равно не отображается</p>
                </div>
            </Link>
        </motion.div>
    )
}

export default ChatItem