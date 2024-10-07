"use client"
import Link from 'next/link';
import React, { Dispatch, FC, SetStateAction } from 'react'
import { motion, useAnimation } from "framer-motion"
import { ChannelType } from '@/types/Channel';
import { useRouter } from 'next/navigation';

interface ChatItemProps {
    data: ChannelType;
    setIsSearching: Dispatch<SetStateAction<boolean>>
}

const ChatItem: FC<ChatItemProps> = ({ data, setIsSearching }) => {
    const controls = useAnimation()
    const router = useRouter()

    const handleClick = () => {
        router.push(`/${data.id}`)
        setIsSearching(false)
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
            className="w-[97%] h-[72px] ml-1 text-white rounded-xl hover:bg-[rgb(44,44,44)] transition cursor-pointer flex items-center"
            onClick={handleClick}
            animate={controls}
        >
            <div className="flex items-center">
                <div className='ml-2'>
                    {data.image && (
                        <img
                            src={`${process.env.NEXT_PUBLIC_SERVER_URL}/api/uploads/${data.image}`}
                            alt="Image"
                            height={40}
                            width={40}
                            className='w-[40px] h-[40px] rounded-full object-cover'
                        />
                    )}
                </div>
                <div className="flex flex-col ml-3">
                    <p className="sender-name font-medium text-[rgb(233,238,244)] mr-1">{data.name}</p>
                    {data.type !== "channel" && <p className="text-[rgb(160,160,160)] text-sm">Фак, все равно не отображается</p>}
                </div>
            </div>
        </motion.div>
    )
}

export default ChatItem