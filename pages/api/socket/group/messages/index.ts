// @ts-nocheck
import { axiosInstance } from "@/core/axios";
import { currentProfilePages } from "@/lib/currentProfilePages";
import { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import qs from "query-string";
import { parseBody, runMiddleware, storage } from "@/lib/multer";

export const config = {
  api: {
    bodyParser: false,
  },
};
const upload = multer({ storage }).array("fileUrls", 10);

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    let content, type, groupId, files;

    if (req.headers["content-type"]?.includes("multipart/form-data")) {
      await runMiddleware(req, res, upload);
      ({ content, type, groupId } = req.body);
      files = req.files || [];
    } else {
      const body = await parseBody(req);
      ({ content, type, groupId, files } = body);
      console.log(body)
      files = files || [];
    }

    const currentProfile = await currentProfilePages(req);

    const url = qs.stringifyUrl({
      url: `/api/group/message`,
      query: {
        profileId: currentProfile.id,
        groupId,
      },
    });
    
    const formData = new FormData();
    formData.append("content", content);
    formData.append("type", type);
    formData.append("groupId", groupId);

    files.forEach((file) => {
      const blob = new Blob([file.buffer], { type: file.mimetype });
      formData.append("fileUrls", blob, file.originalname);
    });
    const { data } = await axiosInstance.patch(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const groupKey = `group:${data.groupId}:messages`;
    console.log(groupKey)
    res?.socket?.server?.io.emit(groupKey, data);

    return res.status(200).json(data);
  } catch (error) {
    console.error("Ошибка при отправке сообщения:", error);
    return res.status(500).json({ message: "Internal error" });
  }
};

export default handler;