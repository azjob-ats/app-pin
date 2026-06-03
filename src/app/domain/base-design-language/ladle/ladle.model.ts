import { Type } from '@angular/core';

/**
 * Uma story do Ladle. `id` segue o padrão Base Web `<grupo>--<nome>`
 * (ex.: `accordion--accordion`). `load` traz o componente da cena (lazy).
 */
export interface BwStory {
  id: string;
  group: string;
  name: string;
  load: () => Promise<Type<unknown>>;
}
