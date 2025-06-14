import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export default function handler(req: Request, res: Response) {
  if (req.method === 'POST') {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }
    const filePath = path.resolve('data/newsletter.csv');
    const entry = `\n"${email}"`;
    fs.appendFileSync(filePath, entry);
    return res.status(200).json({ success: true });
  }
  return res.status(405).end();
}
