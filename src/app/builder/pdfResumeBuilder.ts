/* eslint-disable @typescript-eslint/naming-convention */
import { Content } from 'pdfmake/interfaces';
import { RESUME } from '../database/seed/resume';
import { capitalizeFirstLetter } from '../utils/helper';
import { resumeBuilder } from './resumeBuilder';
import PdfPrinter from 'pdfmake';
import path from 'path';
const fontsPath = path.join(__dirname, '..', 'fonts');
const fonts = {
  PTSerif:{
    normal: path.join(fontsPath, 'PTSerif-Regular.ttf'),
    bold: path.join(fontsPath, 'PTSerif-bold.ttf'),
  },
  Roboto:{
    normal: path.join(fontsPath, 'Roboto-Regular.ttf'),
    bold: path.join(fontsPath, 'Roboto-Bold.ttf'),
  },
};

export class pdfResumeBuilder extends resumeBuilder {
  resumeData: any;

  constructor() {
    super();
    this.resumeData = [];
  }

  buildHeaderText() {
    return {
      text: RESUME.headerText,
      font: 'PTSerif',
      fontSize: 12, 
      alignment: 'center',
      color: '#999999',
      margin: [0, 20, 0, 10], 
    };
  }

  addNameTitle() {
    const res = {
      text: RESUME.name,
      font: 'Roboto',
      fontSize: 20,
      bold: true,
      color: '#1C4587',
      margin: [0, 24, 0, 6],
    };
    this.resumeData.push(res);
    return this;
  }
    
  addBasisContact() {
    const res = {
      text: RESUME.contact,
      font: 'Roboto',
      fontSize: 10, 
      bold: true,
    };
    this.resumeData.push(res);
    return this;
  }
    
  addTitle(title:string) {
    const res = {
      text: title,
      font: 'Roboto',
      fontSize: 14, 
      bold: true,
      decoration: 'underline',
      margin: [0, 30, 0, 12], 
    };
    this.resumeData.push(res);
    return this;
  }

  addEmptyLine() {
    const res = {
      text: '\n', 
    };
    this.resumeData.push(res);
    return this;
  }

  addTechSkillsSection() {
    const result = RESUME.techSkills.map(item => {
      const items = Object.keys(item).filter(key => key !== 'title');
      
      let contentArray:any = [
        {
          text: `${item.title}:`,
          font: 'Roboto',
          fontSize: 11,
          bold: true,
          margin: [0, 0, 0, 0], 
        },
      ];

      items.forEach(key => {
        const itemArray = [{
          text: `- ${capitalizeFirstLetter(key).replace(/_/g, '/')}: `, 
          bold: true,
        },
        {
          text: item[key as keyof typeof item],
          bold: false,   
        }];

        contentArray.push({ 
          text: itemArray,
          font: 'Roboto', 
          fontSize: 11,
          margin: [0, 0, 0, 0], 
        });
      });

      contentArray.push({
        text: '', 
        margin: [0, 5, 0, 5],
        font: '',
        fontSize: 0,
        bold: false,
      });
  
      return contentArray;
    });
  
    this.resumeData.push(...result.flatMap(item => item));
    return this;
  }

  addSummaryText() {
    const res = {
      text: RESUME.summary,
      font: 'Roboto',
      fontSize: 11, 
    };
    this.resumeData.push(res);
    return this;
  }

  buildAvaUponRequest() {
    return {
      text: 'Earlier work history and specific project involvements is available upon request',
      font: 'Roboto',
      fontSize: 12,
      bold: true,
      margin: [0, 0, 0, 0], 
    };
  }
  
  addExperience(showFull:boolean) {
    const slicedExperience = showFull ? RESUME.experience : RESUME.experience.slice(0, 3);
    const result = slicedExperience.map(item => {
      let experienceContent = [
        {
          text: item.time,
          font: 'Roboto',
          fontSize: 11,
          margin: [0, 0, 0, 10],
        },
        {
          text: item.company,
          font: 'Roboto',
          fontSize: 12,
          bold: true,
          margin: [0, 0, 0, 15],
        },
        {
          text: item.title,
          font: 'Roboto',
          fontSize: 12,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        {
          text: 'Tech Stack: ',
          font: 'Roboto',
          fontSize: 10,
          bold: true,
          margin: [0, 0, 0, 5],
        },
        {
          ul : [{ 
            text: item.techStack,
            font: 'PTSerif',
            fontSize: 10,
          }],
          margin: [0, 0, 0, 10],
        },
        {
          text: 'Achievement/Responsibilities: ',
          font: 'Roboto',
          fontSize: 10,
          bold: true,
          margin: [0, 0, 0, 5],
        },
        {
          ul: item.ach.map(achItem => ({ text: achItem, font: 'PTSerif', fontSize: 10 })),
          margin: [0, 0, 0, 10],
        },
        { text: '', margin: [0, 10, 0, 5] },
      ];
  
      return experienceContent;
    }).flatMap(item => item);
  
    const finalResult = result;
    this.resumeData.push(...finalResult);
    if (!showFull) {
      this.resumeData.push(this.buildAvaUponRequest());
    }
    return this;
  }

  addEdu() {
    const result = RESUME.educ.map(item => {
      return [
        {
          table: {
            body: [
              [
                { text: item.school, font: 'Roboto', fontSize: 10, alignment: 'left', border: [false, false, false, false] },
                { text: item.time, font: 'Roboto', fontSize: 10, alignment: 'right', border: [false, false, false, false] },
              ],
              [
                { text: item.title, font: 'Roboto', fontSize: 10, bold: true, alignment: 'left', border: [false, false, false, false], colSpan: 2 },
                {},
              ],
            ],
            widths: ['*', 'auto'], 
          },
          layout: 'noBorders',
        },
        { text: '\n' },
      ];
    });
  
    this.resumeData.push(...result.flatMap(item => item));
    return this;
  }

  addPageBreak() {
    const res = {
      text: '',
      pageBreak: 'after', 
    };
    this.resumeData.push(res);
    return this;
  }

  build(): Promise<Buffer>  {
    return new Promise((resolve, reject) => {
      const docDefinition = {
        pageMargins: [40, 40, 40, 40] as [number, number, number, number], 
        content: this.resumeData,
        header: this.buildHeaderText() as Content,
      };
      const printer = new PdfPrinter(fonts);
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      const chunks: Buffer[] = [];
        
      pdfDoc.on('data', chunk => chunks.push(chunk));
      pdfDoc.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      pdfDoc.on('error', err => {
        reject(err);
      });
      pdfDoc.end();
    });
  }
}