const aws = require('aws-sdk');
import { logger } from '../../loaders/logger';
const awsConfig = require('../config/aws');
//TODO: clean up this code to not use duplciate
aws.config.update({
  region: awsConfig.awsRegion,
  accessKeyId: awsConfig.awsAccessKey,
  secretAccessKey: awsConfig.awsSecretKey,
});

function cb(email_err: any, email_data: any): void {
  if (email_err) {
    logger.error('Failed to send to email:' + email_err);
  } else {
    logger.info(`Email Sent Success: ${JSON.stringify(email_data)}`);
  }
}

const emailSenderTemplate = (
  email: string,
  data: any,
  templateName: string,
  callback: (email_err: any, email_data: any) => void,
) => {
  const ses = new aws.SES();

  const destination = {
    ToAddresses: [email],
  };

  let params = {
    Source: 'noreply@meetyoumatch.com',
    Destination: destination,
    Template: templateName,
    TemplateData: JSON.stringify(data),
  };

  ses.sendTemplatedEmail(params, function (email_err: any, email_data: any) {
    if (email_err) {
      callback(email_err, email_data);
    } else {
      callback(null, email_data);
    }
  });
};

const appName = 'MEETYOUMATCH';

export const sendValidateEmail = (
  email: string,
  validationCode: string,
  domain: string,
) => {
  // Create sendEmail params
  const templateData = {
    name: email,
    appName: appName,
    domain,
    url: 'verify',
    token: validationCode,
    color: '#7291F7',
    border: '5px solid #7291F7',
    year: '2022',
    project: 'abc',
  };
  emailSenderTemplate(email, templateData, 'CustomEmailVerify', cb);
};

export const invite = (
  email: string,
  name: string,
  validationCode: string,
  roleType: string,
  projectName: string,
  domain: string,
) => {
  // Create sendEmail params
  const url = validationCode === '' ? 'projects' : 'verify';
  const templateData = {
    name,
    appName: appName,
    domain,
    url,
    color: '#7291F7',
    border: '5px solid #7291F7',
    year: '2022',
    project: projectName,
    token: `token=${validationCode}`,
    roleType: roleType,
  };
  emailSenderTemplate(email, templateData, 'Access', cb);
};

export const sendForgotPasswordEmail = (email: string, name: string, token: string, domain: string) => {
  const templateData = {
    name: name ?? email,
    appName: appName,
    domain,
    url: 'reset-password',
    color: '#7291F7',
    border: '5px solid #7291F7',
    year: '2022',
    project: 'abc',
    token: `token=${token}`,
    time: ' 30 minutes',
  };

  emailSenderTemplate(email, templateData, 'ForgotPassword', cb);
};

export const getDomain = (host: string, originHost: string) => {
  if (originHost.includes('localhost') || originHost.includes('dev.')) {
    return originHost;
  }
  return host;
};
