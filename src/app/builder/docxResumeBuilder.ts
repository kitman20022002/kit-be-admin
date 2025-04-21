/* eslint-disable @typescript-eslint/naming-convention */
import { Document, AlignmentType, BorderStyle, Header, Paragraph, Table, TableCell, TableRow, TextRun, UnderlineType, WidthType } from 'docx';
import { RESUME } from '../database/seed/resume';
import { capitalizeFirstLetter } from '../utils/helper';
import { resumeBuilder } from './resumeBuilder';
import { Packer } from 'docx';

const getFontSize = (size: number) => {
  return size * 2;
};

export class docxResumeBuilder extends resumeBuilder {
  resumeData: any;
   
  constructor() {
    super();
    this.resumeData = [];
  }

  buildHeaderText() {
    return {
      default: new Header({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: RESUME.headerText,
                font: 'Times New Roman',
                size: getFontSize(12),
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ],
      }),
    };
  }
  
  addNameTitle() {
    const res = new Paragraph({
      children: [
        new TextRun({
          text: RESUME.name,
          font: 'Arial',
          size: getFontSize(20), 
          bold: true,
          color: '1C4587',
        }),
      ],
      spacing: {
        before: 720, 
        after: 240, 
      },
    });
    this.resumeData.push(res);
    return this; 
  }
  
  addBasisContact() {
    const res = new Paragraph({
      children: [
        new TextRun({
          text: RESUME.contact,
          font: 'Arial',
          size: getFontSize(10),
          bold: true,
        }),
      ],
    });
    this.resumeData.push(res);
    return this; 
  }
  
  addTitle(title:string)  {
    const res =  new Paragraph({
      children: [
        new TextRun({
          text: title,
          font: 'Arial',
          size: getFontSize(14),
          bold: true,
          underline:{ type:UnderlineType.SINGLE },
        }),
      ],
      spacing: {
        before: 600, 
        after: 240, 
      },
    });
    this.resumeData.push(res);
    return this; 
  }
  
  addEmptyLine()  {
    const res = new Paragraph({});
    this.resumeData.push(res);
    return this; 
  }
  
  buildAvaUponRequest()  {
    return new Paragraph({
      children: [
        new TextRun({
          text: 'Additional information regarding earlier work history and specific project involvements is available upon request',
          font: 'Arial',
          size: getFontSize(12),
          bold: true,
        }),
      ],
      spacing: {
        after: 600, 
      },
    });
  }
  
  addTechSkillsSection() {
    const result = RESUME.techSkills.map(item =>  {
      const items =  Object.keys(item).filter(key => key !== 'title');
      const title = new Paragraph({
        children: [
          new TextRun({
            text: `${item.title}:`,
            font: 'Arial',
            size: getFontSize(11),
            bold: true,
          }),
        ],
      });
      
      const stacks = items.map(key => [
        new Paragraph({
          children: [
            new TextRun({
              text:`- ${capitalizeFirstLetter(key).replace(/_/g, '/') }: `,
              font: 'Arial',
              size: getFontSize(11),
              bold: true,
            }),
            new TextRun({
              text: item[key as keyof typeof item],
              font: 'Arial',
              size: getFontSize(11),
            }),
          ],
        }),
      ]).flatMap(itm => itm);
      
      return [title, ...stacks, new Paragraph({})];
    });

    this.resumeData.push(...result.flatMap(item => item));
    return this; 
  }
  
  addSummaryText() {
    const res = new Paragraph({
      children: [
        new TextRun({
          text: RESUME.summary,
          font: 'Arial',
          size: getFontSize(11),
        }),
      ],
    });
    this.resumeData.push(res);
    return this; 
  }
  
  addExperience(showFull:boolean) {
    const slicedExperience = showFull ? RESUME.experience : RESUME.experience.slice(0, 3);
    const result = slicedExperience.map((item) => {
      const time = new Paragraph({
        children: [
          new TextRun({
            text: item.time,
            font: 'Arial',
            size: getFontSize(11),
          }),
        ],
        spacing: {
          after: 240, 
        },
      });
  
      const company = new Paragraph({
        children: [
          new TextRun({
            text: item.company,
            font: 'Arial',
            size: getFontSize(12),
            bold:true,
          }),
        ],
        spacing: {
          after: 120, 
        },
      });
  
      const empty = new Paragraph({});
  
      const title  = new Paragraph({
        children: [
          new TextRun({
            text: item.title,
            font: 'Arial',
            size: getFontSize(12),
            bold:true,
          }),
        ],
        spacing: {
          after: 240, 
        },
      });
  
      const techStackTitle = new Paragraph({
        children: [
          new TextRun({
            text: 'Tech Stack: ',
            font: 'Arial',
            size: getFontSize(10),
            bold:true,
          }),
        ],
        spacing: {
          after: 120,
        },
      });
    
      const techStackSkills = new Paragraph({
        children: [
          new TextRun({
            text: item.techStack,
            font: 'Times New Roman',
            size: getFontSize(10),
          }),
        ],
        bullet: {
          level: 0,
        },
      });
  
  
      const achTitle = new Paragraph({
        children: [
          new TextRun({
            text: 'Achievement/Responsibilities: ',
            font: 'Arial',
            size: getFontSize(10),
            bold:true,
          }),
        ],
        spacing: {
          after: 120,
        },
      });
  
      const ach = item.ach.map(achItem => new Paragraph({
        children: [
          new TextRun({
            text: achItem,
            font: 'Times New Roman',
            size: getFontSize(10),
          }),
        ],
        bullet: {
          level: 0,
        },
      })).flatMap(itm => itm);
  
      return [time, company, empty, title, techStackTitle, techStackSkills, empty, achTitle, ...ach, empty, empty, empty];
    }).flatMap(item => item);
    const finalResult = showFull ? result : [...result, this.buildAvaUponRequest() ];
    this.resumeData.push(...finalResult);
    return this; 
  }
  
  addEdu() {
    const noBorders = {
      top: {
        size: 0,
        style: BorderStyle.NONE,
      },
      bottom: {
        size: 0,
        style: BorderStyle.NONE,
      },
      left: {
        size: 0,
        style: BorderStyle.NONE,
      },
      right: {
        size: 0,
        style: BorderStyle.NONE,
      },
      start:{
        size: 0,
        style: BorderStyle.NONE,
      },
      end:{
        size: 0,
        style: BorderStyle.NONE,
      },
      insideHorizontal:{
        size: 0,
        style: BorderStyle.NONE,
      },
      insideVertical:{
        size: 0,
        style: BorderStyle.NONE,
      },
    };
  
    const result = RESUME.educ.map(item => {
      return [new Table({
        borders: noBorders,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({
                  children: [new TextRun({
                    text: item.school,
                    font: 'Arial',
                    size: getFontSize(10),
                  })],
                  spacing: {
                    after: 120,
                  },
                  alignment: AlignmentType.LEFT,
                })],
                borders: noBorders,
              }),
              new TableCell({
                children: [new Paragraph({
                  children: [new TextRun({
                    text: item.time,
                    font: 'Arial',
                    size: getFontSize(10),
                  })],
                  spacing: {
                    after: 120,
                  },
                  alignment: AlignmentType.RIGHT,
                })],
                borders: noBorders,
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({
                  children: [new TextRun({
                    text: item.title,
                    font: 'Arial',
                    size: getFontSize(10),
                    bold:true,
                  })],
                  spacing: {
                    after: 120,
                  },
                  alignment: AlignmentType.LEFT,
                })],
                borders: noBorders,
              }),
              new TableCell({
                children: [new Paragraph('')],
                borders: noBorders,
              }),
            ],
          }),
        ],
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
      }), new Paragraph({})]; 
    });
    this.resumeData.push(...result.flatMap(item => item));
    return this; 
  }
  
  addPageBreak() {
    const res = new Paragraph({
      pageBreakBefore: true,
      children: [
        new TextRun({
          text: '',
        }),
      ],
    });
    this.resumeData.push(res);
    return this;
  }

  build() {
    const docxResume = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        headers: this.buildHeaderText(),
        children: this.resumeData,
      }],
    });

    return Packer.toBuffer(docxResume);
  }
}
