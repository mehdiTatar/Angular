import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConferenceService } from '../services/conference';
import { BookingService } from '../services/booking';
import { Conference } from '../models/conference';
import { ConferenceDetail } from '../conference-detail/conference-detail';

@Component({
  selector: 'app-conference-list',
  imports: [ConferenceDetail, RouterLink],
  templateUrl: './conference-list.html',
  styleUrl: './conference-list.css',
})
export class ConferenceList {
  protected readonly conferenceService = inject(ConferenceService);
  protected readonly bookingService = inject(BookingService);

  protected readonly selected = signal<Conference | null>(null);
}