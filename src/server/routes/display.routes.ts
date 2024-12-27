import { Router } from 'express';
import { setupSSE, updateDisplay } from '../controllers/displayController';

const router = Router();

router.get('/display-updates', setupSSE);
router.post('/display', updateDisplay);

export default router;