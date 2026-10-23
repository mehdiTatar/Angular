import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddConference } from './add-conference';
import { ConferenceService } from '../../services/conference';

describe('AddConference', () => {
  let component: AddConference;
  let fixture: ComponentFixture<AddConference>;
  let conferenceService: ConferenceService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddConference],
    }).compileComponents();

    fixture = TestBed.createComponent(AddConference);
    component = fixture.componentInstance;
    conferenceService = TestBed.inject(ConferenceService);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not create a conference when the form is invalid', () => {
    const conferenceCount = conferenceService.conferences().length;

    component.onSubmit();

    expect(conferenceService.conferences()).toHaveLength(conferenceCount);
    expect(component.conferenceForm.controls.titre.touched).toBe(true);
  });

  it('should create a conference when the form is valid', () => {
    const conferenceCount = conferenceService.conferences().length;
    component.conferenceForm.setValue({
      titre: 'TypeScript avancé',
      intervenant: 'Amira Ben Salem',
      sujet: 'TypeScript',
      places: 25,
      date: '2026-12-20',
    });

    component.onSubmit();

    expect(conferenceService.conferences()).toHaveLength(conferenceCount + 1);
    expect(conferenceService.conferences().at(-1)?.titre).toBe('TypeScript avancé');
    expect(component.successMessage()).toBe('La conférence a été ajoutée avec succès.');
  });
});
