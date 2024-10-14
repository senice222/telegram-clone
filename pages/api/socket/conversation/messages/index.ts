// @ts-nocheck

import { axiosInstance } from "@/core/axios";
import { currentProfilePages } from "@/lib/currentProfilePages";
import { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import qs from "query-string";

const storage = multer.memoryStorage();
const upload = multer({ storage }).array("fileUrls", 10);

export const config = {
  api: {
    bodyParser: false,
  },
};

const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
};

const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (error) {
        reject(error);
      }
    });
  });
};

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

    const conversationKey = `conversation:${data.conversationId}:messages`;
    res?.socket?.server?.io.emit(conversationKey, data);

    return res.status(200).json(data);
  } catch (error) {
    console.error("Ошибка при отправке сообщения:", error);
    return res.status(500).json({ message: "Internal error" });
  }
};

export default handler;