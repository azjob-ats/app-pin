import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, BehaviorSubject } from 'rxjs';
import { Pin } from '@shared/interfaces/pin.interface';
import { generateMockPins, MOCK_PIN_DETAIL, MOCK_PINS } from '@shared/mocks/pins.mock';

@Injectable({ providedIn: 'root' })
export class PinService {
  private savedPins = new Set<string>();
  private pinsSubject = new BehaviorSubject<Pin[]>(MOCK_PINS);

  getPins(page = 0, pageSize = 20): Observable<Pin[]> {
    const pins = generateMockPins(pageSize, page * pageSize);
    return of(pins).pipe(delay(400));
  }

  getPinById(id: string): Observable<Pin> {
    if (id === '296604325483937524') {
      return of(MOCK_PIN_DETAIL).pipe(delay(300));
    }
    const pin = generateMockPins(1, parseInt(id.replace('pin-', '')) || 0)[0];
    return of(pin ?? MOCK_PIN_DETAIL).pipe(delay(300));
  }

  getRelatedPins(pinId: string): Observable<Pin[]> {
    return of(generateMockPins(12, 10)).pipe(delay(500));
  }

  getUserPins(userId: string, page = 0): Observable<Pin[]> {
    return of(generateMockPins(20, page * 20)).pipe(delay(400));
  }

  getBoardPins(boardId: string, page = 0): Observable<Pin[]> {
    return of(generateMockPins(20, page * 20)).pipe(delay(400));
  }

  getSearchPins(query: string, page = 0): Observable<Pin[]> {
    return of(generateMockPins(20, page * 5)).pipe(delay(500));
  }

  getExplorePins(category?: string): Observable<Pin[]> {
    return of(generateMockPins(30, 5)).pipe(delay(400));
  }

  toggleSave(pin: Pin): Observable<boolean> {
    const isSaved = this.savedPins.has(pin.id);
    if (isSaved) {
      this.savedPins.delete(pin.id);
    } else {
      this.savedPins.add(pin.id);
    }
    return of(!isSaved).pipe(delay(200));
  }

  isSaved(pinId: string): boolean {
    return this.savedPins.has(pinId);
  }
}
