import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CurrentUserService {
  // TODO: substituir por leitura real (/api/users/me) quando auth existir
  private readonly handle = signal<string>('currentuser');

  readonly currentHandle = this.handle.asReadonly();

  isOwner = (handle: string): boolean =>
    !!handle && handle.toLowerCase() === this.handle().toLowerCase();

  ownerOf = (handle: string) => computed(() => this.isOwner(handle));

  setCurrentHandle(handle: string): void {
    this.handle.set(handle);
  }
}
