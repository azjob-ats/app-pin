import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
  output,
} from '@angular/core';
export type MessageCardImageLayout = 'top' | 'trailing';
export type MessageCardButtonKind = 'secondary' | 'tertiary';
export type MessageCardBgType = 'light' | 'dark';

export interface MessageCardImage {
  src: string;
  ariaLabel?: string;
  layout?: MessageCardImageLayout;
  backgroundPosition?: string;
}

// Light primitive colors from Base Web (hex values from color-primitive-tokens.ts)
const LIGHT_COLORS = new Set([
  '#fff0ee','#ffd2cd','#ffb2ab','#ff9f95','#ff877d',  // red 50-400
  '#eaf6ed','#b6e4bf','#7fd99a','#58cc76','#1dbc4a',   // green 50-400
  '#e5f8fb','#c0f0f6','#88e3ef','#4dd3e5','#00bccf',   // teal 50-400
  '#eff4fe','#d9e7fd','#a9c9ff','#6da0f7','#448cf2',   // blue 50-400
  '#f8f2fe','#ead2ff','#ddb9ff','#c98cfc','#b66ef9',   // purple 50-400
  '#fef0fb','#fcd0f7','#f9b2f3','#f68fef','#f26ce9',   // magenta 50-400
  '#fff8f2','#fce7d6','#fdb58a','#fc9251','#f76b1d',   // orange 50-400
  '#fdfaf0','#f9f1c7','#f3e59a','#ecd64e','#e0c02a',   // lime 50-400
  '#f3f3f3','#e8e8e8','#dddddd','#c6c6c6','#a6a6a6',   // gray 50-400
  '#ffffff',  // white
  // yellow 50-400
  '#fdf2dc','#fce2b0','#f9d77d','#f6c940','#f4bc17',
  // brown 50-300
  '#f9f0e4','#edddc2','#d9c299','#c5a870',
  // cobalt 50-200
  '#eef3fe','#cdd8fb','#9db3f7',
  // platinum 50-400
  '#f0f4f9','#cad8ed','#a0b7de','#7498ce','#4d7fbe',
]);

function getBgType(color: string): MessageCardBgType {
  const lower = color.toLowerCase();
  return LIGHT_COLORS.has(lower) ? 'light' : 'dark';
}

@Component({
  selector: 'bui-message-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './message-card.component.scss',
  template: `
    <button
      class="bui-mc"
      [class.bui-mc--row]="isTrailing()"
      [class.bui-mc--light]="isLight()"
      [class.bui-mc--dark]="!isLight()"
      [class.bui-mc--clickable]="true"
      data-baseweb="message-card"
      [style.background-color]="backgroundColor()"
      (click)="cardClick.emit()"
    >
      @if (image()) {
        <div
          class="bui-mc__image"
          [class.bui-mc__image--top]="!isTrailing()"
          [class.bui-mc__image--trailing]="isTrailing()"
          role="img"
          [attr.aria-label]="image()!.ariaLabel"
          [style.background-image]="'url(' + image()!.src + ')'"
          [style.background-position]="image()!.backgroundPosition || 'center'"
        ></div>
      }
      <div class="bui-mc__content">
        @if (heading()) {
          <div class="bui-mc__heading">{{ heading() }}</div>
        }
        @if (paragraph()) {
          <div class="bui-mc__paragraph">{{ paragraph() }}</div>
        }
        @if (buttonLabel()) {
          <div
            class="bui-mc__btn"
            [class.bui-mc__btn--tertiary]="buttonKind() === 'tertiary'"
            [class.bui-mc__btn--secondary]="buttonKind() === 'secondary'"
            [style.color]="buttonColors()?.color"
            [style.background-color]="buttonColors()?.backgroundColor"
            aria-hidden="true"
          >{{ buttonLabel() }}</div>
        }
      </div>
    </button>
  `,
})
export class BuiMessageCard {
  readonly backgroundColor = input('#ffffff');
  readonly backgroundColorType = input<MessageCardBgType | null>(null);
  readonly buttonKind = input<MessageCardButtonKind>('secondary');
  readonly buttonLabel = input('');
  readonly heading = input('');
  readonly paragraph = input('');
  readonly image = input<MessageCardImage | null>(null);

  readonly cardClick = output<void>();

  readonly effectiveBgType = computed<MessageCardBgType>(() =>
    this.backgroundColorType() ?? getBgType(this.backgroundColor()),
  );

  readonly isLight = computed(() => this.effectiveBgType() === 'light');

  readonly isTrailing = computed(() => this.image()?.layout === 'trailing');

  readonly buttonColors = computed(() => {
    const kind = this.buttonKind();
    const bg = this.backgroundColor().toLowerCase();
    if (kind === 'tertiary' && !this.isLight()) {
      return { color: '#ffffff', backgroundColor: 'transparent' };
    }
    if (kind !== 'tertiary' && bg !== '#ffffff') {
      return { color: '#000000', backgroundColor: '#ffffff' };
    }
    return null;
  });
}
