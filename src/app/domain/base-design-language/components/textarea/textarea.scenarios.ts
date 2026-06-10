import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { BuiTextarea } from './textarea.component';

// textarea.scenario.tsx — StatefulTextarea valor inicial + placeholder.
@Component({
  selector: 'bui-s-textarea',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiTextarea],
  template: `<bui-textarea value="initial value" placeholder="Uncontrolled textarea" />`,
})
export class TextareaScenario {}

// textarea-resize.scenario.tsx — resize="both".
@Component({
  selector: 'bui-s-textarea-resize',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiTextarea],
  template: `<bui-textarea value="initial value" placeholder="Uncontrolled textarea" resize="both" />`,
})
export class TextareaResizeScenario {}
