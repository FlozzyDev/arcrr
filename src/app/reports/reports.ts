import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ReportService } from './report.service';
import { MapService } from '../maps/map.service';
import { RaiderService } from '../raiders/raider.service';
import { ReportModel } from './report.model';
import { MapModel } from '../maps/map.model';
import { ReportList } from './report-list/report-list';
import { ReportDetail } from './report-detail/report-detail';
import { ReportForm } from './report-form/report-form';
import { ReportBanner } from './report-banner/report-banner';

@Component({
  selector: 'app-reports',
  imports: [CommonModule, ReportList, ReportDetail, ReportForm, ReportBanner],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports implements OnInit, OnDestroy {
  reports: ReportModel[] = [];
  maps: MapModel[] = [];
  selectedReport: ReportModel | null = null;
  selectedMapId: string = 'all';
  selectedMap: MapModel | null = null;
  showForm: boolean = false;
  isEditing: boolean = false;

  private reportsSubscription?: Subscription;
  private mapsSubscription?: Subscription;

  constructor(
    private reportService: ReportService,
    private mapService: MapService,
    private raiderService: RaiderService
  ) {}

  ngOnInit(): void {
    // Load maps
    this.mapsSubscription = this.mapService.getMaps().subscribe({
      next: (maps) => {
        this.maps = maps;
        if (maps.length > 0 && this.selectedMapId === 'all') {
          // Set default map if needed
        }
      },
      error: (err) => console.error('Error loading maps:', err),
    });

    // Load reports
    this.reportsSubscription = this.reportService.getReports().subscribe({
      next: (reports) => {
        this.reports = reports;
      },
      error: (err) => console.error('Error loading reports:', err),
    });
  }

  ngOnDestroy(): void {
    this.reportsSubscription?.unsubscribe();
    this.mapsSubscription?.unsubscribe();
  }

  onMapSelected(mapId: string): void {
    this.selectedMapId = mapId;
    this.selectedMap = this.maps.find((m) => m._id === mapId) || null;
    this.reportService.getReportsByMap(mapId);
    this.selectedReport = null;
    this.showForm = false;
  }

  onReportSelected(report: ReportModel): void {
    this.selectedReport = report;
    this.showForm = false;
    this.isEditing = false;
  }

  onCreateReport(): void {
    this.showForm = true;
    this.isEditing = false;
    this.selectedReport = null;
  }

  onEditReport(): void {
    if (this.selectedReport) {
      this.showForm = true;
      this.isEditing = true;
    }
  }

  onDeleteReport(id: string): void {
    if (confirm('Are you sure you want to delete this report?')) {
      this.reportService.deleteReport(id).subscribe({
        next: () => {
          this.reportService.getReportsByMap(this.selectedMapId);
          this.selectedReport = null;
        },
        error: (err) => console.error('Error deleting report:', err),
      });
    }
  }

  onFormSubmit(report: Partial<ReportModel>): void {
    if (this.isEditing && this.selectedReport) {
      this.reportService.updateReport(this.selectedReport._id, report).subscribe({
        next: () => {
          this.reportService.getReportsByMap(this.selectedMapId);
          this.raiderService.loadRaiders();
          this.showForm = false;
          this.isEditing = false;
          this.selectedReport = null;
        },
        error: (err) => console.error('Error updating report:', err),
      });
    } else {
      this.reportService.addReport(report).subscribe({
        next: () => {
          this.reportService.getReportsByMap(this.selectedMapId);
          this.raiderService.loadRaiders();
          this.showForm = false;
        },
        error: (err) => console.error('Error creating report:', err),
      });
    }
  }

  onFormCancel(): void {
    this.showForm = false;
    this.isEditing = false;
  }
}
