/** Controle ("knob") do Yard — explorador interativo de props (estilo baseweb.design). */
export type BwYardControl =
  | { name: string; label?: string; type: 'boolean'; default: boolean; advanced?: boolean }
  | { name: string; label?: string; type: 'enum'; options: string[]; default: string; advanced?: boolean }
  | { name: string; label?: string; type: 'string'; default: string; placeholder?: string; advanced?: boolean }
  | { name: string; label?: string; type: 'code'; value: string; advanced?: boolean };

export type BwYardState = Record<string, unknown>;
export type BwYardCodeFn = (state: BwYardState) => string;
