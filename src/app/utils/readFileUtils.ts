const fs = require('fs');
const path = require('path');

export const readHtmlFile = (fileName:string) => {
  return fs.readFileSync(path.join(__dirname, '../database/seed/post', fileName), 'utf8');
};