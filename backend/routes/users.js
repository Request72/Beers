const express = require('express');
const { z } = require('zod');
const { getMyProfile, updateMyProfile } = require('../controllers/usersController');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

const profileSchema = z.object({
  name: z.string().max(120).optional(),
  avatarUrl: z.string().url().max(500).optional(),
  bio: z.string().max(500).optional(),
  phone: z.string().max(30).optional(),
  address: z.string().max(200).optional(),
});

router.get('/me', requireAuth, getMyProfile);
router.put('/me', requireAuth, validate(profileSchema), updateMyProfile);

module.exports = router;
