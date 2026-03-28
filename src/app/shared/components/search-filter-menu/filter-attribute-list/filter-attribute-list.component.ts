import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IAttribute } from '@shared/interfaces/entity/search-filter';

@Component({
  selector: 'app-filter-attribute-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filter-attribute-list.component.html',
  styleUrl: './filter-attribute-list.component.scss',
})
export class FilterAttributeListComponent {
  readonly attributes = input.required<IAttribute[]>();
  readonly resultCount = input<number | null>(null);
  readonly attributeSelect = output<IAttribute>();
  readonly close = output<void>();

  hasSelection(attribute: IAttribute): boolean {
    const v = attribute.selectedValue;
    if (v === undefined || v === null || v === '') return false;
    if (Array.isArray(v)) return v.length > 0;
    return true;
  }

  selectionLabel(attribute: IAttribute): string {
    const v = attribute.selectedValue;
    if (!v) return '';
    if (Array.isArray(v)) {
      return v
        .map((val) => attribute.filterComponent.options.find((o) => o.value === val)?.label ?? val)
        .join(', ');
    }
    return attribute.filterComponent.options.find((o) => o.value === v)?.label ?? String(v);
  }
}
