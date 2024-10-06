import { currentUser, redirectToSignIn } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { axiosInstance } from "@/core/axios";

export const initialProfile = async () => {
    const user = await currentUser();

    if (!user) {
        return redirectToSignIn();
    }

    const {data: profile} = await axiosInstance.get(`/api/user/${user.id}`)

    if (profile) return profile;

    try {
        const {data} = await axiosInstance.post("/api/user/create", user)
        return data
    } catch (e) {
        console.log(e, "error creating user")
    }
};
