import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportModel, MapData } from '../report.model';

@Component({
  selector: 'app-report-detail',
  imports: [CommonModule],
  templateUrl: './report-detail.html',
  styleUrl: './report-detail.css',
})
export class ReportDetail {
  @Input() report!: ReportModel;
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<string>();

  getMapName(): string {
    if (typeof this.report.mapId === 'object' && this.report.mapId !== null) {
      return (this.report.mapId as MapData).name;
    }
    return 'Unknown Map';
  }

  getRaiderName(raiderId: string | { _id: string; name: string }): string {
    if (typeof raiderId === 'object' && raiderId !== null) {
      return raiderId.name;
    }
    return 'Unknown Raider';
  }

  getDispositionText(disposition: string): string {
    return disposition.charAt(0).toUpperCase() + disposition.slice(1);
  }

  onEdit(): void {
    this.edit.emit();
  }

  onDelete(): void {
    this.delete.emit(this.report._id);
  }
}
