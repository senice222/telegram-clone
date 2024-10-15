import { IncomingForm } from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';
import { axiosInstance } from '@/core/axios';
import { currentProfilePages } from '@/lib/currentProfilePages';
import { NextApiResponseServerIo } from '@/types';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js built-in body parser
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const form = new IncomingForm();

  form.parse(req, async (err: any, fields: any, files: any) => {
    if (err) {
      console.error('Form parsing error:', err);
      return res.status(500).json({ message: 'Error parsing form data' });
    }

    try {
      const { name, description, ownerId, members } = fields;
      const formData = new FormData();

      formData.append('name', name[0] as string);
      formData.append('ownerId', ownerId[0] as string);
      formData.append('description', description[0] || '');
      formData.append('members', members[0])

      const { data } = await axiosInstance.post('/api/group', formData);

      const channelKey = `group.created`;
      res?.socket?.server?.io.emit(channelKey, data);

      return res.status(200).json(data);
    } catch (error) {
      console.error('Request handling error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });
};

export default handler;
