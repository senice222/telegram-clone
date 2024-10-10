"use client"
import Link from 'next/link';
import React, {Dispatch, FC, SetStateAction} from 'react'
import {motion, useAnimation} from "framer-motion"
import {ChannelType} from '@/types/Channel';
import {useRouter} from 'next/navigation';
import {User} from '@/types/User';
import qs from 'query-string'
import {axiosInstance} from "@/core/axios";

type UserWithConversation = User & { hasConversation: boolean };
type ChatData = ChannelType | UserWithConversation;

interface ChatItemProps {
    data: ChatData;
    setIsSearching?: Dispatch<SetStateAction<boolean>>;
    profile: User;
    type: "conversation"
}

const ChatItem: FC<ChatItemProps> = ({type, profile, data, setIsSearching}) => {
    const controls = useAnimation()
    const router = useRouter()
    const isChannel = (data: ChatData): data is ChannelType => data.type === "channel";

    const handleCreateConversation = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        try {
            const url = qs.stringifyUrl({
                url: "/api/create-conversation",
                query: {
                    memberOneId: data.id,
                    memberTwoId: profile.id
                }
            })
            const {data: conversation} = await axiosInstance.post(url)
            router.push(`/conversation/${conversation.id}`)
            router.refresh()
            if (setIsSearching) setIsSearching(false)
        } catch (e) {
            console.log(e, "cannot create conversation")
        }
    }

    const handleClick = () => {
        if (type === "conversation") {
            router.push(`/conversation/${data.id}`)
        } else {
            router.push(`/${data.id}`)
        }
        if (setIsSearching) {
            setIsSearching(false)
        }
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
            <div className="w-[100%] flex items-center justify-between">
                <div className="w-[100%] flex items-center">
                    <div className='ml-2'>
                        <img
                            src={data.type === "channel" ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/uploads/${data.image}` : data.imageUrl}
                            alt="Image"
                            height={40}
                            width={40}
                            className='w-[40px] h-[40px] rounded-full object-cover'
                        />
                    </div>
                    <div className="flex flex-col ml-3">
                        <p className="sender-name font-medium text-[rgb(233,238,244)] mr-1">{data.name}</p>
                        {data.type !== "channel" &&
                            <p className="text-[rgb(160,160,160)] text-sm">Фак, все рав...</p>}
                    </div>
                </div>
                {
                    data.hasConversation === false && (
                        <div>
                            <button
                                className='w-[70px] h-[36px] rounded-xl text-[10px] font-medium text-white bg-[rgb(135,116,225)] mr-2 hover:bg-[rgb(123,113,198)] transition'
                                onClick={(e) => handleCreateConversation(e)}
                            >
                                Start conversation
                            </button>
                        </div>
                    )
                }
            </div>
        </motion.div>
    )
}

export default ChatItem