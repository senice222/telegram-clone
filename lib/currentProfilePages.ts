import { axiosInstance } from "@/core/axios";
import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest } from "next";

export const currentProfilePages = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);

  if (!userId) return null;

  const { data: profile } = await axiosInstance.get(`/api/user/${userId}`)

  if (profile) return profile;

  return profile;
};