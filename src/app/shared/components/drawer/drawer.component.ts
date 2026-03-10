import {
  Component,
  ChangeDetectionStrategy,
  model,
  input,
  contentChild,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-drawer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
})
export class DrawerComponent {
  readonly visible = model(false);
  readonly position = input<'left' | 'right' | 'top' | 'bottom'>('left');
  readonly modal = input(true);
  readonly styleClass = input('');

  readonly headerTpl = contentChild<TemplateRef<unknown>>('header');
  readonly footerTpl = contentChild<TemplateRef<unknown>>('footer');

  onBackdropClick(): void {
    if (this.modal()) {
      this.visible.set(false);
    }
  }
}
