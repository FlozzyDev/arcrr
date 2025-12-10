import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RaiderModel, RaiderNote } from '../raider.model';

@Component({
  selector: 'app-raider-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './raider-detail.html',
  styleUrl: './raider-detail.css',
})
export class RaiderDetail implements OnChanges {
  @Input() raider!: RaiderModel;
  @Input() isEditing: boolean = false;
  @Output() edit = new EventEmitter<void>();
  @Output() update = new EventEmitter<Partial<RaiderModel>>();
  @Output() delete = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  editedName: string = '';
  editedEmbarkId: string = '';
  editedSteamProfileId: string = '';
  editedPicturePath: string = '';
  editedNotes: RaiderNote[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['raider'] || changes['isEditing']) && this.raider) {
      this.resetForm();
    }
  }

  private resetForm(): void {
    if (!this.raider) return;
    this.editedName = this.raider.name;
    this.editedEmbarkId = this.raider.embarkId;
    this.editedSteamProfileId = this.raider.steamProfileId || '';
    this.editedPicturePath = this.raider.picturePath || '';
    this.editedNotes = [...this.raider.notes];
  }

  onEdit(): void {
    this.edit.emit();
  }

  onSave(): void {
    const updatedRaider: Partial<RaiderModel> = {
      name: this.editedName,
      embarkId: this.editedEmbarkId,
      steamProfileId: this.editedSteamProfileId,
      picturePath: this.editedPicturePath,
      notes: this.editedNotes,
    };
    this.update.emit(updatedRaider);
  }

  onDelete(): void {
    this.delete.emit(this.raider._id);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  getDispositionText(disposition: string): string {
    return disposition.charAt(0).toUpperCase() + disposition.slice(1);
  }

  getReportDate(note: RaiderNote): string {
    if (typeof note.reportId === 'object' && note.reportId !== null) {
      return new Date(note.reportId.datetime).toLocaleDateString();
    }
    return new Date(note.encounterDate).toLocaleDateString();
  }
}
