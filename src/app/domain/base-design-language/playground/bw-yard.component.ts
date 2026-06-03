import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewEncapsulation,
  computed,
  contentChild,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { BwYardCodeFn, BwYardControl, BwYardState } from './yard.model';

type YardTab = 'props' | 'overrides' | 'theme';

/**
 * Yard — explorador interativo (clone da experiência baseweb.design). Preview vivo
 * (template `#preview` recebendo estado + setter) + painel com abas Props / Style
 * Overrides / Theme. A aba Props gera controles do esquema e atualiza preview + código.
 */
@Component({
  selector: 'bdl-yard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [NgTemplateOutlet],
  templateUrl: './bw-yard.component.html',
  styleUrl: './bw-yard.component.scss',
  host: { class: 'bdl-yard' },
})
export class BwYardComponent {
  readonly controls = input.required<BwYardControl[]>();
  readonly code = input<BwYardCodeFn>();
  readonly overridesCode = input<string>('');
  readonly themeCode = input<string>('');

  protected readonly preview = contentChild.required<TemplateRef<unknown>>('preview');

  protected readonly tab = signal<YardTab>('props');
  protected readonly showAll = signal(false);
  protected readonly showCode = signal(false);

  protected readonly state = linkedSignal<BwYardState>(() => {
    const s: BwYardState = {};
    for (const c of this.controls()) if (c.type !== 'code') s[c.name] = c.default;
    return s;
  });

  protected readonly hasAdvanced = computed(() => this.controls().some((c) => c.advanced));
  protected readonly visibleControls = computed(() =>
    this.showAll() ? this.controls() : this.controls().filter((c) => !c.advanced),
  );
  protected readonly generatedCode = computed(() => {
    const fn = this.code();
    return fn ? fn(this.state()) : '';
  });

  protected boolVal(name: string): boolean {
    return !!this.state()[name];
  }
  protected strVal(name: string): string {
    return (this.state()[name] as string) ?? '';
  }
  protected update(name: string, value: unknown): void {
    this.state.update((s) => ({ ...s, [name]: value }));
  }
  protected onCheckbox(name: string, event: Event): void {
    this.update(name, (event.target as HTMLInputElement).checked);
  }
  protected onText(name: string, event: Event): void {
    this.update(name, (event.target as HTMLInputElement).value);
  }
  protected readonly setter = (name: string, value: unknown): void => this.update(name, value);
}
