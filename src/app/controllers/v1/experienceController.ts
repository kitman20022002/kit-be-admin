import { RESUME } from '../../database/seed/resume';
import { Request, Response } from 'express';

export const index = (req: Request, res: Response) => {
  const { count = 3 } = req.query;
    
  res.send(RESUME.experience.slice(0, parseInt(count as string)).map(item => {
    return {
      title: item.title,
      period: item.time,
      company: item.company,
      desc: item.desc,
      url: item.url,         
    };
  }));
};