// @ts-nocheck
import { axiosInstance } from "@/core/axios";
import { currentProfilePages } from "@/lib/currentProfilePages";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";
import multer from "multer";
import qs from "query-string";

export const config = {
  api: {
    bodyParser: false, 
  },
};

const storage = multer.memoryStorage();
const upload = multer({ storage }).array("fileUrls", 10);

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
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (error) {
        reject(new Error("Invalid JSON body"));
      }
    });
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    let content, type, channelId, files;

    if (req.headers["content-type"]?.includes("multipart/form-data")) {
      await runMiddleware(req, res, upload);
      ({ content, type, channelId } = req.body);
      files = req.files || [];
    } else {
      const body = await parseBody(req);
      ({ content, type, channelId, files } = body);
      files = files || [];
    }

    const currentProfile = await currentProfilePages(req);

    const url = qs.stringifyUrl({
      url: `/api/channel/message`,
      query: {
        profileId: currentProfile.id,
        channelId,
      },
    });

    const formData = new FormData();
    formData.append("content", content);
    formData.append("type", type);
    formData.append("channelId", channelId);

    files.forEach((file) => {
      if (file && file.buffer && file.mimetype && file.originalname) { // ??? условие
        const blob = new Blob([file.buffer], { type: file.mimetype });
        formData.append("fileUrls", blob, file.originalname);
      } else {
        console.warn("Skipping invalid file:", file); // Warning log
      }
    });

    const { data } = await axiosInstance.patch(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const channelKey = `channel:${data.channelId}:messages`;

    res?.socket?.server?.io.emit(channelKey, data);

    return res.status(200).json(data);
  } catch (e) {
    console.error("[MESSAGES POST]", e.message);
    return res.status(500).json({ message: "Internal error", error: e.message });
  }
};

export default handler;
