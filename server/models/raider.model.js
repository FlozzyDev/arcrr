import mongoose from 'mongoose';

const raiderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  embarkId: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
  },
  steamProfileId: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    default: null,
    set: (value) => {
      if (value === '' || value === null || value === undefined) {
        // need to treat as null for sparse to work
        return null;
      }
      return value;
    },
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
