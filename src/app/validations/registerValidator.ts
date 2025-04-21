import {  body } from 'express-validator';

const index = [
  body('email').isEmail(),
  body('userName').notEmpty(),
  body('password').notEmpty(),
  body('sex').notEmpty(),
];
  

export { index };