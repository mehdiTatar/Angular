import { Injectable, signal, computed } from '@angular/core';
import { Conference } from '../models/conference';

@Injectable({ providedIn: 'root' })
export class ConferenceService {
  private readonly _conferences = signal<Conference[]>([
    { id: 1, titre: 'Angular Summit', intervenant: 'Sara Ben Ali', sujet: 'Frontend', places: 50, date: '2026-11-10' },
    { id: 2, titre: 'Spring Days', intervenant: 'Yassine Trabelsi', sujet: 'Backend', places: 30, date: '2026-11-18' },
    { id: 3, titre: 'AI Connect', intervenant: 'Meriem Gharbi', sujet: 'IA', places: 100, date: '2026-12-02' },
  ]);

  readonly conferences = this._conferences.asReadonly();
  readonly selectedSujet = signal<string>('');

  readonly sujets = computed(() => [...new Set(this._conferences().map(c => c.sujet))]);

  readonly filteredConferences = computed(() => {
    const sujet = this.selectedSujet();
    return sujet
      ? this._conferences().filter(c => c.sujet === sujet)
      : this._conferences();
  });

  setSujet(sujet: string) {
    this.selectedSujet.set(sujet);
  }

  getById(id: number): Conference | undefined {
    return this._conferences().find(c => c.id === id);
  }

  decrementPlaces(id: number) {
    this._conferences.update(list =>
      list.map(c => (c.id === id && c.places > 0 ? { ...c, places: c.places - 1 } : c))
    );
  }

  incrementPlaces(id: number) {
    this._conferences.update(list =>
      list.map(c => (c.id === id ? { ...c, places: c.places + 1 } : c))
    );
  }
  addConference(data: Omit<Conference, 'id'>) {
  this._conferences.update(list => {
    const newId = list.length ? Math.max(...list.map(c => c.id)) + 1 : 1;
    return [...list, { id: newId, ...data }];
  });
}
}