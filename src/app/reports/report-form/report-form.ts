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
  timeInRaid: number = 0;
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
      // Edit mode
      this.selectedMapIdForm =
        typeof this.report.mapId === 'string' ? this.report.mapId : this.report.mapId._id;
      this.mapModifiers = this.report.mapModifiers;
      this.timeInRaid = this.report.timeInRaid;

      this.raiders = this.report.raidersEncounters.map((enc) => ({
        name: typeof enc.raiderId === 'object' ? enc.raiderId.name : enc.raiderId || '',
        disposition: enc.disposition,
        fieldNotes: enc.fieldNotes || '',
        picturePath: enc.picturePath || '',
      }));
    } else {
      // Create mode
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

    if (!this.timeInRaid || this.timeInRaid <= 0) {
      alert('Please enter a valid time in raid');
      return;
    }

    const reportData: any = {
      mapId: this.selectedMapIdForm,
      mapModifiers: this.mapModifiers || '',
      timeInRaid: this.timeInRaid,
      raidersEncounters: this.raiders
        .filter((r) => r.name.trim() !== '')
        .map((r) => ({
          name: r.name,
          embarkId: r.embarkId || '',
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
