import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import { BuiProgressSteps, BuiStep, BuiNumberedStep } from './progress-steps.component';
import { Button } from '../button/button.component';
import { BwTypography } from '../typography/typography.directive';

/** Scenarios portadas de `src/progress-steps/__tests__/*.scenario.tsx`. */

// progress-steps.scenario.tsx — 3 Steps (dot), current stateful (inicial 0).
@Component({
  selector: 'bui-s-progress-steps',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiProgressSteps, BuiStep, Button, BwTypography],
  template: `<bui-progress-steps [current]="current()">
    <li buiStep title="Create Account">
      <div buiTypo="ParagraphMedium">Here is some step content</div>
      <bui-button (click)="current.set(1)">Next</bui-button>
    </li>
    <li buiStep title="Verify Payment">
      <div buiTypo="ParagraphMedium">Here is some more content</div>
      <bui-button (click)="current.set(0)">Previous</bui-button>
      <bui-button (click)="current.set(2)">Next</bui-button>
    </li>
    <li buiStep title="Add Payment Method">
      <div buiTypo="ParagraphMedium">Here too!</div>
      <bui-button (click)="current.set(1)">Previous</bui-button>
    </li>
  </bui-progress-steps>`,
})
export class ProgressStepsScenario {
  protected readonly current = signal(0);
}

// progress-steps-isActive.scenario.tsx — current=1, todos isActive (conteúdo sempre visível).
@Component({
  selector: 'bui-s-progress-steps-is-active',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiProgressSteps, BuiStep, BwTypography],
  template: `<bui-progress-steps [current]="1">
    <li buiStep title="Step 1" isActive><div buiTypo="ParagraphLarge">Content should be visible, due to the isActive prop</div></li>
    <li buiStep title="Step 2" isActive><div buiTypo="ParagraphLarge">Content should be visible, due to the isActive prop</div></li>
    <li buiStep title="Step 3" isActive><div buiTypo="ParagraphLarge">Content should be visible, due to the isActive prop</div></li>
  </bui-progress-steps>`,
})
export class ProgressStepsIsActiveScenario {}

// numbered-steps.scenario.tsx — 3 NumberedSteps, current stateful (inicial 0).
@Component({
  selector: 'bui-s-numbered-steps',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiProgressSteps, BuiNumberedStep, Button, BwTypography],
  template: `<bui-progress-steps [current]="current()">
    <li buiNumberedStep title="Create Account">
      <div buiTypo="ParagraphMedium">Here is some step content</div>
      <bui-button (click)="current.set(1)">Next</bui-button>
    </li>
    <li buiNumberedStep title="Verify Payment">
      <div buiTypo="ParagraphMedium">Here is some more content</div>
      <bui-button (click)="current.set(0)">Previous</bui-button>
      <bui-button (click)="current.set(2)">Next</bui-button>
    </li>
    <li buiNumberedStep title="Add Payment Method">
      <div buiTypo="ParagraphMedium">Here too!</div>
      <bui-button (click)="current.set(1)">Previous</bui-button>
    </li>
  </bui-progress-steps>`,
})
export class NumberedStepsScenario {
  protected readonly current = signal(0);
}

// progress-steps-number.scenario.tsx — igual ao numbered-steps (class component no original).
@Component({
  selector: 'bui-s-progress-steps-number',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiProgressSteps, BuiNumberedStep, Button, BwTypography],
  template: `<bui-progress-steps [current]="current()">
    <li buiNumberedStep title="Create Account">
      <div buiTypo="ParagraphMedium">Here is some step content</div>
      <bui-button (click)="current.set(1)">Next</bui-button>
    </li>
    <li buiNumberedStep title="Verify Payment">
      <div buiTypo="ParagraphMedium">Here is some more content</div>
      <bui-button (click)="current.set(2)">Next</bui-button>
    </li>
    <li buiNumberedStep title="Add Payment Method">
      <div buiTypo="ParagraphMedium">Here too!</div>
      <bui-button (click)="current.set(1)">Previous</bui-button>
    </li>
  </bui-progress-steps>`,
})
export class ProgressStepsNumberScenario {
  protected readonly current = signal(0);
}

// numbered-steps-icon-overrides.scenario.tsx — reusa numbered-steps (overrides de ícone = API React).
@Component({
  selector: 'bui-s-numbered-steps-icon-overrides',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [NumberedStepsScenario],
  template: `<bui-s-numbered-steps />`,
})
export class NumberedStepsIconOverridesScenario {}

// progress-step-overrides.scenario.tsx — 1 Step com override (aproximação).
@Component({
  selector: 'bui-s-progress-step-overrides',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiProgressSteps, BuiStep, BwTypography],
  template: `<bui-progress-steps [current]="0">
    <li buiStep title="Create Account"><div buiTypo="ParagraphMedium">Here is some step content</div></li>
  </bui-progress-steps>`,
})
export class ProgressStepOverridesScenario {}
