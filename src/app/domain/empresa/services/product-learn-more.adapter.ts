import { Injectable } from '@angular/core';
import {
  FormElement,
  FormElementType,
  FormStructure,
} from '@shared/components/dynamic-form/interfaces/form-element.interface';
import { Product, ProductLearnMoreField } from '@shared/interfaces/entity/empresa-product';

const ENGINE_TYPES = new Set<FormElementType>([
  'text',
  'email',
  'select',
  'textarea',
  'checkbox',
  'checkboxAuthorize',
  'uploadFile',
  'textHTML',
]);

@Injectable({ providedIn: 'root' })
export class ProductLearnMoreAdapter {
  /**
   * Converts the Product's learn-more config (as defined in Etapa 3 do wizard)
   * into the FormStructure that the Dynamic Form Engine expects.
   *
   * Strategy:
   * - Each step in Product.learnMoreConfig becomes a separate FormStructure
   *   — for now we flatten to a single FormStructure (the first step), since
   *   the wizard currently emits a single step. Multi-step submission can be
   *   added later by wrapping in the existing GenericStepperComponent.
   */
  toFormStructure(product: Product): FormStructure {
    const config = product.learnMoreConfig;
    const elements: FormElement[] = [];
    for (const step of config.steps) {
      for (const field of step.fields) {
        elements.push(this.toElement(field));
      }
    }
    if (config.showCheckboxPrivacyPolicy) {
      elements.push({
        id: 'privacyPolicy',
        type: 'checkboxAuthorize',
        label: 'Concordo com a política de privacidade.',
        required: true,
        validators: {
          required: true,
          erroRequired: 'Você precisa aceitar a política de privacidade.',
        },
      });
    }
    return {
      id: `learn-more-${product.id}`,
      title: product.title,
      elements,
      layout: 'vertical',
    };
  }

  private toElement(field: ProductLearnMoreField): FormElement {
    const type: FormElementType = ENGINE_TYPES.has(field.type as FormElementType)
      ? (field.type as FormElementType)
      : 'text';
    const element: FormElement = {
      id: field.id,
      type,
      label: field.label,
      placeholder: field.placeholder,
      required: field.required,
      validators: {
        required: field.required,
        erroRequired: 'Campo obrigatório.',
        ...(type === 'email' ? { email: true } : {}),
      },
    };
    if (type === 'select' && field.options) {
      element.options = field.options.map((o) => ({ code: o.value, name: o.label }));
    }
    return element;
  }
}
