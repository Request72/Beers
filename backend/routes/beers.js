const express = require('express');
const { z } = require('zod');
const Beer = require('../models/Beer');
const { validate } = require('../middleware/validate');

const router = express.Router();
const objectIdSchema = z.object({ id: z.string().regex(/^[0-9a-fA-F]{24}$/) });

router.get('/', async (req, res) => {
  try {
    const beers = await Beer.find();
    return res.json(beers);
  } catch (error) {
    console.error('Error fetching beers:', error);
    return res.status(500).json({ error: 'Failed to fetch beers' });
  }
});

router.get('/:id', validate(objectIdSchema, 'params'), async (req, res) => {
  try {
    const beer = await Beer.findById(req.params.id);
    if (!beer) {
      return res.status(404).json({ error: 'Beer not found' });
    }
    return res.json(beer);
  } catch (error) {
    console.error('Error fetching beer:', error);
    return res.status(500).json({ error: 'Failed to fetch beer' });
  }
});

module.exports = router;
