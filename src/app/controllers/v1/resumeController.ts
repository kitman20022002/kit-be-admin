/* eslint-disable no-secrets/no-secrets */
import { Request, Response } from 'express';
import { FILE_TYPE, ResumeBuilderFactory, CONTENT_TYPE_MAP } from '../../factory/resumeBuilderFactory';

function setResponseHeaders(res:Response, type:string) {
  if (CONTENT_TYPE_MAP[type]) {
    const { contentType, fileExtension } = CONTENT_TYPE_MAP[type];
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename=Kitman_Yiu_Professional_CV.${fileExtension}`);
  } else {
    throw new Error('Invalid type. Use "pdf" or "docx".');
  }
}

export const index = async (req: Request, res: Response) => {
  const { type } = req.params;

  if (!Object.values(FILE_TYPE).includes(type)) {
    res.sendStatus(200);
  }
  
  const resumeFactory = ResumeBuilderFactory.createBuilder(type);
  const result = await ResumeBuilderFactory.buildDetailedResume(resumeFactory);
  setResponseHeaders(res, type);
  res.send(result);
};
