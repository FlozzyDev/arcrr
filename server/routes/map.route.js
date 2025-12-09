import express from 'express';
import Map from '../models/map.model.js';

const router = express.Router();

// for now going to just do get for maps as there is no need for other CRUD operations for them

router.get('/', async (req, res) => {
  try {
    const maps = await Map.find().sort({ name: 1 });
    res.status(200).json({ message: 'Maps fetched successfully', maps });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching maps', error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const map = await Map.findById(req.params.id);
    if (!map) {
      return res.status(404).json({ message: 'Map not found' });
    }
    res.status(200).json({ message: 'Map fetched successfully', map });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching map', error });
  }
});

export default router;
