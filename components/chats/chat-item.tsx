import React, { Dispatch, FC, SetStateAction } from 'react'
import { motion, useAnimation } from "framer-motion"
import { ChatData } from '@/types/Channel';
import { useRouter } from 'next/navigation';
import { User } from '@/types/User';
import qs from 'query-string'
import { axiosInstance } from "@/core/axios";
import { isChannel, isConversation, isGroup } from '@/lib/utils';

interface ChatItemProps {
    data: ChatData
    setIsSearching?: Dispatch<SetStateAction<boolean>>
    profile: User
}

const ChatItem: FC<ChatItemProps> = ({ profile, data, setIsSearching }) => {
    const controls = useAnimation()
    const router = useRouter()

    const otherUser: User | undefined = isConversation(data)
        ? (profile.id === data.memberOne?.id ? data.memberTwo : data.memberOne)
        : data.type === 'user'
            ? data as User
            : undefined

    const handleCreateConversation = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        if (!isChannel(data) && data.type === 'user') {
            try {
                const url = qs.stringifyUrl({
                    url: "/api/create-conversation",
                    query: {
                        memberOneId: data.id,
                        memberTwoId: profile.id,
                    },
                })
                const { data: conversation } = await axiosInstance.post(url)
                router.push(`/conversation/${conversation.id}`)
                router.refresh()
                if (setIsSearching) setIsSearching(false)
            } catch (e) {
                console.log(e, "cannot create conversation")
            }
        }
    }

    const handleClick = () => {
        if (data.type === 'user') {
            router.push(`/profile/${data.id}`); // Redirect to the user's profile
        } else {
            router.push(data.id);
        }

        if (setIsSearching) setIsSearching(false);

        controls.start({
            scale: [1, 1.05, 1],
            transition: {
                duration: 0.3,
                ease: "easeInOut",
            },
        });
    }
   
    return (
        <motion.div
            onClick={handleClick}
            animate={controls}
            className="w-[97%] h-[72px] ml-1 text-white rounded-xl hover:bg-[rgb(44,44,44)] transition cursor-pointer flex items-center"
        >
            <div className="w-[100%] flex items-center justify-between">
                <div className="w-[100%] flex items-center">
                    <div className='ml-2'>
                        <img
                            src={
                                isChannel(data) || isGroup(data)
                                    ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/uploads/${data.image}`
                                    : otherUser?.imageUrl
                            }
                            alt="Avatar"
                            height={40}
                            width={40}
                            className='w-[40px] h-[40px] rounded-full object-cover'
                        />
                    </div>
                    <div className="flex flex-col ml-3">
                        <p className="sender-name font-medium text-[rgb(233,238,244)] mr-1">
                            {isChannel(data) || isGroup(data) ? data?.name : otherUser?.name || ''}
                        </p>
                        {!isChannel(data) && (
                            <p className="text-[rgb(160,160,160)] text-sm">{data?.lastMessage ? data?.lastMessage : 'No messages yet'}</p>
                        )}
                    </div>
                </div>
                {
                    !isChannel(data) && data?.hasConversation === false && (
                        <button

                            onClick={(e) => handleCreateConversation(e)}
                            className='w-[70px] h-[36px] rounded-xl text-[10px] font-medium text-white bg-[rgb(135,116,225)] mr-2 hover:bg-[rgb(123,113,198)] transition'
                        >
                            Start conversation
                        </button>
                    )
                }
            </div>
        </motion.div>
    )
}

export default ChatItem;
