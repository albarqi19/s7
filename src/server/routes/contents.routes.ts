import { Router } from 'express';
import { contentsController } from '../controllers/contentsController';

const router = Router();

router.get('/', contentsController.getContents);

export default router;