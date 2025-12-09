import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    datetime: {
      type: Date,
      default: Date.now,
    },
    mapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Map',
      required: true,
    },
    mapModifiers: {
      type: String,
      required: false,
    },
    timeInRaid: {
      type: Number,
      required: true,
      max: 45,
    },
    raidersEncounters: [
      {
        raiderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Raider',
          required: true,
        },
        disposition: {
          type: String,
          enum: ['friendly', 'skittish', 'unfriendly'],
          required: true,
        },
        fieldNotes: {
          type: String,
          default: '',
        },
        picturePath: {
          type: String,
          default: '',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model('Report', reportSchema);

export default Report;
