import { Injectable, signal, computed, inject } from '@angular/core';
import { ConferenceService } from './conference';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly conferenceService = inject(ConferenceService);
  private readonly _bookedIds = signal<number[]>([]);

  readonly bookedIds = this._bookedIds.asReadonly();
  readonly bookingCount = computed(() => this._bookedIds().length);

  readonly bookedConferences = computed(() =>
    this.conferenceService.conferences().filter(c => this._bookedIds().includes(c.id))
  );

  isBooked(id: number): boolean {
    return this._bookedIds().includes(id);
  }

  book(id: number) {
    const conference = this.conferenceService.getById(id);
    if (!conference || conference.places <= 0 || this.isBooked(id)) {
      return;
    }
    this._bookedIds.update(ids => [...ids, id]);
    this.conferenceService.decrementPlaces(id);
  }

  cancel(id: number) {
    if (!this.isBooked(id)) {
      return;
    }
    this._bookedIds.update(ids => ids.filter(i => i !== id));
    this.conferenceService.incrementPlaces(id);
  }
}