import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

export type PaymentCardSize = 'mini' | 'compact' | 'default' | 'large';
export type PaymentCardType =
  | 'visa' | 'mastercard' | 'american-express' | 'diners-club'
  | 'discover' | 'jcb' | 'unionpay' | 'maestro' | 'elo' | 'uatp' | 'generic';

interface CardDefinition {
  type: PaymentCardType;
  gaps: number[];
  /** Max total digits */
  maxLength: number;
  test: (n: string) => boolean;
}

const CARDS: CardDefinition[] = [
  {
    type: 'american-express',
    gaps: [4, 10],
    maxLength: 15,
    test: (n) => /^3[47]/.test(n),
  },
  {
    type: 'diners-club',
    gaps: [4, 10],
    maxLength: 14,
    test: (n) => /^3(?:0[0-5]|[68])/.test(n),
  },
  {
    type: 'discover',
    gaps: [4, 8, 12],
    maxLength: 16,
    test: (n) => /^(?:6011|65|64[4-9]|622)/.test(n),
  },
  {
    type: 'jcb',
    gaps: [4, 8, 12],
    maxLength: 16,
    test: (n) => /^35(?:2[89]|[3-8])/.test(n),
  },
  {
    type: 'maestro',
    gaps: [4, 8, 12],
    maxLength: 19,
    test: (n) => /^(?:6304|6759|67677[06-9]|676[78])/.test(n),
  },
  {
    type: 'mastercard',
    gaps: [4, 8, 12],
    maxLength: 16,
    test: (n) => /^(?:5[1-5]|2[2-7])/.test(n),
  },
  {
    type: 'elo',
    gaps: [4, 8, 12],
    maxLength: 16,
    test: (n) =>
      /^(?:4011|4312|4389|4514|4576|5041|5066|5067|509|6277|6362|650[356]|6504[05-9]|6504[1-9]|6505[0-9]|6507|6509|651652|655)/.test(
        n,
      ),
  },
  {
    type: 'uatp',
    gaps: [4, 9],
    maxLength: 15,
    test: (n) => /^1/.test(n),
  },
  {
    type: 'unionpay',
    gaps: [4, 8, 12],
    maxLength: 19,
    test: (n) => /^62/.test(n),
  },
  {
    type: 'visa',
    gaps: [4, 8, 12],
    maxLength: 19,
    test: (n) => /^4/.test(n),
  },
];

function detectCard(digits: string): CardDefinition | null {
  return CARDS.find((c) => c.test(digits)) ?? null;
}

function sanitizeNumber(input: string, card: CardDefinition | null): string {
  const digits = input.replace(/\D/g, '');
  return digits.slice(0, card?.maxLength ?? 19);
}

function addGaps(gaps: number[], value: string): string {
  return gaps.reduce(
    (prev, gap, i) => `${prev.slice(0, gap + i)} ${prev.slice(gap + i)}`.trim(),
    value,
  );
}

function getCaretResult(
  rawInput: string,
  prevDigits: string,
  position: number,
  card: CardDefinition | null,
): [number, string] {
  const cleanValue = sanitizeNumber(rawInput, card);
  const gaps = card?.gaps ?? [];
  const valueWithGaps = addGaps(gaps, cleanValue);

  if (cleanValue.length > prevDigits.length && valueWithGaps[position - 1] === ' ') {
    return [position + 1, cleanValue];
  }

  const prevCard = detectCard(prevDigits);
  const prevGaps = prevCard?.gaps ?? [];
  const prevWithGaps = addGaps(prevGaps, prevDigits);
  if (prevDigits === cleanValue && prevWithGaps.length > rawInput.length) {
    const newRaw = prevWithGaps.slice(0, position - 1) + prevWithGaps.slice(position);
    return [position - 1, sanitizeNumber(newRaw, prevCard)];
  }

  return [position, cleanValue];
}

const ICON_SIZE: Record<PaymentCardSize, string> = {
  mini: '16px',
  compact: '24px',
  default: '32px',
  large: '40px',
};

const ICON_MARGIN: Record<PaymentCardSize, string> = {
  mini: 'var(--bw-sizing-scale300)',
  compact: 'var(--bw-sizing-scale500)',
  default: 'var(--bw-sizing-scale600)',
  large: 'var(--bw-sizing-scale700)',
};

