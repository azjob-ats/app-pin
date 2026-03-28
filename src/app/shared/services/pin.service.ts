import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Pin } from '@shared/interfaces/entity/pin';
import { PinsApi } from '@shared/apis/pins.api';
import { Comment } from '@shared/interfaces/entity/comment';

@Injectable({ providedIn: 'root' })
export class PinService {
  private readonly pinsApi = inject(PinsApi);

  getPins(page = 0, pageSize = 20): Observable<Pin[]> {
    return this.pinsApi.list(page + 1, pageSize).pipe(
      map((response) => response.data?.data ?? []),
    );
  }

  getFeed(page = 0, pageSize = 20): Observable<Pin[]> {
    return this.pinsApi.feed(page + 1, pageSize).pipe(
      map((response) => response.data?.data ?? []),
    );
  }

  getPinById(id: string): Observable<Pin> {
    return this.pinsApi.getById(id).pipe(
      map((response) => response.data!),
    );
  }

  getRelatedPins(pinId: string, limit = 12): Observable<Pin[]> {
    return this.pinsApi.getRelated(pinId, limit).pipe(
      map((response) => response.data?.data ?? []),
    );
  }

  getComments(pinId: string, page = 1, pageSize = 10): Observable<Comment[]> {
    return this.pinsApi.getComments(pinId, page, pageSize).pipe(
      map((response) => response.data?.data ?? []),
    );
  }

  addComment(pinId: string, text: string): Observable<Comment> {
    return this.pinsApi.addComment(pinId, text).pipe(
      map((response) => response.data!),
    );
  }

  getUserPins(userId: string, page = 0): Observable<Pin[]> {
    return this.pinsApi.list(page + 1, 20).pipe(
      map((response) => response.data?.data ?? []),
    );
  }

  getBoardPins(boardId: string, page = 0): Observable<Pin[]> {
    return this.pinsApi.list(page + 1, 20).pipe(
      map((response) => response.data?.data ?? []),
    );
  }

  getSearchPins(
    query: string,
    filters: Record<string, string | string[]> = {},
    page = 0,
  ): Observable<Pin[]> {
    const flatFilters: Record<string, string> = {};
    for (const [k, v] of Object.entries(filters)) {
      flatFilters[k] = Array.isArray(v) ? v.join(',') : v;
    }
    return this.pinsApi.list(page + 1, 20, query, flatFilters).pipe(
      map((response) => response.data?.data ?? []),
    );
  }

  getExplorePins(category?: string): Observable<Pin[]> {
    return this.pinsApi.feed(1, 30).pipe(
      map((response) => response.data?.data ?? []),
    );
  }

  toggleSave(pin: Pin): Observable<boolean> {
    return this.pinsApi.toggleSave(pin.id).pipe(
      map((response) => response.data?.isSaved ?? false),
    );
  }
}
