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
    let content, type, conversationId, files;

    if (req.headers["content-type"]?.includes("multipart/form-data")) {
      await runMiddleware(req, res, upload);
      ({ content, type, conversationId } = req.body);
      files = req.files || [];
    } else {
      const body = await parseBody(req);
      ({ content, type, conversationId, files } = body);
      files = files || [];
    }

    const currentProfile = await currentProfilePages(req);

    const url = qs.stringifyUrl({
      url: `/api/conversation/message`,
      query: {
        profileId: currentProfile.id,
        conversationId,
      },
    });

    const formData = new FormData();
    formData.append("content", content);
    formData.append("type", type);
    formData.append("conversationId", conversationId);

    files.forEach((file) => {
      const blob = new Blob([file.buffer], { type: file.mimetype });
      formData.append("fileUrls", blob, file.originalname);
    });
    const { data } = await axiosInstance.patch(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const currentUserId = data.memberId
    const recipientId = data.conversation.memberOneId === currentUserId
      ? data.conversation.memberTwoId
      : data.conversation.memberOneId;

    const conversationKey = `conversation:${data.conversationId}:messages`;
    const memberOneUpdateKey = `user:${data.conversation.memberOneId}:lastMessageUpdate`;
    const memberTwoUpdateKey = `user:${data.conversation.memberTwoId}:lastMessageUpdate`;

    res?.socket?.server?.io.emit(conversationKey, data);
    res?.socket?.server?.io.emit(memberOneUpdateKey, { conversationId: data.conversationId, lastMessage: data.content });
    res?.socket?.server?.io.emit(memberTwoUpdateKey, { conversationId: data.conversationId, lastMessage: data.content });

    return res.status(200).json(data);
  } catch (error) {
    console.error("Ошибка при отправке сообщения:", error);
    return res.status(500).json({ message: "Internal error" });
  }
};

export default handler;