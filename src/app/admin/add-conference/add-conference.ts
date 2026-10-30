import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';   // LOG : + computed, effect
import { toSignal } from '@angular/core/rxjs-interop';                                                   // LOG
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConferenceService } from '../../services/conference';

@Component({
  selector: 'app-add-conference',
  imports: [ReactiveFormsModule],
  templateUrl: './add-conference.html',
  styleUrl: './add-conference.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddConference {
  private readonly formBuilder = inject(FormBuilder);
  private readonly conferenceService = inject(ConferenceService);

  readonly conferenceForm = this.formBuilder.nonNullable.group({
    titre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    intervenant: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    sujet: ['', [Validators.required, Validators.maxLength(80)]],
    places: [1, [Validators.required, Validators.min(1), Validators.pattern(/^[1-9]\d*$/)]],
    date: ['', Validators.required],
  });

  // LOG : statut du formulaire converti en signal (slide 23)
  readonly formStatus = toSignal(this.conferenceForm.statusChanges, {
    initialValue: this.conferenceForm.status,
  });
  readonly isValid = computed(() => this.formStatus() === 'VALID');      // LOG (slide 24)

  readonly submitted = signal(false);
  readonly successMessage = signal('');

  constructor() {
    // LOG : s'affiche au démarrage, puis chaque fois que la validité change
    effect(() => console.log('Formulaire valide :', this.isValid()));
  }
///////////////ajout de la méthode onSubmit() pour gérer la soumission du formulaire
  onSubmit(): void {
  this.submitted.set(true);
  this.successMessage.set('');

  // Vérification de la validité du formulaire
  if (this.conferenceForm.invalid) {
    this.conferenceForm.markAllAsTouched();
    return;
  }

  // Récupération des données du formulaire
  const value = this.conferenceForm.getRawValue();

  // Appel du service pour ajouter la conférence
  this.conferenceService.addConference(value);

  // Réinitialisation du formulaire
  this.successMessage.set('La conférence a été ajoutée avec succès.');
  this.conferenceForm.reset();
  this.submitted.set(false);
}
}