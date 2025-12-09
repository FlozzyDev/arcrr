import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapModel } from '../../maps/map.model';

@Component({
  selector: 'app-report-banner',
  imports: [CommonModule, FormsModule],
  templateUrl: './report-banner.html',
  styleUrl: './report-banner.css',
})
export class ReportBanner implements OnChanges {
  @Input() maps: MapModel[] = [];
  @Input() selectedMapId: string = 'all';
  @Input() selectedMap: MapModel | null = null;
  @Output() mapSelected = new EventEmitter<string>();

  selectedValue: string = 'all';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedMapId']) {
      this.selectedValue = this.selectedMapId;
    }
  }

  onMapChange(): void {
    this.mapSelected.emit(this.selectedValue);
  }

  getBannerImage(): string {
    if (this.selectedMap?.bannerImage) {
      return this.selectedMap.bannerImage;
    }
    return '/assets/images/maps/all_maps_banner.png';
  }
}
