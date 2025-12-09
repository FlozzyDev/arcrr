import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReportModel } from './report.model';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private apiUrl = 'http://localhost:3030/reports';
  private reportsSubject = new BehaviorSubject<ReportModel[]>([]);
  public reports$ = this.reportsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadReports();
  }

  private loadReports(): void {
    this.http.get<{ reports: ReportModel[] }>(this.apiUrl).subscribe({
      next: (response) => this.reportsSubject.next(response.reports || []),
      error: (err) => console.error('Error loading reports:', err),
    });
  }

  getReports(): Observable<ReportModel[]> {
    return this.reports$;
  }

  getReportsByMap(mapId: string): void {
    if (mapId === 'all') {
      this.loadReports();
    } else {
      this.http.get<{ reports: ReportModel[] }>(`${this.apiUrl}/map/${mapId}`).subscribe({
        next: (response) => this.reportsSubject.next(response.reports || []),
        error: (err) => console.error('Error loading reports by map:', err),
      });
    }
  }

  getReport(id: string): Observable<ReportModel> {
    return this.http
      .get<{ report: ReportModel }>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.report));
  }

  addReport(report: Partial<ReportModel>): Observable<ReportModel> {
    return this.http
      .post<{ report: ReportModel }>(this.apiUrl, report)
      .pipe(map((response) => response.report));
  }

  updateReport(id: string, report: Partial<ReportModel>): Observable<ReportModel> {
    return this.http
      .put<{ report: ReportModel }>(`${this.apiUrl}/${id}`, report)
      .pipe(map((response) => response.report));
  }

  deleteReport(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
