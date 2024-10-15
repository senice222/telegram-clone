// @ts-nocheck
import { IncomingForm } from 'formidable';
import { NextApiRequest } from 'next';
import { axiosInstance } from '@/core/axios';
import { NextApiResponseServerIo } from '@/types';
import fs from 'fs';
import { Blob } from 'blob-polyfill'
import { parseBody, runMiddleware, storage } from "@/lib/multer";
import multer from "multer";

export const config = {
  api: {
    bodyParser: false,
  },
};
const upload = multer({ storage }).single("image");

const handler = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  try {
    let name, ownerId, members, files;

    if (req.headers["content-type"]?.includes("multipart/form-data")) {
      await runMiddleware(req, res, upload);
      ({ name, ownerId, members } = req.body);
      files = req.file
    } 

    const formData = new FormData();
    formData.append('name', name);
    formData.append('ownerId', ownerId);
    formData.append('members', members);
    formData.append('image', new Blob([files.buffer], { type: files.mimetype }), files.originalname);

    const { data } = await axiosInstance.post('/api/group', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const channelKey = `group.created`;
    res?.socket?.server?.io.emit(channelKey, data);

    return res.status(200).json(data);
  } catch (error) {
    console.error('Request handling error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default handler;
