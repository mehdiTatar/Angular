import { Component, inject, input, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Conference } from '../models/conference';
import { ConferenceService } from '../services/conference';
import { BookingService } from '../services/booking';

@Component({
  selector: 'app-conference-detail',
  imports: [DatePipe],
  templateUrl: './conference-detail.html',
  styleUrl: './conference-detail.css',
})
export class ConferenceDetail {
  protected readonly conferenceService = inject(ConferenceService);
  protected readonly bookingService = inject(BookingService);

  conference = input<Conference | null>(null);

  // Paramètre de route /conferences/:id (grâce à withComponentInputBinding)
  id = input<string>();

  // Version "vivante" de la conférence, relue dans le service
  // pour que le nombre de places se mette à jour après chaque réservation.
  current = computed(() => {
    const id = this.id() ? Number(this.id()) : this.conference()?.id;
    return id != null ? this.conferenceService.getById(id) ?? null : null;
  });

  estReservee = computed(() => {
    const c = this.current();
    return c ? this.bookingService.isBooked(c.id) : false;
  });

  inscrire() {
    const c = this.current();
    if (c) {
      this.bookingService.book(c.id);   // ← l'appel vers BookingService
    }
  }

  annuler() {
    const c = this.current();
    if (c) {
      this.bookingService.cancel(c.id);
    }
  }
}