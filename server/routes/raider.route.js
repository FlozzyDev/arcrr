import express from 'express';
import Raider from '../models/raider.model.js';

const router = express.Router();

// ------------------------------------------------------------------------------- GET ALL RAIDERS (for the raider list)
router.get('/', async (req, res) => {
  try {
    const raiders = await Raider.find();
    res.status(200).json({ message: 'Raiders fetched successfully', raiders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching raiders', error });
  }
});

// ------------------------------------------------------------------------------- GET A SINGLE RAIDER VIA ID (for the raider details page after clicking a card)
router.get('/:id', async (req, res) => {
  try {
    const raider = await Raider.findById(req.params.id).populate(
      'notes.reportId',
      'datetime mapId'
    );
    if (!raider) {
      return res.status(404).json({ message: 'Raider not found' });
    }
    res.status(200).json({ message: 'Raider fetched successfully', raider });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching raider', error });
  }
});

// ---------------------------------------------------------- PUT UPDATE A RAIDER VIA ID (for the raider details page - only place we can edit outside of creating a new report)
router.put('/:id', async (req, res) => {
  try {
    const updatedRaider = await Raider.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRaider) {
      return res.status(404).json({ message: 'Raider not found' });
    }
    res.status(200).json({ message: 'Raider updated successfully', raider: updatedRaider });
  } catch (error) {
    res.status(500).json({ message: 'Error updating raider', error });
  }
});

// ------------------------------------------------------------------------------- DELETE A RAIDER VIA ID (in raider details, same as update)
router.delete('/:id', async (req, res) => {
  try {
    const deletedRaider = await Raider.findByIdAndDelete(req.params.id);
    if (!deletedRaider) {
      return res.status(404).json({ message: 'Raider not found' });
    }
    res.status(200).json({ message: 'Raider deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting raider', error });
  }
});

export default router;
