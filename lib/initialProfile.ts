import { currentUser, redirectToSignIn } from "@clerk/nextjs/server";
import { axiosInstance } from "@/core/axios";

export const initialProfile = async () => {
    const user = await currentUser();

    if (!user) {
        return redirectToSignIn();
    }

    const { data: profile } = await axiosInstance.get(`/api/user/${user.id}`)
    
    if (profile) return profile;

    try {
        const userBody = {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress,
        }
        const { data } = await axiosInstance.post("/api/user/create", {userBody})
        return data
    } catch (e) {
        console.log(e, "error creating user")
    }
};
