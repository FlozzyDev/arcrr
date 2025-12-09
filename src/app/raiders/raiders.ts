import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RaiderService } from './raider.service';
import { RaiderModel } from './raider.model';
import { RaiderList } from './raider-list/raider-list';
import { RaiderDetail } from './raider-detail/raider-detail';

@Component({
  selector: 'app-raiders',
  imports: [CommonModule, FormsModule, RaiderList, RaiderDetail],
  templateUrl: './raiders.html',
  styleUrl: './raiders.css',
})
export class Raiders implements OnInit, OnDestroy {
  raiders: RaiderModel[] = [];
  filteredRaiders: RaiderModel[] = [];
  selectedRaider: RaiderModel | null = null;
  isEditing: boolean = false;
  searchTerm: string = '';

  private raidersSubscription?: Subscription;

  constructor(private raiderService: RaiderService) {}

  ngOnInit(): void {
    this.raidersSubscription = this.raiderService.getRaiders().subscribe({
      next: (raiders) => {
        this.raiders = raiders;
        this.filteredRaiders = raiders;
      },
      error: (err) => console.error('Error loading raiders:', err),
    });
  }

  onSearchChange(): void {
    if (!this.searchTerm.trim()) {
      this.filteredRaiders = this.raiders;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredRaiders = this.raiders.filter((raider) =>
        raider.name.toLowerCase().includes(term)
      );
    }
  }

  ngOnDestroy(): void {
    this.raidersSubscription?.unsubscribe();
  }

  onRaiderSelected(raider: RaiderModel): void {
    // Load full raider details with populated reports
    this.raiderService.getRaider(raider._id).subscribe({
      next: (fullRaider) => {
        this.selectedRaider = fullRaider;
        this.isEditing = false;
      },
      error: (err) => console.error('Error loading raider details:', err),
    });
  }

  onEditRaider(): void {
    this.isEditing = true;
  }

  onUpdateRaider(raider: Partial<RaiderModel>): void {
    if (this.selectedRaider) {
      const raiderId = this.selectedRaider._id;
      this.raiderService.updateRaider(raiderId, raider).subscribe({
        next: () => {
          this.raiderService.loadRaiders();
          this.isEditing = false;
          this.raiderService.getRaider(raiderId).subscribe({
            next: (fullRaider) => {
              this.selectedRaider = fullRaider;
            },
            error: (err) => console.error('Error reloading raider:', err),
          });
        },
        error: (err) => console.error('Error updating raider:', err),
      });
    }
  }

  onDeleteRaider(id: string): void {
    if (confirm('Are you sure you want to delete this raider?')) {
      this.raiderService.deleteRaider(id).subscribe({
        next: () => {
          this.raiderService.loadRaiders();
          this.selectedRaider = null;
        },
        error: (err) => console.error('Error deleting raider:', err),
      });
    }
  }

  onCancelEdit(): void {
    this.isEditing = false;
    // Reload the selected raider to reset changes
    if (this.selectedRaider) {
      this.onRaiderSelected(this.selectedRaider);
    }
  }
}
