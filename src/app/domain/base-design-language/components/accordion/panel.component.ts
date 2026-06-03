import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
  linkedSignal,
  output,
} from '@angular/core';

let panelId = 0;

/**
 * Panel — fiel a `baseui/accordion` Panel. Controlado (`expanded`) ou não-controlado
 * (`initialExpanded`). Header com chevron que rotaciona; conteúdo anima a altura.
 */
@Component({
  selector: 'bui-panel',
  exportAs: 'buiPanel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss',
  host: { class: 'bui-panel' },
})
export class Panel {
  readonly title = input.required<string>();
  /** Controlado: se definido, o estado vem de fora. */
  readonly expanded = input<boolean | undefined>(undefined);
  /** Não-controlado: estado inicial. */
  readonly initialExpanded = input(false);
  readonly disabled = input(false);

  readonly expandedChange = output<boolean>();

  protected readonly contentId = `bui-panel-content-${panelId++}`;
  protected readonly headerId = `bui-panel-header-${panelId}`;

  private readonly internal = linkedSignal(() => this.initialExpanded());
  protected readonly isOpen = computed(() => this.expanded() ?? this.internal());

  protected toggle(): void {
    if (this.disabled()) return;
    const next = !this.isOpen();
    if (this.expanded() === undefined) {
      this.internal.set(next);
    }
    this.expandedChange.emit(next);
  }
}
