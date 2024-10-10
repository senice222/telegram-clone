import React from 'react'
import {axiosInstance} from '@/core/axios';
import {currentProfile} from '@/lib/currentProfile';
import DirectChat from "@/components/direct/direct-chat";
import qs from 'query-string'

interface ChanelIdParams {
    params: {
        userId: string
    }
}

const Page = async ({params}: ChanelIdParams) => {
    const {userId} = params
    const currentUser = await currentProfile()

    if (!userId) {
        return null
    }
    const url = qs.stringifyUrl({
        url: "/api/get-conversation",
        query: {
            memberOneId: userId,
            memberTwoId: currentUser.id
        }
    })
    const {data} = await axiosInstance.get(url)
    if (!data) return null
    console.log(data)

    return (
        <div>
            <DirectChat conversation={data} profile={currentUser}/>
        </div>
    )
}

export default Page