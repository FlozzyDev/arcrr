import mongoose from 'mongoose';

const mapSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  mapModifiers: {
    type: [String],
    default: [
      'None',
      'Night Raid',
      'Lush Bloom',
      'Husk Graveyard',
      'Hidden Cache',
      'Prospecting Probe',
      'Secret Bunker',
      'Harvester',
      'Matriarch',
      'Electromagnetic Storms',
    ],
  },
  bannerImage: {
    type: String,
    default: '/assets/images/maps/default_map_banner.png',
  },
});

const Map = mongoose.model('Map', mapSchema);
export default Map;
