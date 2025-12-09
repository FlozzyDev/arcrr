import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportModel } from '../report.model';
import { ReportCard } from '../report-card/report-card';

@Component({
  selector: 'app-report-list',
  imports: [CommonModule, ReportCard],
  templateUrl: './report-list.html',
  styleUrl: './report-list.css',
})
export class ReportList {
  @Input() reports: ReportModel[] = [];
  @Input() selectedReport: ReportModel | null = null;
  @Output() reportSelected = new EventEmitter<ReportModel>();

  onReportClick(report: ReportModel): void {
    this.reportSelected.emit(report);
  }
}
