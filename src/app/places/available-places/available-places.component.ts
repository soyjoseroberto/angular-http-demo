import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesService } from '../places.service';

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
  private placesService = inject(PlacesService);
  private destroy = inject(DestroyRef);

  ngOnInit(): void {
    this.isFetching.set(true);
    const sub = this.placesService.loadAvailablePlaces()
      .subscribe({
        next: (places) => this.places.set(places),
        error: (err: Error) => this.error.set(err.message),
        complete: () => this.isFetching.set(false),
      });

    this.destroy.onDestroy(() => {
      sub.unsubscribe();
    });
  }

  onSelectPlace(selectedPlace: Place) {
    const sub = this.placesService.addPlaceToUserPlaces(selectedPlace).subscribe({
      next: (response) => console.log(response)
    });

    this.destroy.onDestroy(() => {
      sub.unsubscribe();
    });
  }
}
