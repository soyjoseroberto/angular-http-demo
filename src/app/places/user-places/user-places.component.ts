import { Component, DestroyRef, inject, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent {
  isFetching = signal(false);
  error = signal('');
  // private httpClient = inject(HttpClient);
  private placesService = inject(PlacesService);
  private destroy = inject(DestroyRef);
  places = this.placesService.loadedUserPlaces;

  ngOnInit(): void {
    this.isFetching.set(true);
    const sub = this.placesService.loadUserPlaces()
      .subscribe({
        // next: (places) => this.places.set(places),
        error: (err: Error) => this.error.set(err.message),
        complete: () => this.isFetching.set(false),
      });

    this.destroy.onDestroy(() => {
      sub.unsubscribe();
    });
  }

  onRemovePlace(place: Place) {
    const sub = this.placesService.removeUserPlace(place).subscribe();

    this.destroy.onDestroy(() => {
      sub.unsubscribe();
    });
  }
}
