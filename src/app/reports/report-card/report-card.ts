import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportModel, MapData } from '../report.model';

@Component({
  selector: 'app-report-card',
  imports: [CommonModule],
  templateUrl: './report-card.html',
  styleUrl: './report-card.css',
})
export class ReportCard {
  @Input() report!: ReportModel;
  @Input() isSelected: boolean = false;

  getMapName(): string {
    if (typeof this.report.mapId === 'object' && this.report.mapId !== null) {
      return (this.report.mapId as MapData).name;
    }
    return 'Unknown Map';
  }

  getBannerImage(): string {
    if (typeof this.report.mapId === 'object' && this.report.mapId !== null) {
      return (this.report.mapId as MapData).bannerImage;
    }
    return '/assets/images/site/arcrr_background_lg.webp';
  }

  getFriendlyCount(): number {
    return this.report.raidersEncounters.filter((r) => r.disposition === 'friendly').length;
  }

  getSkittishCount(): number {
    return this.report.raidersEncounters.filter((r) => r.disposition === 'skittish').length;
  }

  getUnfriendlyCount(): number {
    return this.report.raidersEncounters.filter((r) => r.disposition === 'unfriendly').length;
  }
}
