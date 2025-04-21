/* eslint-disable @typescript-eslint/naming-convention */
import { docxResumeBuilder } from '../builder/docxResumeBuilder';
import { pdfResumeBuilder } from '../builder/pdfResumeBuilder';

export const FILE_TYPE = {
  'PDF': 'pdf',
  'DOCX' : 'docx',
};

type ContentTypeMap = {
  [key in typeof FILE_TYPE[keyof typeof FILE_TYPE]]: {
    contentType: string;
    fileExtension: string;
  };
};


export const CONTENT_TYPE_MAP: ContentTypeMap = {
  [FILE_TYPE.PDF]: {
    contentType: 'application/pdf',
    fileExtension: 'pdf',
  },
  [FILE_TYPE.DOCX]: {
    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileExtension: 'docx',
  },
};

export class ResumeBuilderFactory {
  static createBuilder(type: string) {
    switch (type) {
      case FILE_TYPE.PDF:
        return new pdfResumeBuilder();
      case FILE_TYPE.DOCX:
        return new docxResumeBuilder();
      default:
        return new pdfResumeBuilder();
    }
  }

  static buildSimpleTemplate(builder: pdfResumeBuilder | docxResumeBuilder) {
    return builder
      .addNameTitle()
      .addBasisContact()
      .addTitle('TECHNICAL SKILLS')
      .addTechSkillsSection()
      .addEmptyLine()
      .addTitle('SUMMARY')
      .addSummaryText()
      .addPageBreak()
      .addTitle('PROFESSIONAL EXPERIENCE')
      .addExperience(false)
      .addTitle('PROFESSIONAL QUALIFICATIONS / EDUCATION')
      .addEdu()
      .build();
  }

  static buildDetailedResume(builder: pdfResumeBuilder | docxResumeBuilder) {
    return builder
      .addNameTitle()
      .addBasisContact()
      .addTitle('TECHNICAL SKILLS')
      .addTechSkillsSection()
      .addEmptyLine()
      .addTitle('SUMMARY')
      .addSummaryText()
      .addPageBreak()
      .addTitle('PROFESSIONAL EXPERIENCE')
      .addExperience(true)
      .addTitle('PROFESSIONAL QUALIFICATIONS / EDUCATION')
      .addEdu()
      .build();
  }
}