import express from 'express';
const router = express.Router();
import * as resumeController from '../../controllers/v1/resumeController';
import * as experienceController from '../../controllers/v1/experienceController';
import { Request, Response } from 'express';

router.get('/up', (req: Request, res: Response) => {res.sendStatus(200);});
router.get('/resume/:type', resumeController.index);
router.get('/experience', experienceController.index);

module.exports = router;
