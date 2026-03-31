import {
  Component,
  ChangeDetectionStrategy,
  model,
  input,
  contentChild,
  TemplateRef,
  computed,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';

const PANEL_HIDDEN: Record<string, string> = {
  left: 'translateX(-110%)',
  right: 'translateX(110%)',
  top: 'translateY(-110%)',
  bottom: 'translateY(110%)',
};

@Component({
  selector: 'app-drawer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
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
        style({ transform: '{{from}}' }),
        animate('320ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'none' })),
      ], { params: { from: 'translateX(-110%)' } }),
      transition(':leave', [
        animate('260ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: '{{from}}' })),
      ], { params: { from: 'translateX(-110%)' } }),
    ]),
  ],
})
export class DrawerComponent {
  readonly visible = model(false);
  readonly position = input<'left' | 'right' | 'top' | 'bottom'>('left');
  readonly modal = input(true);
  readonly styleClass = input('');

  readonly headerTpl = contentChild<TemplateRef<unknown>>('header');
  readonly footerTpl = contentChild<TemplateRef<unknown>>('footer');

  readonly panelAnimParams = computed(() => ({
    value: '',
    params: { from: PANEL_HIDDEN[this.position()] },
  }));

  onBackdropClick(): void {
    if (this.modal()) {
      this.visible.set(false);
    }
  }
}
