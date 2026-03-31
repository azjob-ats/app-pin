import {
  Component,
  ChangeDetectionStrategy,
  model,
  viewChild,
  contentChild,
  effect,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { DrawerComponent } from '@shared/components/drawer/drawer.component';
import { SideMenuComponent } from '@shared/components/side-menu/side-menu.component';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-drawer-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DrawerComponent, SideMenuComponent, ButtonComponent, NgTemplateOutlet],
  styleUrl: './drawer-menu.component.scss',
  template: `
    <app-drawer
      [(visible)]="visible"
      position="left"
      styleClass="drawer-menu-panel"
      [modal]="true">
      <ng-template #header>
        <div class="drawer-menu-header">
          <button
            class="drawer-menu-header__back"
            type="button"
            [attr.aria-label]="sideMenu()?.canGoBack() ? 'Voltar' : 'Fechar menu'"
            (click)="onBack()">
            <span class="material-symbols-rounded" aria-hidden="true">arrow_left_alt</span>
          </button>
          <span class="drawer-menu-header__title">{{ sideMenu()?.currentTitle() }}</span>
          <app-button
            variant="ghost"
            size="sm"
            shape="circle"
            icon="close"
            ariaLabel="Fechar"
            (clicked)="close()" />
        </div>
      </ng-template>

      <app-side-menu (closed)="close()" />

      <ng-template #footer>
        @if (footerTpl()) {
          <div class="drawer-menu-footer">
            <ng-container [ngTemplateOutlet]="footerTpl()!" />
          </div>
        }
      </ng-template>
    </app-drawer>
  `,
})
export class DrawerMenuComponent {
  readonly visible = model(false);
  readonly sideMenu = viewChild(SideMenuComponent);
  readonly footerTpl = contentChild<TemplateRef<unknown>>('drawerFooter');

  constructor() {
    effect(() => {
      if (!this.visible()) {
        this.sideMenu()?.reset();
      }
    });
  }

  onBack(): void {
    if (this.sideMenu()?.canGoBack()) {
      this.sideMenu()!.goBack();
    } else {
      this.close();
    }
  }

  close(): void {
    this.visible.set(false);
  }
}
