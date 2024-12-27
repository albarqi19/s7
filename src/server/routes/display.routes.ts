import { Router } from 'express';
import { displayController } from '../controllers/displayController';

const router = Router();

router.get('/stream', displayController.setupSSE);
router.get('/', displayController.getCurrentDisplay);
router.post('/update', displayController.updateDisplay);

export default router;