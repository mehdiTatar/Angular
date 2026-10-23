import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConferenceList } from './conference-list';
import { ConferenceService } from '../services/conference';
import { BookingService } from '../services/booking';

describe('ConferenceList', () => {
  let component: ConferenceList;
  let fixture: ComponentFixture<ConferenceList>;
  let conferenceService: ConferenceService;
  let bookingService: BookingService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConferenceList],
    }).compileComponents();

    fixture = TestBed.createComponent(ConferenceList);
    component = fixture.componentInstance;
    conferenceService = TestBed.inject(ConferenceService);
    bookingService = TestBed.inject(BookingService);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should decrease the remaining places when booking', () => {
    bookingService.book(1);

    expect(conferenceService.getById(1)?.places).toBe(49);
    expect(bookingService.isBooked(1)).toBe(true);
    expect(bookingService.bookingCount()).toBe(1);
  });

  it('should restore the place when cancelling', () => {
    bookingService.book(1);
    bookingService.cancel(1);

    expect(conferenceService.getById(1)?.places).toBe(50);
    expect(bookingService.isBooked(1)).toBe(false);
  });

  it('should not book the same conference twice', () => {
    bookingService.book(2);
    bookingService.book(2);

    expect(conferenceService.getById(2)?.places).toBe(29);
    expect(bookingService.bookingCount()).toBe(1);
  });
});