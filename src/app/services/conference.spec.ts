import { TestBed } from '@angular/core/testing';
import { ConferenceService } from './conference';

describe('ConferenceService', () => {
  let service: ConferenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConferenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a conference with a new id', () => {
    service.addConference({ titre: 'Test', intervenant: 'X', sujet: 'Cloud', places: 10, date: '2026-12-20' });
    expect(service.conferences().length).toBe(4);
    expect(service.getById(4)?.titre).toBe('Test');
  });
});