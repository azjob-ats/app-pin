import {
  Component,
  ChangeDetectionStrategy,
  model,
  input,
  contentChild,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-bottom-sheet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  templateUrl: './bottom-sheet.component.html',
  styleUrl: './bottom-sheet.component.scss',
  animations: [
    trigger('backdropAnim', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('260ms ease', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('220ms ease', style({ opacity: 0 })),
      ]),
    ]),
    trigger('panelAnim', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('320ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'none' })),
      ]),
      transition(':leave', [
        animate('260ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateY(100%)' })),
      ]),
    ]),
  ],
})
export class BottomSheetComponent {
  readonly visible = model(false);
  readonly modal = input(true);
  readonly dismissible = input(true);
  readonly showHandle = input(true);
  readonly styleClass = input('');

  readonly headerTpl = contentChild<TemplateRef<unknown>>('header');
  readonly footerTpl = contentChild<TemplateRef<unknown>>('footer');

  onBackdropClick(): void {
    if (this.modal() && this.dismissible()) {
      this.visible.set(false);
    }
  }

  close(): void {
    this.visible.set(false);
  }
}
