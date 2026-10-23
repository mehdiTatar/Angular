import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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

  readonly submitted = signal(false);
  readonly successMessage = signal('');

  onSubmit(): void {
    this.submitted.set(true);
    this.successMessage.set('');

    if (this.conferenceForm.invalid) {
      this.conferenceForm.markAllAsTouched();
      return;
    }

    this.conferenceService.addConference(this.conferenceForm.getRawValue());
    this.successMessage.set('La conférence a été ajoutée avec succès.');
    this.conferenceForm.reset();
    this.submitted.set(false);
  }
}
