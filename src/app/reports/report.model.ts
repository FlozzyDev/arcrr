export interface RaiderEncounter {
  raiderId: string | { _id: string; name: string };
  disposition: 'friendly' | 'skittish' | 'unfriendly';
  fieldNotes?: string;
  picturePath?: string;
}

export interface MapData {
  _id: string;
  name: string;
  bannerImage: string;
}

export class ReportModel {
  constructor(
    public _id: string,
    public datetime: Date,
    public mapId: string | MapData,
    public mapModifiers: string,
    public timeInRaid: number,
    public raidersEncounters: RaiderEncounter[],
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}
