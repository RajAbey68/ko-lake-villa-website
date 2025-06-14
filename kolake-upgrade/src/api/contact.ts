import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export default function handler(req: Request, res: Response) {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    const filePath = path.resolve('data/contacts.csv');
    const entry = `\n"${name}","${email}","${message.replace(/"/g, '""')}"`;
    fs.appendFileSync(filePath, entry);
    return res.status(200).json({ success: true });
  }
  return res.status(405).end();
}
