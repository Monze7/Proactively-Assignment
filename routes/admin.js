import express from 'express';
import { createForm } from '../services/formService.js';

const router = express.Router();

router.post('/forms', async (req, res) => {
  const { adminId, title } = req.body;
  const form = await createForm(adminId, title);
  res.json(form);
});

export default router;
