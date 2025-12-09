import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RaiderModel } from '../raider.model';

@Component({
  selector: 'app-raider-card',
  imports: [CommonModule],
  templateUrl: './raider-card.html',
  styleUrl: './raider-card.css',
})
export class RaiderCard {
  @Input() raider!: RaiderModel;
  @Input() isSelected: boolean = false;
}
