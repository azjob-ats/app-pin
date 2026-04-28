import { Injectable } from '@angular/core';
import { Post } from '@shared/interfaces/entity/post';
import {
  WinningSlot,
  WinningSlotAspectRatio,
} from '@shared/interfaces/entity/winning-slot';

export type ComposedFeedItem =
  | { kind: 'post'; data: Post }
  | { kind: 'winning-slot'; data: WinningSlot };

export interface ComposeFeedOptions {
  /** Total de colunas da grid (ex.: 6 desktop, 2 mobile). */
  columns: number;
  /**
   * Resolve quantas colunas o card ocupa para um dado aspect ratio.
   * Default assume layout 6 col: 16:9 → 3, 9:16 → 1.
   */
  spanFor?: (aspect: string, columns: number) => number;
}

const DEFAULT_SPAN: Required<ComposeFeedOptions>['spanFor'] = (aspect, columns) => {
  if (aspect === '16:9') {
    if (columns >= 6) return 3;
    if (columns >= 4) return 2;
    return Math.max(2, Math.floor(columns / 2));
  }
  return 1;
};

interface RowPattern {
  /** Quantidade de cards 16:9 (horizontal) na linha. */
  h: number;
  /** Quantidade de cards 9:16 (vertical) na linha. */
  v: number;
}

/**
 * Tabela determinística de preenchimento. Dada a contagem (H, V) da linha
 * incompleta, lista os aspect ratios a inserir, na ordem em que devem entrar
 * no final da linha.
 *
 * Pressuposto: grid de 6 colunas com H=3 col e V=1 col.
 */
const FILL_RULES: ReadonlyArray<{
  pattern: RowPattern;
  fill: ReadonlyArray<WinningSlotAspectRatio>;
}> = [
  // Regra 1 — (H=1, V=0): só um horizontal na linha → completa com mais 1 H.
  { pattern: { h: 1, v: 0 }, fill: ['16:9'] },
  // Regra 2 — (H=0, V=1): apenas um vertical → adiciona 2 V (linha = 3V).
  { pattern: { h: 0, v: 1 }, fill: ['9:16', '9:16'] },
  // Regra 3 — (H=1, V=1): pareia com 2 V → 1H + 3V.
  { pattern: { h: 1, v: 1 }, fill: ['9:16', '9:16'] },
  // Regra 4 — (H=1, V=2): falta 1 V → 1H + 3V.
  { pattern: { h: 1, v: 2 }, fill: ['9:16'] },
  // Regra 5 — (H=0, V=2): adiciona 1 H → 1H + 2V.
  { pattern: { h: 0, v: 2 }, fill: ['16:9'] },
  // Regra 6 — (H=0, V=3): adiciona 1 H → 1H + 3V.
  { pattern: { h: 0, v: 3 }, fill: ['16:9'] },
  // Regra 7 — (H=0, V=4): adiciona 2 V → 6V (linha cheia de verticais).
  { pattern: { h: 0, v: 4 }, fill: ['9:16', '9:16'] },
];

/**
 * Compõe o feed final aplicando regras determinísticas de preenchimento de
 * gaps por linha. Não dispara requisições — opera sobre o pool já carregado.
 *
 * Regras globais:
 *  - Linha única no grid → não preenche.
 *  - Múltiplas linhas → não preenche a ÚLTIMA linha.
 *  - Linhas intermediárias incompletas → consulta FILL_RULES.
 *  - As regras assumem grid 6 col (H=3, V=1). Para layouts diferentes
 *    (ex.: mobile 2 col), o fill é desabilitado preservando os posts.
 */
@Injectable({ providedIn: 'root' })
export class FeedComposerService {
  composeFeedWithWinningSlots(
    posts: Post[],
    winningSlots: WinningSlot[],
    options: ComposeFeedOptions,
  ): ComposedFeedItem[] {
    const columns = Math.max(1, options.columns);
    const spanFor = options.spanFor ?? DEFAULT_SPAN;

    const rows = this.packRows(posts, columns, spanFor);
    const cursor = new SlotCursor(winningSlots);
    const rulesEnabled = this.areFillRulesApplicable(columns, spanFor);

    return this.assembleFeed(rows, cursor, rulesEnabled);
  }

