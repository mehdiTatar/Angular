import { Component, inject, input, computed, signal, effect } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Conference } from '../models/conference';
import { ConferenceService } from '../services/conference';
import { BookingService } from '../services/booking';

@Component({
  selector: 'app-conference-detail',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './conference-detail.html',
  styleUrl: './conference-detail.css',
})
export class ConferenceDetail {

  protected readonly conferenceService = inject(ConferenceService);
  protected readonly bookingService = inject(BookingService);
  private readonly fb = inject(FormBuilder);

  conference = input<Conference | null>(null);
  id = input<string>();

  // Mode modification
  readonly editMode = signal(false);

  // Formulaire de modification
  readonly updateForm = this.fb.nonNullable.group({
    titre: ['', Validators.required],
    intervenant: ['', Validators.required],
    sujet: ['', Validators.required],
    places: [1, [Validators.required, Validators.min(1)]],
    date: ['', Validators.required],
  });

  current = computed(() => {
    const id = this.id() ? Number(this.id()) : this.conference()?.id;
    return id != null ? this.conferenceService.getById(id) ?? null : null;
  });

  // Charger les données de la conférence dans le formulaire
  constructor() {
    effect(() => {
      const c = this.current();

      if (c) {
        this.updateForm.patchValue({
          titre: c.titre,
          intervenant: c.intervenant,
          sujet: c.sujet,
          places: c.places,
          date: c.date,
        });
      }
    });
  }

  estReservee = computed(() => {
    const c = this.current();
    return c ? this.bookingService.isBooked(c.id) : false;
  });

  inscrire() {
    const c = this.current();
    if (c) this.bookingService.book(c.id);
  }

  annuler() {
    const c = this.current();
    if (c) this.bookingService.cancel(c.id);
  }

  // Activer le mode modification
  modifier() {
    this.editMode.set(true);
  }

  // Enregistrer les modifications avec PUT
  enregistrer() {
    const c = this.current();

    if (!c || this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      return;
    }

    const updatedConference: Conference = {
      id: c.id,
      ...this.updateForm.getRawValue(),
    };

    this.conferenceService.updateConference(c.id, updatedConference);
    this.editMode.set(false);
  }

  // Annuler la modification
  annulerModification() {
    this.editMode.set(false);
  }

  // Supprimer une conférence
supprimer() {
  const c = this.current();

  if (c && confirm('Voulez-vous vraiment supprimer cette conférence ?')) {
    this.conferenceService.deleteConference(c.id);
  }
}
}