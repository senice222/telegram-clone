import { auth } from "@clerk/nextjs/server";
import { axiosInstance } from "@/core/axios";

export const currentProfile = async () => {
    const { userId } = auth();
    if (!userId) return null;

    try {
        const {data} = await axiosInstance.get(`/api/user/${userId}`)
        return data
    } catch(e) {
        console.log(e, "cannot get user, [currentProfile]")
    }
};
