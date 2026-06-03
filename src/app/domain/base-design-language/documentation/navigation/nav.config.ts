/** Caminho-base onde o site está montado. */
export const BW_BASE = '/bw';

/** routerLink absoluto a partir de um path relativo do nav. */
export function bwLink(path: string): string[] {
  return [BW_BASE, ...path.split('/').filter(Boolean)];
}
