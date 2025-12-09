import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MapModel } from './map.model';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private apiUrl = 'http://localhost:3030/maps';
  private mapsSubject = new BehaviorSubject<MapModel[]>([]);
  public maps$ = this.mapsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadMaps();
  }

  private loadMaps(): void {
    this.http.get<{ maps: MapModel[] }>(this.apiUrl).subscribe({
      next: (response) => this.mapsSubject.next(response.maps || []),
      error: (err) => console.error('Error loading maps:', err),
    });
  }

  getMaps(): Observable<MapModel[]> {
    return this.maps$;
  }

  getMap(id: string): Observable<MapModel> {
    return this.http
      .get<{ map: MapModel }>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.map));
  }
}
