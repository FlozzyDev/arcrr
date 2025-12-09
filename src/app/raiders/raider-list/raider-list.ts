import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RaiderModel } from '../raider.model';
import { RaiderCard } from '../raider-card/raider-card';

@Component({
  selector: 'app-raider-list',
  imports: [CommonModule, RaiderCard],
  templateUrl: './raider-list.html',
  styleUrl: './raider-list.css',
})
export class RaiderList {
  @Input() raiders: RaiderModel[] = [];
  @Input() selectedRaider: RaiderModel | null = null;
  @Output() raiderSelected = new EventEmitter<RaiderModel>();

  onRaiderClick(raider: RaiderModel): void {
    this.raiderSelected.emit(raider);
  }
}
