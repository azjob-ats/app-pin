import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  computed,
  inject,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { BuiIcon } from '../icon/icon.component';

/** Ícone "Grab" (2 barras) do baseweb — handle de arrasto. */
const GRAB =
  'M5 8C4.44775 8 4 8.44775 4 9C4 9.55225 4.44775 10 5 10H19C19.5522 10 20 9.55225 20 9C20 8.44775 19.5522 8 19 8H5ZM5 14C4.44775 14 4 14.4478 4 15C4 15.5522 4.44775 16 5 16H19C19.5522 16 20 15.5522 20 15C20 14.4478 19.5522 14 19 14H5Z';

interface DragState {
  index: number;
  startY: number;
  height: number;
  dy: number;
}

/**
 * Dnd list — clone de `baseui/dnd-list` (StatefulList). Lista reordenável `ul > li` com
 * handle (ícone Grab) + label `font300`(ParagraphMedium).
 *
 * **Independência Angular:** o `react-movable` do original foi reimplementado com **Pointer
 * Events** (sem lib): ao pegar (`pointerdown`) o item é "levantado" (segue o cursor, sombra,
 * cursor `grabbing`, borda `borderSelected`) e os demais **abrem espaço suavemente** (translateY
 * com transição); ao soltar, o item desliza para o vão e a lista é reordenada. Também há
 * **reordenação por teclado** (`Space`/`Enter` seleciona, `↑`/`↓` move) — paridade com o
 * react-movable. Nenhum token novo.
 */
@Component({
  selector: 'bui-dnd-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiIcon],
  styleUrl: './dnd-list.component.scss',
  template: `
    <ul class="bui-dnd-list__list" [class.bui-dnd-list--dragging]="drag() !== null">
      @for (item of itemsState(); track item; let i = $index) {
        <li
          class="bui-dnd-list__item"
          [class.bui-dnd-list__item--dragged]="drag()?.index === i"
          [class.bui-dnd-list__item--selected]="selected() === i"
          [style.transform]="transformFor(i)"
          [style.transition]="transitionFor(i)"
          [style.z-index]="drag()?.index === i ? 5 : null"
          tabindex="0"
          aria-roledescription="Draggable list item. Press space bar to lift, arrow keys to move, space bar again to drop."
          (pointerdown)="onPointerDown(i, $event)"
          (pointermove)="onPointerMove($event)"
          (pointerup)="onPointerUp()"
          (pointercancel)="onPointerUp()"
          (keydown)="onKeydown(i, $event)"
        >
          <div class="bui-dnd-list__handle"><bui-icon [d]="GRAB" [size]="24" color="#CCC" /></div>
          <div class="bui-dnd-list__label">{{ item }}</div>
        </li>
      }
    </ul>
  `,
  host: { class: 'bui-dnd-list' },
})
export class BuiDndList {
  readonly items = input<string[]>([]);
  readonly itemsChange = output<string[]>();

  private readonly host = inject(ElementRef);
  protected readonly GRAB = GRAB;
  protected readonly itemsState = linkedSignal(() => [...this.items()]);
  protected readonly drag = signal<DragState | null>(null);
  protected readonly selected = signal<number | null>(null);
  private readonly settling = signal(false);

  /** Índice de destino calculado pelo deslocamento vertical. */
  protected readonly targetIndex = computed(() => {
    const d = this.drag();
    if (!d) return -1;
    const n = this.itemsState().length;
    return Math.max(0, Math.min(n - 1, d.index + Math.round(d.dy / d.height)));
  });

  /** translateY de cada item: o arrastado segue o cursor; os demais abrem o vão. */
  protected transformFor(i: number): string | null {
    const d = this.drag();
    if (!d) return null;
    if (i === d.index) return `translateY(${d.dy}px)`;
    const t = this.targetIndex();
    if (d.index < t && i > d.index && i <= t) return `translateY(${-d.height}px)`;
    if (d.index > t && i >= t && i < d.index) return `translateY(${d.height}px)`;
    return null;
  }

  /** O arrastado acompanha o ponteiro sem transição (1:1); na soltura, desliza. Os demais animam. */
  protected transitionFor(i: number): string | null {
    const d = this.drag();
    if (!d) return null;
    if (i === d.index) return this.settling() ? 'transform 0.18s ease' : 'none';
    return 'transform 0.2s ease';
  }

  protected onPointerDown(i: number, e: PointerEvent): void {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const li = e.currentTarget as HTMLElement;
    li.setPointerCapture(e.pointerId);
    this.selected.set(null);
    this.drag.set({ index: i, startY: e.clientY, height: li.offsetHeight, dy: 0 });
  }

  protected onPointerMove(e: PointerEvent): void {
    const d = this.drag();
    if (!d) return;
    this.drag.set({ ...d, dy: e.clientY - d.startY });
  }

  protected onPointerUp(): void {
    const d = this.drag();
    if (!d) return;
    const t = this.targetIndex();
    // desliza o item arrastado até o vão e então confirma a reordenação
    this.settling.set(true);
    this.drag.set({ ...d, dy: (t - d.index) * d.height });
    setTimeout(() => {
      this.move(d.index, t);
      this.drag.set(null);
      this.settling.set(false);
    }, 180);
  }

  /** Reordenação por teclado (paridade com react-movable). */
  protected onKeydown(i: number, e: KeyboardEvent): void {
    const sel = this.selected();
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this.selected.set(sel === i ? null : i);
    } else if (sel !== null && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();
      const t = sel + (e.key === 'ArrowUp' ? -1 : 1);
      if (t < 0 || t >= this.itemsState().length) return;
      this.move(sel, t);
      this.selected.set(t);
      queueMicrotask(() => {
        const lis = this.host.nativeElement.querySelectorAll('.bui-dnd-list__item');
        (lis[t] as HTMLElement | undefined)?.focus();
      });
    } else if (e.key === 'Escape' && sel !== null) {
      this.selected.set(null);
    }
  }

  private move(from: number, to: number): void {
    if (from === to) return;
    const next = [...this.itemsState()];
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m);
    this.itemsState.set(next);
    this.itemsChange.emit(next);
  }
}
