import mongoose from 'mongoose';

const raiderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  embarkId: {
    type: String,
  },
  firstEncounterDate: {
    type: Date,
    default: Date.now,
  },
  totalEncounters: {
    type: Number,
    default: 0,
  },
  friendlyEncounters: {
    type: Number,
    default: 0,
  },
  hostileEncounters: {
    type: Number,
    default: 0,
  },
  skittishEncounters: {
    type: Number,
    default: 0,
  },
  notes: [
    {
      reportId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Report',
      },
      fieldNotes: {
        type: String,
        default: '',
      },
      disposition: {
        type: String,
        enum: ['friendly', 'skittish', 'unfriendly'],
      },
      encounterDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  picturePath: {
    type: String,
    default: '/assets/images/raiders/default-raider.png',
  },
});

const Raider = mongoose.model('Raider', raiderSchema);
export default Raider;
