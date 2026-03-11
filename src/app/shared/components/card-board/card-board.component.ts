import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-card-board',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content />`,
  styleUrl: './card-board.component.scss',
})
export class CardBoardComponent {}

@Component({
  selector: 'app-card-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
})
export class CardContainerComponent {}

@Component({
  selector: 'app-card-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
})
export class CardHeaderComponent {}

@Component({
  selector: 'app-card-section-left',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
})
export class CardSectionLeftComponent {}

@Component({
  selector: 'app-card-section-right',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
})
export class CardSectionRightComponent {}

@Component({
  selector: 'app-card-body',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
})
export class CardBodyComponent {}
