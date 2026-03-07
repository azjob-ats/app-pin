import { Component, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Pin } from '../../interfaces/pin.interface';
import { PinService } from '../../services/pin.service';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-pin-card',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, TooltipModule],
  templateUrl: './pin-card.component.html',
  styleUrl: './pin-card.component.scss',
})
export class PinCardComponent {
  readonly pin = input.required<Pin>();
  readonly saved = output<Pin>();
  readonly shared = output<Pin>();

  readonly isHovered = signal(false);
  readonly isSaved = signal(false);
  readonly isImageLoaded = signal(false);

  private readonly pinService = inject(PinService);

  onMouseEnter(): void {
    this.isHovered.set(true);
  }

  onMouseLeave(): void {
    this.isHovered.set(false);
  }

  onImageLoad(): void {
    this.isImageLoaded.set(true);
  }

  onSave(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.isSaved.update(v => !v);
    this.pinService.toggleSave(this.pin()).subscribe(saved => {
      this.isSaved.set(saved);
    });
    this.saved.emit(this.pin());
  }

  onShare(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.shared.emit(this.pin());
  }
}
