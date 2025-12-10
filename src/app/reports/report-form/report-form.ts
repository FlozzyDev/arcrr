import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportModel } from '../report.model';
import { MapModel } from '../../maps/map.model';

interface RaiderEncounterForm {
  name: string;
  embarkId?: string;
  steamProfileId?: string;
  disposition: 'friendly' | 'skittish' | 'unfriendly';
  fieldNotes?: string;
  picturePath?: string;
}

@Component({
  selector: 'app-report-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './report-form.html',
  styleUrl: './report-form.css',
})
export class ReportForm implements OnInit, OnChanges {
  @Input() report: ReportModel | null = null;
  @Input() maps: MapModel[] = [];
  @Input() selectedMapId: string = 'all';
  @Output() submit = new EventEmitter<Partial<ReportModel>>();
  @Output() cancel = new EventEmitter<void>();

  selectedMapIdForm: string = '';
  mapModifiers: string = '';
  timeMinutes: number = 0;
  timeSeconds: number = 0;
  raiders: RaiderEncounterForm[] = [];
  availableModifiers: string[] = [];

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['maps'] && this.maps.length > 0) {
      this.updateModifiers();
    }
    if (changes['selectedMapId'] && !this.report) {
      this.selectedMapIdForm = this.selectedMapId !== 'all' ? this.selectedMapId : '';
      this.updateModifiers();
    }
  }

  private initializeForm(): void {
    if (this.report) {
      this.selectedMapIdForm =
        typeof this.report.mapId === 'string' ? this.report.mapId : this.report.mapId._id;
      this.mapModifiers = this.report.mapModifiers;
      this.timeMinutes = Math.floor(this.report.timeInRaid / 60);
      this.timeSeconds = this.report.timeInRaid % 60;

      this.raiders = this.report.raidersEncounters.map((enc) => ({
        name: typeof enc.raiderId === 'object' ? enc.raiderId.name : enc.raiderId || '',
        embarkId: typeof enc.raiderId === 'object' ? enc.raiderId.embarkId || '' : '',
        disposition: enc.disposition,
        fieldNotes: enc.fieldNotes || '',
        picturePath: enc.picturePath || '',
      }));
    } else {
      this.selectedMapIdForm = this.selectedMapId !== 'all' ? this.selectedMapId : '';
      this.raiders = [{ name: '', disposition: 'friendly' }];
    }
    this.updateModifiers();
  }

  onMapChange(): void {
    this.updateModifiers();
    this.mapModifiers = '';
  }

  updateModifiers(): void {
    const selectedMap = this.maps.find((m) => m._id === this.selectedMapIdForm);
    this.availableModifiers = selectedMap?.mapModifiers || [];
  }

  addRaiderEncounter(): void {
    this.raiders.push({
      name: '',
      disposition: 'friendly',
    });
  }

  removeRaiderEncounter(index: number): void {
    this.raiders.splice(index, 1);
  }

  onSubmit(): void {
    if (!this.selectedMapIdForm || this.selectedMapIdForm.trim() === '') {
      alert('Please select a map');
      return;
    }

    if (this.timeMinutes < 0 || this.timeSeconds < 0 || this.timeSeconds > 59) {
      alert('Please enter a valid time (seconds must be 0-59)');
      return;
    }

    const totalSeconds = this.timeMinutes * 60 + this.timeSeconds;
    if (totalSeconds <= 0) {
      alert('Time in raid must be greater than 0');
      return;
    }

    const maxTime = this.mapModifiers === 'Secret Bunker' ? 2700 : 1800;
    if (totalSeconds > maxTime) {
      alert(`Time in raid cannot exceed ${Math.floor(maxTime / 60)} minutes for this modifier`);
      return;
    }

    const validRaiders = this.raiders.filter((r) => r.name.trim() !== '');

    if (validRaiders.length === 0) {
      alert('Please add at least one raider encounter');
      return;
    }

    for (const raider of validRaiders) {
      if (!raider.embarkId || raider.embarkId.trim() === '') {
        alert(`Embark ID is required for raider: ${raider.name}`);
        return;
      }
    }

    const reportData: any = {
      mapId: this.selectedMapIdForm,
      mapModifiers: this.mapModifiers || '',
      timeInRaid: totalSeconds,
      raidersEncounters: validRaiders.map((r) => ({
        name: r.name,
        embarkId: r.embarkId,
        steamProfileId: r.steamProfileId || '',
        disposition: r.disposition,
        fieldNotes: r.fieldNotes || '',
        picturePath: r.picturePath || '',
      })),
    };
    this.submit.emit(reportData);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
