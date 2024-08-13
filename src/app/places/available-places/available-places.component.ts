import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');
  private httpClient = inject(HttpClient);
  private destroy = inject(DestroyRef);

  ngOnInit(): void {
    this.isFetching.set(true);
    const sub = this.httpClient
      .get<{ places: Place[] }>('http://localhost:3000/places')
      .pipe(
        map((res) => res.places),
        catchError((error) => {
          console.log(error); // Or send to server for analytics
          return throwError(
            () => new Error('Something went wrong while fetching the data')
          );
        })
      )
      .subscribe({
        next: (places) => this.places.set(places),
        error: (err: Error) => this.error.set(err.message),
        complete: () => this.isFetching.set(false),
      });

    this.destroy.onDestroy(() => {
      sub.unsubscribe();
    });
  }
}
