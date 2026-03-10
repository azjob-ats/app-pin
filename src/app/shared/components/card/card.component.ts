import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content />`,
  styleUrl: './card.component.scss',
})
export class CardComponent {}

@Component({
  selector: 'app-card-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
})
export class CardHeaderComponent {}

@Component({
  selector: 'app-card-title',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
})
export class CardTitleComponent {}

@Component({
  selector: 'app-card-description',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
})
export class CardDescriptionComponent {}

@Component({
  selector: 'app-card-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
})
export class CardActionComponent {}

@Component({
  selector: 'app-card-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
})
export class CardContentComponent {}

@Component({
  selector: 'app-card-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
})
export class CardFooterComponent {}