  /** Distribui posts em linhas respeitando a capacidade da grid. */
  private packRows(
    posts: ReadonlyArray<Post>,
    capacity: number,
    spanFor: NonNullable<ComposeFeedOptions['spanFor']>,
  ): Post[][] {
    const rows: Post[][] = [];
    let row: Post[] = [];
    let used = 0;

    for (const post of posts) {
      const span = Math.min(capacity, spanFor(post.media.aspectRatio, capacity));
      if (used + span > capacity) {
        if (row.length) rows.push(row);
        row = [];
        used = 0;
      }
      row.push(post);
      used += span;
    }
    if (row.length) rows.push(row);

    return rows;
  }

  /** Conta H (16:9) e V (9:16) na linha. */
  private detectRowPattern(row: ReadonlyArray<Post>): RowPattern {
    let h = 0;
    let v = 0;
    for (const post of row) {
      if (post.media.aspectRatio === '16:9') h++;
      else if (post.media.aspectRatio === '9:16') v++;
    }
    return { h, v };
  }

  /** Resolve o fill consultando a tabela determinística. */
  private decideRowFill(pattern: RowPattern): ReadonlyArray<WinningSlotAspectRatio> {
    const rule = FILL_RULES.find(
      (r) => r.pattern.h === pattern.h && r.pattern.v === pattern.v,
    );
    return rule ? rule.fill : [];
  }

  /** Monta o feed linear aplicando as regras globais (única / última linha). */
  private assembleFeed(
    rows: ReadonlyArray<ReadonlyArray<Post>>,
    cursor: SlotCursor,
    rulesEnabled: boolean,
  ): ComposedFeedItem[] {
    const out: ComposedFeedItem[] = [];
    const isSingleRow = rows.length === 1;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const isLastRow = i === rows.length - 1;

      for (const post of row) {
        out.push({ kind: 'post', data: post });
      }

      if (!rulesEnabled || isSingleRow || isLastRow) continue;

      const fill = this.decideRowFill(this.detectRowPattern(row));
      for (const aspect of fill) {
        const slot = cursor.takeByAspect(aspect);
        if (slot) out.push({ kind: 'winning-slot', data: slot });
      }
    }

    return out;
  }

  private areFillRulesApplicable(
    columns: number,
    spanFor: NonNullable<ComposeFeedOptions['spanFor']>,
  ): boolean {
    return columns === 6 && spanFor('16:9', columns) === 3 && spanFor('9:16', columns) === 1;
  }
}

/**
 * Cursor que serve slots por aspectRatio em round-robin. Os pools de cada
 * aspecto são independentes — esgotando, recicla. Slots reportados/bloqueados
 * são descartados na construção.
 */
class SlotCursor {
  private readonly byAspect = new Map<WinningSlotAspectRatio, WinningSlot[]>();
  private readonly cursors = new Map<WinningSlotAspectRatio, number>();

  constructor(slots: ReadonlyArray<WinningSlot>) {
    for (const slot of slots) {
      if (slot.isBlocked || slot.isReported) continue;
      const key = slot.media.aspectRatio;
      const bucket = this.byAspect.get(key) ?? [];
      bucket.push(slot);
      this.byAspect.set(key, bucket);
      this.cursors.set(key, 0);
    }
  }

  takeByAspect(aspect: WinningSlotAspectRatio): WinningSlot | null {
    const bucket = this.byAspect.get(aspect);
    if (!bucket || !bucket.length) return null;
    const cursor = this.cursors.get(aspect) ?? 0;
    const slot = bucket[cursor % bucket.length];
    this.cursors.set(aspect, cursor + 1);
    return slot;
  }
}
