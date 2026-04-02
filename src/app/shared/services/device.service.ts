import { Injectable, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'large';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private breakpointObserver = inject(BreakpointObserver);

  deviceType$: Observable<DeviceType> = this.breakpointObserver
    .observe([
      '(max-width: 599px)',
      '(min-width: 600px) and (max-width: 1023px)',
      '(min-width: 1024px) and (max-width: 1599px)',
      '(min-width: 1600px)'
    ])
    .pipe(
      map(result => {
        if (result.breakpoints['(max-width: 599px)']) {
          return 'mobile';
        }
        if (result.breakpoints['(min-width: 600px) and (max-width: 1023px)']) {
          return 'tablet';
        }
        if (result.breakpoints['(min-width: 1600px)']) {
          return 'large';
        }
        return 'desktop';
      }),
      shareReplay(1)
    );

  // helpers opcionais
  isMobile$ = this.deviceType$.pipe(map(d => d === 'mobile'));
  isTablet$ = this.deviceType$.pipe(map(d => d === 'tablet'));
  isDesktop$ = this.deviceType$.pipe(map(d => d === 'desktop'));
  isLarge$ = this.deviceType$.pipe(map(d => d === 'large'));
}