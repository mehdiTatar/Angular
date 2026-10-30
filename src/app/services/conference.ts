
import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { Conference } from '../models/conference';

@Injectable({ providedIn: 'root' })
export class ConferenceService {

  // Injection du service HttpClient
  private http = inject(HttpClient);

  // URL du backend JSON Server
  private apiUrl = 'http://localhost:3000/conferences';

  // GET : récupération des conférences avec httpResource()
  readonly conferencesResource = httpResource<Conference[]>(
    () => this.apiUrl
  );

  // Méthode demandée pour récupérer toutes les conférences
  getAllConferences() {
    return this.conferencesResource;
  }

  // Signal contenant la liste des conférences
  readonly conferences = computed(
    () => this.getAllConferences().value() ?? []
  );

  // Signal du sujet sélectionné
  readonly selectedSujet = signal<string>('');

  // Extraction des sujets sans doublons
  readonly sujets = computed(() =>
    [...new Set(this.conferences().map(c => c.sujet))]
  );

  // Filtrage des conférences selon le sujet
  readonly filteredConferences = computed(() => {
    const sujet = this.selectedSujet();

    return sujet
      ? this.conferences().filter(c => c.sujet === sujet)
      : this.conferences();
  });

  // POST : ajout d'une conférence
  addConference(data: Omit<Conference, 'id'>) {
    this.http.post<Conference>(this.apiUrl, data).subscribe(() => {
      this.conferencesResource.reload();
    });
  }

  // PUT : modification d'une conférence
  updateConference(id: number, c: Conference) {
    this.http.put<Conference>(`${this.apiUrl}/${id}`, c).subscribe(() => {
      this.conferencesResource.reload();
    });
  }

  // DELETE : suppression d'une conférence
  deleteConference(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      this.conferencesResource.reload();
    });
  }

  // Modification du sujet sélectionné
  setSujet(sujet: string) {
    this.selectedSujet.set(sujet);
  }

  // Recherche d'une conférence par son identifiant
  getById(id: number): Conference | undefined {
    return this.conferences().find(c => c.id === id);
  }

  // Décrémentation des places après réservation
  decrementPlaces(id: number) {
    const conference = this.getById(id);

    if (conference && conference.places > 0) {
      const updated = {
        ...conference,
        places: conference.places - 1
      };

      this.updateConference(id, updated);
    }
  }

  // Incrémentation des places après annulation
  incrementPlaces(id: number) {
    const conference = this.getById(id);

    if (conference) {
      const updated = {
        ...conference,
        places: conference.places + 1
      };

      this.updateConference(id, updated);
    }
  }
}