/** Card icon component (SVG atlas) */
@Component({
  selector: 'bui-payment-card-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @switch (type()) {
      @case ('visa') {
        <svg [attr.width]="sz()" [attr.height]="sz()" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23 4H1V20H23V4Z" fill="#16216B"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12.98 14.5C11.99 14.5 11.34 14.21 10.87 13.95L11.53 13.01C11.95 13.23 12.28 13.48 13.04 13.48C13.28 13.48 13.52 13.42 13.65 13.21C13.84 12.9 13.61 12.73 13.06 12.45L12.79 12.29C11.98 11.78 11.63 11.3 12.01 10.45C12.25 9.90995 12.9 9.5 13.95 9.5C14.68 9.5 15.37 9.78996 15.76 10.08L15 10.91C14.61 10.62 14.29 10.47 13.92 10.47C13.63 10.47 13.4 10.57 13.32 10.72C13.17 10.99 13.37 11.17 13.79 11.41L14.11 11.6C15.09 12.17 15.32 12.77 15.08 13.33C14.67 14.28 13.84 14.5 12.98 14.5ZM18.62 11.5601C18.6 11.2101 18.59 10.7299 18.62 10.4399H18.6C18.52 10.6799 17.47 12.78 17.47 12.78H18.69L18.62 11.5601ZM18.78 14.36L18.74 13.65H17L16.64 14.36H15.12L17.87 9.60999H19.73L20.2 14.36H18.78ZM7.93 9.60999L6.67 11.63C6.35 12.16 6.16 12.43 6.07 12.76H6.06C6.08 12.34 6.02 11.82 6.01 11.52L5.87 9.60999H3.52L3.5 9.73999C4.1 9.73999 4.46 10.02 4.56 10.59L5.02 14.37H6.47L9.39 9.60999H7.93ZM8.55 14.36L10.11 9.59998H11.51L9.95 14.36H8.55Z" fill="#fff"/>
        </svg>
      }
      @case ('mastercard') {
        <svg [attr.width]="sz()" [attr.height]="sz()" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23 4H1V20H23V4Z" fill="#3F3F4E"/>
          <path d="M9 17C11.7614 17 14 14.7614 14 12C14 9.23858 11.7614 7 9 7C6.23858 7 4 9.23858 4 12C4 14.7614 6.23858 17 9 17Z" fill="#EB001A"/>
          <path d="M15 17C17.7614 17 20 14.7614 20 12C20 9.23858 17.7614 7 15 7C12.2386 7 10 9.23858 10 12C10 14.7614 12.2386 17 15 17Z" fill="#F79E1C"/>
          <path d="M12 15.98C13.1046 15.98 14 14.1981 14 12C14 9.80191 13.1046 8.02002 12 8.02002C10.8954 8.02002 10 9.80191 10 12C10 14.1981 10.8954 15.98 12 15.98Z" fill="#FF5F00"/>
        </svg>
      }
      @case ('american-express') {
        <svg [attr.width]="sz()" [attr.height]="sz()" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23 4H1V20H23V4Z" fill="#1071CC"/>
          <g clip-path="url(#bui-amex-clip)">
            <path d="M20.4052 6H23.0031V11.6554V13.3873L21.6423 14.8365L23.0031 16.268V18H20.8647L19.7689 16.7982L18.6909 18H11.657V12.3446H9.3772L12.1872 6H14.9089L15.8809 8.15611V6H19.2388L19.822 7.64359L20.4052 6Z" fill="#fff"/>
            <path d="M11.9926 11.6554H10.5081L12.6995 6.70691H14.4315L16.6053 11.5847V6.70691H18.7084L19.8218 9.76435L20.9175 6.70691H23.0029V11.6554H21.6598V8.24446L20.3873 11.6554H19.1855L17.9484 8.24446V11.6554H15.103L14.6612 10.6833H12.3991L11.9926 11.6554Z" fill="#1071CC"/>
            <path d="M14.2018 9.55227L13.5302 7.97937L12.8586 9.55227H14.2018Z" fill="#fff"/>
            <path d="M12.3992 17.3108V12.3623H18.3903L19.8042 13.9529L21.2534 12.3623H23.003L20.6702 14.8365L23.003 17.3108H21.2357L19.7688 15.7379L18.3373 17.3108H12.3992Z" fill="#1071CC"/>
            <path d="M13.7422 14.271V13.5288H16.6052L16.6229 12.3977L18.9381 14.8366L16.6052 17.2755V16.1444H13.7422V15.4021H16.5345V14.271H13.7422Z" fill="#fff"/>
          </g>
          <defs><clipPath id="bui-amex-clip"><rect width="14" height="14" fill="#fff" transform="translate(9 5)"/></clipPath></defs>
        </svg>
      }
      @case ('diners-club') {
        <svg [attr.width]="sz()" [attr.height]="sz()" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23 4H1V20H23V4Z" fill="#00AEEF"/>
          <path d="M13 6C12.66 6 11.34 6 11 6C7.69 6 5 8.69 5 12C5 15.31 7.69 18 11 18C11.34 18 12.66 18 13 18C16.31 18 19 15.31 19 12C19 8.69 16.31 6 13 6Z" fill="#0269A8"/>
          <path d="M11 7C8.24 7 6 9.24 6 12C6 14.76 8.24 17 11 17C13.76 17 16 14.76 16 12C16 9.24 13.76 7 11 7ZM7.5 12C7.5 10.33 8.68 8.93 10.25 8.59V15.42C8.68 15.07 7.5 13.67 7.5 12ZM11.75 15.41V8.57999C13.32 8.91999 14.5 10.32 14.5 11.99C14.5 13.66 13.32 15.07 11.75 15.41Z" fill="#fff"/>
        </svg>
      }
      @case ('discover') {
        <svg [attr.width]="sz()" [attr.height]="sz()" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23 4H1V20H23V4Z" fill="#E7E7E7"/>
          <path d="M3.54 12.4401C3.54 12.4401 4.74 12.5701 4.74 11.5201V11.5001C4.74 10.4401 3.54 10.58 3.54 10.58V12.4401ZM3 10.0701H3.93C4.49 10.0701 5.31 10.5801 5.31 11.4801V11.4901V11.5001C5.31 12.4001 4.49 12.9101 3.93 12.9101H3V10.0701Z" fill="#000"/>
          <path d="M6.13006 10.0701H5.56006V12.9201H6.13006V10.0701Z" fill="#000"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M7.87007 10.73C7.87007 10.73 7.68007 10.51 7.43007 10.51C7.18007 10.51 7.03007 10.68 7.03007 10.8C7.03007 10.92 7.03007 10.99 7.39007 11.14C7.75007 11.29 8.28007 11.4 8.28007 12.03C8.28007 12.66 7.78007 12.99 7.34007 12.99C6.63007 12.99 6.32007 12.45 6.32007 12.45L6.68007 12.09C6.68007 12.09 6.91007 12.47 7.30007 12.47C7.69007 12.47 7.71007 12.17 7.71007 12.07C7.71007 11.92 7.63007 11.78 7.38007 11.69C7.14007 11.6 6.47007 11.51 6.47007 10.87C6.47007 10.3 6.90007 10.01 7.38007 10.01C7.81007 10.01 8.18007 10.35 8.18007 10.35L7.87007 10.73Z" fill="#000"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M10.65 10.84C10.47 10.66 10.23 10.53 9.95996 10.53C9.41996 10.53 8.98996 10.96 8.98996 11.5C8.98996 12.04 9.41996 12.47 9.95996 12.47C10.23 12.47 10.48 12.34 10.65 12.16V12.83C10.44 12.94 10.21 13 9.95996 13C9.12996 13 8.45996 12.33 8.45996 11.5C8.45996 10.67 9.12996 10 9.95996 10C10.21 10 10.44 10.06 10.65 10.17V10.84Z" fill="#000"/>
          <path d="M13.75 10.0701H14.37L15.15 11.9401L15.89 10.0701H16.51L15.31 12.9901H14.95L13.75 10.0701Z" fill="#000"/>
          <path d="M19.2199 10.5401V11.3701H19.5299C19.7699 11.3701 19.9099 11.1601 19.9099 10.9701V10.9301C19.9099 10.7401 19.7599 10.5301 19.5299 10.5301H19.2199V10.5401ZM18.6699 10.0701H19.5999C19.8999 10.0701 20.4899 10.2301 20.4899 10.9101C20.4899 11.5901 19.8799 11.7301 19.8799 11.7301L20.7499 12.9201H20.0599L19.2899 11.7801H19.2299V12.9201H18.6699V10.0701Z" fill="#000"/>
          <path d="M18.25 11.1901V11.7001H17.28V12.4201H18.3V12.9201H16.72V10.0701H18.3V10.5701H17.28V11.1901H18.25Z" fill="#000"/>
          <path d="M12.3699 12.99C13.1873 12.99 13.8499 12.3274 13.8499 11.51C13.8499 10.6927 13.1873 10.03 12.3699 10.03C11.5525 10.03 10.8899 10.6927 10.8899 11.51C10.8899 12.3274 11.5525 12.99 12.3699 12.99Z" fill="#F58221"/>
        </svg>
      }
      @case ('jcb') {
        <svg [attr.width]="sz()" [attr.height]="sz()" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 4H15V16C15 18.21 13.21 20 11 20H9V8C9 5.79 10.79 4 13 4Z" fill="#BF2240"/>
          <path d="M8 4V16C8 18.21 6.21 20 4 20H1V8C1 5.79 2.79 4 5 4H8Z" fill="#1061A7"/>
          <path d="M23 4V16C23 18.21 21.21 20 19 20H16V8C16 5.79 17.79 4 20 4H23Z" fill="#43A946"/>
          <path d="M1 12.47C1.22 12.61 2.3 12.96 2.74 12.99C3.69 13.06 4.28 12.74 4.37 11.95V9.01001H6.47V11.89C6.36 13.54 4.91 13.87 2.71 13.76C2.14 13.73 1.37 13.58 1 13.49V12.47Z" fill="white"/>
          <path d="M9 9.77011C9.74 9.19011 10.94 8.91011 12.47 9.02011C13.34 9.09011 13.98 9.21009 14.33 9.31009V10.3401C13.94 10.1501 13.18 9.8601 12.55 9.8201C11.11 9.7201 10.36 10.3901 10.36 11.4801C10.36 12.4601 10.94 13.3001 12.55 13.1901C13.08 13.1501 13.96 12.8501 14.33 12.6701V13.6701C14.01 13.7701 13.01 13.9901 12.06 14.0001C10.64 14.0001 9.63 13.7001 9 13.2101V9.77011Z" fill="white"/>
          <path d="M16 9.01001H18.07C19.05 9.01001 20.01 9.28001 20.01 10.4C20.01 11.02 19.59 11.47 19 11.59V11.62C19.78 11.71 20.35 12.2 20.35 12.94C20.35 14.25 19.27 14.47 18.22 14.47H16V9.01001ZM17.77 11.28C18.42 11.28 18.69 11.04 18.69 10.56C18.69 10.08 18.42 9.88 17.77 9.88H17.33V11.28H17.77ZM17.81 13.59C18.54 13.59 18.91 13.33 18.91 12.77C18.91 12.21 18.54 11.99 17.81 11.99H17.33V13.59H17.81Z" fill="white"/>
        </svg>
      }
      @case ('unionpay') {
        <svg [attr.width]="sz()" [attr.height]="sz()" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 4V20H9.5L13.12 4H1Z" fill="#D0112B"/>
          <path d="M9.85999 4L6.23999 20H16.5L20.12 4H9.85999Z" fill="#002857"/>
          <path d="M22.9999 4H17.7599L14.1399 20H22.9999V4Z" fill="#007178"/>
          <path d="M18.0499 12.52C17.9699 12.52 17.9299 12.5 17.9299 12.45L17.9199 12.1899H17.2199C16.9999 12.1899 16.3199 12.21 16.1799 12.25C16.0099 12.29 15.8399 12.42 15.8399 12.42L15.9099 12.1899H15.2499L15.1099 12.65L14.4199 14.92H14.2999L14.1699 15.35H15.4799L15.4399 15.49H16.0799L16.1199 15.35H16.2999L16.4399 14.89H16.2599L16.9399 12.65H17.1599L17.2299 12.42L17.2399 12.6801C17.2299 12.8401 17.3599 12.98 17.6799 12.96H18.0599L18.1899 12.53H18.0499V12.52Z" fill="white"/>
          <path d="M15.6199 14.9H15.0999L15.2499 14.4H15.7699L15.6199 14.9Z" fill="white"/>
          <path d="M15.9199 13.9301C15.9199 13.9301 15.7599 13.95 15.6499 13.97C15.5399 14 15.3399 14.1 15.3399 14.1L15.5199 13.5H16.0399L15.9199 13.9301Z" fill="white"/>
          <path d="M16.1699 13.0699C16.1699 13.0699 16.0099 13.08 15.8999 13.11C15.7899 13.14 15.5999 13.23 15.5999 13.23L15.7699 12.66H16.2899L16.1699 13.0699Z" fill="white"/>
          <path d="M17.32 14.24H16.65L16.76 13.86H17.52L17.63 13.51H16.88L17.01 13.08H19.11L18.98 13.51H18.28L18.17 13.86H18.88L18.76 14.24H18L17.86 14.4H18.17L18.25 14.88C18.26 14.93 18.26 14.96 18.27 14.98C18.29 15 18.38 15.01 18.43 15.01H18.52L18.38 15.48H18.14C18.1 15.48 18.05 15.48 17.97 15.47C17.9 15.46 17.85 15.42 17.8 15.4C17.76 15.38 17.69 15.33 17.68 15.24L17.61 14.76L17.26 15.23C17.15 15.38 17 15.5 16.75 15.5H16.27L16.4 15.08H16.59C16.64 15.08 16.69 15.06 16.73 15.04C16.77 15.03 16.8 15.01 16.83 14.95L17.32 14.24Z" fill="white"/>
          <path d="M10.0001 13.1899H11.7701L11.6401 13.61H10.9301L10.8201 13.97H11.5401L11.4101 14.41H10.6901L10.5101 15C10.4901 15.06 10.6801 15.0699 10.7501 15.0699L11.1101 15.02L10.9601 15.5H10.1401C10.0701 15.5 10.0301 15.49 9.95011 15.47C9.88011 15.45 9.85011 15.42 9.82011 15.38C9.79011 15.33 9.74011 15.2899 9.78011 15.1899L10.0101 14.42H9.61011L9.74011 13.98H10.1401L10.2501 13.62H9.85011L10.0001 13.1899Z" fill="white"/>
          <path d="M11.1899 12.4301H11.9199L11.7899 12.87H10.7999L10.6899 12.96C10.6399 13 10.6299 12.99 10.5699 13.02C10.5099 13.05 10.3999 13.1 10.2399 13.1H9.91992L10.0499 12.6801H10.1499C10.2299 12.6801 10.2899 12.67 10.3099 12.66C10.3399 12.64 10.3799 12.59 10.4199 12.52L10.5999 12.1899H11.3199L11.1899 12.4301Z" fill="white"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5801 13.16C12.5801 13.16 12.7801 12.98 13.1201 12.92C13.2001 12.91 13.6801 12.91 13.6801 12.91L13.7501 12.67H12.7301L12.5801 13.16ZM13.5401 13.34H12.5301L12.4701 13.54H13.3501C13.4501 13.53 13.4701 13.54 13.4801 13.54L13.5401 13.34ZM12.2301 12.2H12.8501L12.7601 12.51C12.7601 12.51 12.9601 12.35 13.0901 12.3C13.2301 12.25 13.5301 12.2 13.5301 12.2L14.5301 12.1899L14.1901 13.33C14.1301 13.52 14.0701 13.65 14.0201 13.71C13.9801 13.77 13.9401 13.82 13.8501 13.87C13.7701 13.92 13.6901 13.94 13.6201 13.95C13.5501 13.95 13.4501 13.96 13.3101 13.96H12.3501L12.0801 14.86C12.0501 14.95 12.0401 14.99 12.0601 15.02C12.0701 15.04 12.1101 15.0601 12.1501 15.0601L12.5801 15.02L12.4301 15.51H11.9601C11.8101 15.51 11.7001 15.51 11.6201 15.5C11.5501 15.49 11.4701 15.5 11.4201 15.46C11.3801 15.42 11.3101 15.3699 11.3101 15.3199C11.3101 15.2699 11.3401 15.19 11.3701 15.08L12.2301 12.2Z" fill="white"/>
          <path d="M14.0301 14.03L13.9701 14.3C13.9501 14.39 13.9201 14.45 13.8601 14.5C13.7901 14.56 13.7101 14.62 13.5301 14.62L13.1901 14.63V14.9399C13.1901 15.0299 13.2101 15.02 13.2201 15.03C13.2401 15.05 13.2501 15.0501 13.2601 15.0601L13.3701 15.05L13.7001 15.03L13.5601 15.48H13.1801C12.9201 15.48 12.7201 15.47 12.6601 15.42C12.6001 15.38 12.5901 15.33 12.5901 15.24L12.6101 14.04H13.2101L13.2001 14.29H13.3401C13.3901 14.29 13.4201 14.29 13.4401 14.27C13.4601 14.26 13.4701 14.24 13.4801 14.21L13.5401 14.02H14.0301V14.03Z" fill="white"/>
        </svg>
      }
      @case ('maestro') {
        <svg [attr.width]="sz()" [attr.height]="sz()" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23 4H1V20H23V4Z" fill="#000166"/>
          <path d="M9 17C11.7614 17 14 14.7614 14 12C14 9.23858 11.7614 7 9 7C6.23858 7 4 9.23858 4 12C4 14.7614 6.23858 17 9 17Z" fill="#06C"/>
          <path d="M15 7C13.37 7 11.94 7.79 11.02 9H12.97C13.2 9.31 13.41 9.64 13.57 10H10.41C10.27 10.32 10.16 10.65 10.09 11H13.89C13.96 11.32 13.99 11.66 13.99 12H9.98999C9.98999 12.34 10.03 12.68 10.09 13H13.89C13.82 13.35 13.71 13.68 13.57 14H10.41C10.57 14.36 10.78 14.69 11.01 15H12.96C12.68 15.37 12.35 15.7 11.98 15.98C12.82 16.61 13.85 17 14.98 17C17.74 17 19.98 14.76 19.98 12C19.98 9.24 17.76 7 15 7Z" fill="#CC0001"/>
        </svg>
      }
      @case ('elo') {
        <svg [attr.width]="sz()" [attr.height]="sz()" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23 4H1V20H23V4Z" fill="#231F20"/>
          <path d="M6.13998 10.17C6.31998 10.11 6.51998 10.07 6.72998 10.07C7.62998 10.07 8.36998 10.71 8.54998 11.55L9.80998 11.3C9.51998 9.86003 8.24998 8.78003 6.72998 8.78003C6.37998 8.78003 6.04998 8.84003 5.72998 8.94003L6.13998 10.17Z" fill="#FFCB05"/>
          <path d="M4.64008 14.2899L5.50008 13.3199C5.11008 12.9799 4.87008 12.4799 4.87008 11.9299C4.87008 11.3799 5.11008 10.8799 5.49008 10.5399L4.64008 9.56995C3.99008 10.1499 3.58008 10.9899 3.58008 11.9299C3.58008 12.8699 3.99008 13.7099 4.64008 14.2899Z" fill="#00A4E0"/>
          <path d="M8.53998 12.3C8.36998 13.15 7.61998 13.78 6.72998 13.78C6.51998 13.78 6.32998 13.75 6.13998 13.68L5.72998 14.91C6.03998 15.02 6.37998 15.07 6.72998 15.07C8.24998 15.07 9.51998 13.99 9.81998 12.55L8.53998 12.3Z" fill="#EF4123"/>
          <path d="M15.6 9.62V13.3L16.17 13.53L15.84 14.29L15.21 14.03C15.07 13.97 14.97 13.87 14.9 13.77C14.83 13.66 14.78 13.51 14.78 13.31V9.62H15.6Z" fill="#fff"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M10.92 13.36C10.88 13.29 10.82 13.18 10.79 13.1C10.59 12.63 10.58 12.15 10.75 11.69C10.94 11.18 11.29 10.79 11.75 10.59C12.33 10.34 12.97 10.39 13.53 10.72C13.88 10.92 14.13 11.23 14.32 11.68C14.3328 11.7184 14.3498 11.7569 14.3655 11.7927C14.3744 11.8128 14.3828 11.832 14.39 11.85L10.92 13.36ZM12.08 11.34C11.67 11.52 11.46 11.9 11.5 12.36L13.24 11.61C12.94 11.26 12.55 11.14 12.08 11.34Z" fill="#fff"/>
          <path d="M13.46 12.98L13.42 12.96C13.32 13.13 13.15 13.27 12.95 13.35C12.56 13.52 12.2 13.48 11.94 13.25L11.92 13.29L11.48 13.95C11.59 14.03 11.71 14.09 11.83 14.14C12.32 14.34 12.82 14.33 13.31 14.12C13.67 13.97 13.95 13.73 14.14 13.43L13.46 12.98Z" fill="#fff"/>
          <path d="M17.44 11.57C17.22 11.77 17.08 12.05 17.08 12.36C17.08 12.67 17.22 12.95 17.44 13.14L16.85 13.8C16.45 13.45 16.2 12.93 16.2 12.36C16.2 11.79 16.45 11.27 16.85 10.92L17.44 11.57Z" fill="#fff"/>
          <path d="M18.13 13.4099C18.01 13.4099 17.9 13.3899 17.8 13.3599L17.52 14.1899C17.71 14.2499 17.92 14.2899 18.13 14.2899C19.06 14.2899 19.84 13.6299 20.01 12.7499L19.15 12.5699C19.05 13.0499 18.63 13.4099 18.13 13.4099Z" fill="#fff"/>
          <path d="M17.52 10.5399C17.71 10.4699 17.92 10.4399 18.13 10.4399C19.06 10.4399 19.83 11.0999 20.01 11.9899L19.15 12.1599C19.06 11.6799 18.64 11.3199 18.13 11.3199C18.02 11.3199 17.9 11.3399 17.8 11.3699L17.52 10.5399Z" fill="#fff"/>
        </svg>
      }
      @case ('uatp') {
        <svg [attr.width]="sz()" [attr.height]="sz()" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23 4H1V20H23V4Z" fill="#F0F0F0"/>
          <g clip-path="url(#bui-uatp-clip)">
            <path d="M10.5057 9.64723H10.1817H9.70679V10.9659L10.3044 12.6255L11.4708 12.133L10.5057 9.64723Z" fill="#0A2C1B"/>
            <path d="M6.34592 14.6471L6.34001 9.64723H5.07682V13.7451C4.94173 13.7928 4.80176 13.8253 4.65948 13.8421C4.38337 13.8743 3.9371 13.9265 3.60459 13.6339C3.27002 13.3394 3.26507 12.8846 3.26655 12.7802V9.64723H2.00336V12.7802C1.96122 13.7182 2.32658 14.1754 2.45948 14.3209C3.17638 15.1058 4.54287 14.9387 5.39513 14.8345C5.71171 14.7958 6.02491 14.7331 6.33204 14.6471L6.32786 14.6427L6.34592 14.6471Z" fill="#0A2C1B"/>
            <path d="M21.999 11.453C21.9951 11.2269 21.9447 10.4929 21.3738 10.0162C21.1483 9.82795 20.9283 9.75218 20.7469 9.6897C20.5867 9.63455 20.2633 9.54148 19.3754 9.58086C18.9585 9.59952 18.5429 9.64148 18.1306 9.70653V14.8388H19.3938V13.3179C19.4958 13.3263 19.6189 13.3331 19.7586 13.3337C19.9448 13.3351 20.1309 13.325 20.3158 13.3033C20.4802 13.2817 21.266 13.1786 21.709 12.5414C22.0104 12.1079 22.0024 11.6443 21.999 11.453ZM20.5118 11.9928C20.3546 12.1594 20.1557 12.1903 19.9414 12.2236C19.7608 12.2514 19.5768 12.2484 19.3972 12.2148V10.7433C19.4924 10.7303 19.5885 10.7245 19.6845 10.7259C19.9706 10.73 20.2799 10.7344 20.4943 10.9523C20.6881 11.1491 20.6983 11.4123 20.699 11.4747C20.6996 11.5392 20.6985 11.7948 20.5118 11.9928Z" fill="#0A2C1B"/>
            <path d="M10.4995 13.1673L11.1015 14.8388H12.5212L11.6926 12.7045C11.3054 12.8761 10.9077 13.0304 10.4995 13.1673Z" fill="#0A2C1B"/>
            <path d="M6.60772 13.6849C6.59882 13.6856 6.59 13.6828 6.58303 13.6773C6.57607 13.6717 6.57148 13.6637 6.57019 13.6548C6.56891 13.646 6.57102 13.637 6.5761 13.6297C6.58119 13.6223 6.58887 13.6172 6.59759 13.6153C7.44534 13.4378 8.27682 13.1899 9.08338 12.8742C12.0436 11.7142 12.5355 10.4597 14.7222 9.60822C17.2224 8.63467 19.7225 9.06335 20.7271 9.30762C20.7338 9.30921 20.7396 9.31329 20.7433 9.31903C20.7471 9.32476 20.7485 9.3317 20.7473 9.33844C20.746 9.34518 20.7423 9.35119 20.7368 9.35525C20.7313 9.35931 20.7244 9.3611 20.7176 9.36026C19.7189 9.24529 18.7085 9.28396 17.7216 9.47491C15.1767 9.96677 14.237 11.2345 11.9094 12.341C10.7268 12.9032 8.98995 13.517 6.60772 13.6849Z" fill="#3EB54A"/>
            <path d="M16.9918 9.64723H12.6013V10.7793H14.1649V14.8388H15.4281V10.7793H16.9918V9.64723Z" fill="#0A2C1B"/>
            <path d="M9.23192 9.64723H8.95198L6.93652 14.8388H8.31211L9.70682 10.9659V9.64723H9.23192Z" fill="#0A2C1B"/>
          </g>
          <defs><clipPath id="bui-uatp-clip"><rect width="20" height="5.92493" fill="white" transform="translate(2 9)"/></clipPath></defs>
        </svg>
      }
      @default {
        <svg [attr.width]="sz()" [attr.height]="sz()" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23 4H1V20H23V4Z" fill="#C9C9CD"/>
          <path d="M1 8H23V10H1V8Z" fill="#fff"/>
          <path d="M4 13H7V15H4V13Z" fill="#fff"/>
          <path d="M8 13H11V15H8V13Z" fill="#fff"/>
        </svg>
      }
    }
  `,
})
export class BuiPaymentCardIcon {
  readonly type = input<string>('generic');
  readonly size = input('32px');
  protected readonly sz = computed(() => this.size());
}

/**
 * PaymentCard — clone de baseui/payment-card.
 * Wraps bui-input visually: same CSS classes, adds card icon as start enhancer.
 * Manages caret position when gaps are inserted/removed.
 */
@Component({
  selector: 'bui-payment-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiPaymentCardIcon],
  styleUrl: './payment-card.component.scss',
  template: `
    <div
      class="bui-input"
      [class.bui-input--mini]="size() === 'mini'"
      [class.bui-input--compact]="size() === 'compact'"
      [class.bui-input--default]="size() === 'default'"
      [class.bui-input--large]="size() === 'large'"
      [class.bui-input--disabled]="disabled()"
      [class.bui-input--error]="error()"
      data-baseweb="payment-card-input"
    >
      <div class="bui-input__root">
        <div class="bui-pc__icon-wrapper" [style.margin-left]="iconMargin()">
          <bui-payment-card-icon [type]="cardType()" [size]="iconSize()" />
        </div>
        <div class="bui-input__container">
          <input
            #field
            class="bui-input__field"
            inputmode="numeric"
            autocomplete="cc-number"
            [value]="displayValue()"
            [attr.aria-label]="ariaLabel()"
            [disabled]="disabled()"
            (input)="onInput($event)"
          />
        </div>
      </div>
    </div>
  `,
})
export class BuiPaymentCard {
  readonly size = input<PaymentCardSize>('default');
  readonly value = input('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly error = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input('Please enter a debit or credit card number.');

  readonly valueChange = output<string>();

  private readonly field = viewChild<ElementRef<HTMLInputElement>>('field');
  private _prevDigits = '';

  readonly cardDef = computed(() => detectCard(this.value().replace(/\D/g, '')));
  readonly cardType = computed(() => this.cardDef()?.type ?? 'generic');

  readonly displayValue = computed(() =>
    addGaps(this.cardDef()?.gaps ?? [], this.value().replace(/\D/g, '')),
  );

  readonly iconSize = computed(() => ICON_SIZE[this.size()]);
  readonly iconMargin = computed(() => ICON_MARGIN[this.size()]);

  onInput(e: Event): void {
    const input = e.target as HTMLInputElement;
    const card = detectCard(input.value);
    const [newCaret, cleanValue] = getCaretResult(
      input.value,
      this._prevDigits,
      input.selectionStart ?? 0,
      card,
    );
    this._prevDigits = cleanValue;
    this.valueChange.emit(cleanValue);

    // Restore caret after Angular updates the DOM value
    queueMicrotask(() => {
      const el = this.field()?.nativeElement;
      if (el) el.setSelectionRange(newCaret, newCaret);
    });
  }
}

/**
 * StatefulPaymentCard — manages value state internally.
 */
@Component({
  selector: 'bui-stateful-payment-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiPaymentCard],
  template: `
    <bui-payment-card [value]="rawValue()" (valueChange)="rawValue.set($event)" />
  `,
})
export class BuiStatefulPaymentCard {
  readonly rawValue = signal('');
}
