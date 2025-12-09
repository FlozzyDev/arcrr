import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RaiderModel } from './raider.model';

@Injectable({
  providedIn: 'root',
})
export class RaiderService {
  private apiUrl = 'http://localhost:3030/raiders';
  private raidersSubject = new BehaviorSubject<RaiderModel[]>([]);
  public raiders$ = this.raidersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadRaiders();
  }

  loadRaiders(): void {
    this.http.get<{ raiders: RaiderModel[] }>(this.apiUrl).subscribe({
      next: (response) => this.raidersSubject.next(response.raiders || []),
      error: (err) => console.error('Error loading raiders:', err),
    });
  }

  getRaiders(): Observable<RaiderModel[]> {
    return this.raiders$;
  }

  getRaider(id: string): Observable<RaiderModel> {
    return this.http
      .get<{ raider: RaiderModel }>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.raider));
  }

  updateRaider(id: string, raider: Partial<RaiderModel>): Observable<RaiderModel> {
    return this.http
      .put<{ raider: RaiderModel }>(`${this.apiUrl}/${id}`, raider)
      .pipe(map((response) => response.raider));
  }

  deleteRaider(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
