import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, signal } from '@angular/core';

/** Avatar — fiel ao baseui/avatar (círculo; imagem ou iniciais; size default 40px). */
@Component({
  selector: 'bui-avatar',
  exportAs: 'buiAvatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (src() && !failed()) {
      <img class="bui-avatar__img" [src]="src()" [alt]="name()" (error)="failed.set(true)" />
    } @else {
      <span class="bui-avatar__initials">{{ initials() }}</span>
    }
  `,
  styles: `
    bui-avatar {
      display:inline-flex; align-items:center; justify-content:center; overflow:hidden;
      box-sizing:border-box; border-radius:50%;
      width: var(--bui-avatar-size, 40px); height: var(--bui-avatar-size, 40px);
      background: var(--bw-background-tertiary); color: var(--bw-content-primary);
      font: var(--bw-font-LabelMedium);
    }
    .bui-avatar__img { width:100%; height:100%; object-fit:cover; }
  `,
  host: { '[style.--bui-avatar-size.px]': 'size()', '[attr.title]': 'name() || null' },
})
export class Avatar {
  readonly name = input<string>('');
  readonly src = input<string>('');
  readonly size = input<number>(40);

  protected readonly failed = signal(false);
  protected readonly initials = computed(() =>
    this.name().split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join(''),
  );
}

@Component({
  selector: 'bui-s-avatar', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Avatar],
  template: `<div style="display:flex; gap:16px; align-items:center;">
    <bui-avatar name="Ada Lovelace" [size]="24" />
    <bui-avatar name="Grace Hopper" [size]="40" />
    <bui-avatar name="Alan Turing" [size]="64" />
    <bui-avatar name="Broken" src="https://invalid.example/x.png" [size]="48" />
  </div>`,
})
export class AvatarScenario {}
