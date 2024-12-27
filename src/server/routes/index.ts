import { Router } from 'express';
import contentsRoutes from './contents.routes';
import displayRoutes from './display.routes';

const router = Router();

router.use('/contents', contentsRoutes);
router.use('/display', displayRoutes);

export default router;