import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import { Avatar } from './avatar.component';

/** Scenarios portadas de `src/avatar/__tests__/*.scenario.tsx`. */

const SIZES = ['scale800', 'scale1000', 'scale1200', 'scale1400', '64px'];
const IMG = '/assets/bw/adorable.png';

// avatar.scenario.tsx — 5 tamanhos com imagem que carrega.
@Component({
  selector: 'bui-s-avatar', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Avatar],
  template: `@for (size of sizes; track size; let i = $index) {
    <bui-avatar [name]="'user name # ' + i" [size]="size" [src]="img" />
  }`,
})
export class AvatarScenario {
  protected readonly sizes = SIZES;
  protected readonly img = IMG;
}

// avatar-custom-initials.scenario.tsx — iniciais explícitas, sem imagem.
@Component({
  selector: 'bui-s-avatar-custom-initials', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Avatar],
  template: `<bui-avatar name="Product - Marketplace" initials="PM" />`,
})
export class CustomInitialsScenario {}

// avatar-error.scenario.tsx — src inválido → estado de erro (iniciais sobre fundo inverso).
@Component({
  selector: 'bui-s-avatar-error', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Avatar],
  template: `@for (size of sizes; track size) {
    <bui-avatar name="username" [size]="size" src="https://not-a-real-image.png" />
  }`,
})
export class ErrorScenario {
  protected readonly sizes = SIZES;
}

// avatar-no-src.scenario.tsx — sem src → iniciais.
@Component({
  selector: 'bui-s-avatar-no-src', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Avatar],
  template: `@for (size of sizes; track size) {
    <bui-avatar name="username" [size]="size" />
  }`,
})
export class NoSrcScenario {
  protected readonly sizes = SIZES;
}

// avatar-update-image.scenario.tsx — botão alterna entre iniciais e imagem.
@Component({
  selector: 'bui-s-avatar-update-image', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Avatar],
  template: `<div>
    <div><button type="button" (click)="toggle()">toggle image</button></div>
    <bui-avatar name="user name" [src]="display() ? src : undefined" />
  </div>`,
})
export class UpdateImageScenario {
  protected readonly src = 'https://avatars.dicebear.com/api/human/yard.svg?width=285&mood=happy';
  protected readonly display = signal(false);
  protected toggle(): void {
    this.display.update((v) => !v);
  }
}
