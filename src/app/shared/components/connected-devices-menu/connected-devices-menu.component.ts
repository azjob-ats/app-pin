import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { ButtonComponent } from '@shared/components/button/button.component';

interface Device {
  id: string;
  name: string;
  os: string;
  browser: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  icon: string;
}

const MOCK_DEVICES: Device[] = [
  {
    id: '1',
    name: 'Chrome no Windows',
    os: 'Windows 11',
    browser: 'Chrome 123',
    location: 'São Paulo, BR',
    lastActive: 'Agora',
    isCurrent: true,
    icon: 'laptop',
  },
  {
    id: '2',
    name: 'Safari no iPhone',
    os: 'iOS 17',
    browser: 'Safari 17',
    location: 'São Paulo, BR',
    lastActive: 'Há 2 horas',
    isCurrent: false,
    icon: 'smartphone',
  },
  {
    id: '3',
    name: 'Firefox no macOS',
    os: 'macOS Sonoma',
    browser: 'Firefox 124',
    location: 'Rio de Janeiro, BR',
    lastActive: 'Há 3 dias',
    isCurrent: false,
    icon: 'laptop_mac',
  },
  {
    id: '4',
    name: 'Chrome no Android',
    os: 'Android 14',
    browser: 'Chrome 123',
    location: 'Curitiba, BR',
    lastActive: 'Há 7 dias',
    isCurrent: false,
    icon: 'android',
  },
];

type RevokeStatus = 'idle' | 'revoking' | 'revoking-all';

@Component({
  selector: 'app-connected-devices-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
  styleUrl: './connected-devices-menu.component.scss',
  template: `
    <div class="connected-devices">

      <header class="connected-devices__hero">
        <span class="material-symbols-rounded connected-devices__hero-icon" aria-hidden="true">laptop_chromebook</span>
        <h1 class="connected-devices__hero-title">Dispositivos conectados</h1>
        <p class="connected-devices__hero-description">
          Veja e gerencie todos os dispositivos que acessaram sua conta.
          Encerre sessões suspeitas ou não reconhecidas.
        </p>
      </header>

      <section class="connected-devices__section" aria-labelledby="current-heading">
        <h2 id="current-heading" class="connected-devices__section-title">Sessão atual</h2>
        @if (currentDevice(); as device) {
          <div class="connected-devices__card connected-devices__card--current">
            <span class="material-symbols-rounded connected-devices__device-icon" aria-hidden="true">{{ device.icon }}</span>
            <div class="connected-devices__device-body">
              <strong class="connected-devices__device-name">{{ device.name }}</strong>
              <span class="connected-devices__device-meta">{{ device.os }} · {{ device.browser }}</span>
              <span class="connected-devices__device-meta">{{ device.location }}</span>
            </div>
            <span class="connected-devices__badge">Este dispositivo</span>
          </div>
        }
      </section>

      <section class="connected-devices__section" aria-labelledby="others-heading">
        <div class="connected-devices__section-header">
          <h2 id="others-heading" class="connected-devices__section-title">
            Outros dispositivos
            @if (otherDevices().length > 0) {
              <span class="connected-devices__count">{{ otherDevices().length }}</span>
            }
          </h2>
          @if (otherDevices().length > 0) {
            <app-button
              variant="outline"
              size="sm"
              [loading]="revokeStatus() === 'revoking-all'"
              (clicked)="revokeAll()"
            >
              Encerrar todas
            </app-button>
          }
        </div>

        @if (otherDevices().length === 0) {
          <div class="connected-devices__empty" role="status">
            <span class="material-symbols-rounded connected-devices__empty-icon" aria-hidden="true">devices_off</span>
            <p class="connected-devices__empty-text">Nenhum outro dispositivo conectado.</p>
          </div>
        } @else {
          <ul class="connected-devices__list" role="list">
            @for (device of otherDevices(); track device.id) {
              <li class="connected-devices__item">
                <span class="material-symbols-rounded connected-devices__device-icon" aria-hidden="true">{{ device.icon }}</span>
                <div class="connected-devices__device-body">
                  <strong class="connected-devices__device-name">{{ device.name }}</strong>
                  <span class="connected-devices__device-meta">{{ device.os }} · {{ device.browser }}</span>
                  <span class="connected-devices__device-meta">{{ device.location }} · {{ device.lastActive }}</span>
                </div>
                <app-button
                  variant="ghost"
                  size="sm"
                  [loading]="revokeStatus() === 'revoking' && revokingId() === device.id"
                  [ariaLabel]="'Encerrar sessão de ' + device.name"
                  (clicked)="revoke(device.id)"
                >
                  Encerrar
                </app-button>
              </li>
            }
          </ul>
        }
      </section>

      <section class="connected-devices__tips" aria-labelledby="tips-heading">
        <h2 id="tips-heading" class="connected-devices__tips-title">
          <span class="material-symbols-rounded" aria-hidden="true">security</span>
          Dicas de segurança
        </h2>
        <ul class="connected-devices__tips-list" role="list">
          <li class="connected-devices__tip">Encerre sessões em dispositivos que você não reconhece.</li>
          <li class="connected-devices__tip">Nunca compartilhe sua senha com outras pessoas.</li>
          <li class="connected-devices__tip">Em dispositivos públicos, sempre faça logout após o uso.</li>
        </ul>
      </section>

    </div>
  `,
})
export class ConnectedDevicesMenuComponent {
  readonly devices = signal<Device[]>(MOCK_DEVICES);
  readonly revokeStatus = signal<RevokeStatus>('idle');
  readonly revokingId = signal<string | null>(null);

  readonly currentDevice = computed(() => this.devices().find((d) => d.isCurrent) ?? null);
  readonly otherDevices = computed(() => this.devices().filter((d) => !d.isCurrent));

  revoke(id: string): void {
    this.revokeStatus.set('revoking');
    this.revokingId.set(id);
    setTimeout(() => {
      this.devices.update((ds) => ds.filter((d) => d.id !== id));
      this.revokeStatus.set('idle');
      this.revokingId.set(null);
    }, 900);
  }

  revokeAll(): void {
    this.revokeStatus.set('revoking-all');
    setTimeout(() => {
      this.devices.update((ds) => ds.filter((d) => d.isCurrent));
      this.revokeStatus.set('idle');
    }, 1000);
  }
}
