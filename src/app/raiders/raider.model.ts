export interface RaiderNote {
  reportId: string | { _id: string; datetime: Date; mapId: any; reportNumber: number };
  reportNumber: number;
  fieldNotes: string;
  disposition: 'friendly' | 'skittish' | 'unfriendly';
  encounterDate: Date;
}

export class RaiderModel {
  constructor(
    public _id: string,
    public name: string,
    public embarkId: string,
    public steamProfileId?: string,
    public firstEncounterDate: Date = new Date(),
    public totalEncounters: number = 0,
    public friendlyEncounters: number = 0,
    public hostileEncounters: number = 0,
    public skittishEncounters: number = 0,
    public notes: RaiderNote[] = [],
    public picturePath: string = '/assets/images/raiders/default-raider.png'
  ) {}
}
