import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  private httpClient = inject(HttpClient);
  private destroy = inject(DestroyRef);

  ngOnInit(): void {
      const sub = this.httpClient.get<{places: Place[]}>('http://localhost:3000/places').subscribe({
        next: (res) => console.log(res.places)
      });

      this.destroy.onDestroy(() => {
        sub.unsubscribe();  
      })
  }
}
