// server/routes/report.routes.js
import express from 'express';
import Report from '../models/report.model.js';
import Raider from '../models/raider.model.js';
import Map from '../models/map.model.js';

const router = express.Router();

// ------------------------------------------------------------------------------- GET ALL REPORTS (populate map and raider names)
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('mapId', 'name bannerImage')
      .populate('raidersEncounters.raiderId', 'name embarkId');
    res.status(200).json({ message: 'Reports fetched successfully', reports });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports', error });
  }
});

// ------------------------------------------------------------------------------- Get reports filtered by map dropdown (used in reports comp)
router.get('/map/:mapId', async (req, res) => {
  try {
    const { mapId } = req.params;
    const reports = await Report.find({ mapId: mapId })
      .populate('mapId', 'name bannerImage')
      .populate('raidersEncounters.raiderId', 'name embarkId');
    res.status(200).json({ message: 'Reports fetched successfully', reports });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports by map', error });
  }
});

// ------------------------------------------------------------------------------- Get a single report passing id
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('mapId', 'name bannerImage')
      .populate('raidersEncounters.raiderId', 'name embarkId');
    res.status(200).json({ message: 'Report fetched successfully', report });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching report', error });
  }
});

// ------------------------------------------------------------------------------- Post a new report
// ----------------------------------------------------------------------------- This is also where we create new raiders if they don't exist.
router.post('/', async (req, res) => {
  console.log(`Creating new report - calling POST`);
  console.log(`req.body: ${JSON.stringify(req.body)}`);
  try {
    const { mapId, mapModifiers, timeInRaid, raidersEncounters } = req.body;
    const map = await Map.findById(mapId);
    console.log(`Map found: ${JSON.stringify(map)}`);
    if (!map) {
      return res.status(404).json({ message: 'Map not found - error here' });
    }

    if (mapModifiers && !map.mapModifiers.includes(mapModifiers)) {
      return res.status(400).json({ message: 'Invalid map modifier for this map' });
    }

    const maxTimeSeconds = mapModifiers === 'Secret Bunker' ? 2700 : 1800;
    if (timeInRaid > maxTimeSeconds) {
      return res.status(400).json({
        message: `Time in raid cannot exceed ${maxTimeSeconds / 60} minutes for this modifier`,
      });
    }

    const lastReport = await Report.findOne().sort({ reportNumber: -1 });
    const newReportNumber = lastReport ? lastReport.reportNumber + 1 : 1;

    const processedEncounters = [];

    for (const encounter of raidersEncounters) {
      let steamProfileId = encounter.steamProfileId;
      let embarkId = encounter.embarkId;
      let raider = null;

      const matchConditions = [];
      if (embarkId && embarkId.trim()) matchConditions.push({ embarkId: embarkId });
      if (steamProfileId && steamProfileId.trim())
        matchConditions.push({ steamProfileId: steamProfileId });

      if (matchConditions.length > 0) {
        raider = await Raider.findOne({ $or: matchConditions });
      }

      if (raider) {
        raider.totalEncounters += 1;
        if (encounter.disposition === 'friendly') raider.friendlyEncounters += 1;
        if (encounter.disposition === 'skittish') raider.skittishEncounters += 1;
        if (encounter.disposition === 'unfriendly') raider.hostileEncounters += 1;

        if (encounter.picturePath) {
          raider.picturePath = encounter.picturePath;
        }

        raider.notes.push({
          fieldNotes: encounter.fieldNotes || '',
          disposition: encounter.disposition,
          encounterDate: new Date(),
        });

        try {
          await raider.save();
          console.log('Existing raider updated');
        } catch (error) {
          return res.status(500).json({
            message: 'Error updating existing raider',
            error: error.message,
          });
        }
      } else {
        raider = new Raider({
          name: encounter.name,
          embarkId: encounter.embarkId,
          steamProfileId: encounter.steamProfileId || '',
          firstEncounterDate: new Date(),
          totalEncounters: 1,
          friendlyEncounters: encounter.disposition === 'friendly' ? 1 : 0,
          skittishEncounters: encounter.disposition === 'skittish' ? 1 : 0,
          hostileEncounters: encounter.disposition === 'unfriendly' ? 1 : 0,
          picturePath: encounter.picturePath || '/assets/images/raiders/default-raider.png',
          notes: [
            {
              fieldNotes: encounter.fieldNotes || '',
              disposition: encounter.disposition,
              encounterDate: new Date(),
            },
          ],
        });

        try {
          await raider.save();
          console.log('New raider created');
        } catch (error) {
          return res.status(500).json({
            message: 'Error creating new raider',
            error: error.message,
          });
        }
      }

      processedEncounters.push({
        raiderId: raider._id,
        disposition: encounter.disposition,
        fieldNotes: encounter.fieldNotes || '',
        picturePath: encounter.picturePath || '',
      });
    }

    const newReport = new Report({
      reportNumber: newReportNumber,
      mapId,
      mapModifiers,
      timeInRaid,
      raidersEncounters: processedEncounters,
    });

    try {
      const savedReport = await newReport.save();

      // -------------------------------------------------------------- UPDATE RAIDER NOTES - After saving the report, update each raider's latest note with the reportId
      for (const encounter of processedEncounters) {
        const raider = await Raider.findById(encounter.raiderId);
        if (raider && raider.notes.length > 0) {
          const lastNoteIndex = raider.notes.length - 1;
          raider.notes[lastNoteIndex].reportId = savedReport._id;
          await raider.save();
        }
      }

      console.log('Report created successfully');
      res.status(201).json({
        message: 'Report created successfully',
        report: savedReport,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error creating report (after raider creation/update)',
        error: error.message,
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating report', error: error.message });
  }
});

// ------------------------------------------------------------------------------- Manual update a report in report details page
router.put('/:id', async (req, res) => {
  try {
    const updatedReport = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: 'Report updated successfully', report: updatedReport });
  } catch (error) {
    res.status(500).json({ message: 'Error updating report', error: error.message });
  }
});

// ------------------------------------------------------------------------------- Delete a report via id (in report details)
router.delete('/:id', async (req, res) => {
  try {
    const deletedReport = await Report.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Report deleted successfully', report: deletedReport });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting report', error: error.message });
  }
});

export default router;
