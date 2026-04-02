import {
  Directive,
  Input,
  OnChanges,
  Type,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { COMPONENTS, FormElement } from '../interfaces/form-element.interface';

@Directive({ selector: '[dynamicField]' })
export class DynamicFieldDirective implements OnChanges {
  @Input('element') element!: FormElement;
  @Input('form') form!: FormGroup;

  private readonly vcr = inject(ViewContainerRef);

  ngOnChanges(): void {
    if (!this.element || !this.form) return;

    const component: Type<unknown> | undefined = COMPONENTS[this.element.type];
    if (!component) return; // textHTML and unknown types are skipped gracefully

    this.vcr.clear();
    const ref = this.vcr.createComponent(component);
    ref.setInput('element', this.element);
    ref.setInput('form', this.form);
    ref.changeDetectorRef.detectChanges();
  }
}
