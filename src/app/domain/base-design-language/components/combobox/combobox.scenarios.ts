import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BuiCombobox } from './combobox.component';
import { Button } from '../button/button.component';

type ColorOption = { label: string; id: string };

const colorOptions: ColorOption[] = [
  { label: 'AliceBlue', id: '#F0F8FF' },
  { label: 'AntiqueWhite', id: '#FAEBD7' },
  { label: 'Aqua', id: '#00FFFF' },
  { label: 'Aquamarine', id: '#7FFFD4' },
  { label: 'Azure', id: '#F0FFFF' },
  { label: 'Beige', id: '#F5F5DC' },
];

const manyColorOptions: ColorOption[] = [
  ...colorOptions,
  { label: 'IndianRed', id: 'CD5C5C' },
  { label: 'LightCoral', id: 'F08080' },
  { label: 'Salmon', id: 'FA8072' },
  { label: 'DarkSalmon', id: 'E9967A' },
  { label: 'LightSalmon', id: 'FFA07A' },
  { label: 'Crimson', id: 'DC143C' },
  { label: 'Red', id: 'FF0000' },
  { label: 'FireBrick', id: 'B22222' },
  { label: 'DarkRed', id: '8B0000' },
  { label: 'Pink', id: 'FFC0CB' },
  { label: 'LightPink', id: 'FFB6C1' },
  { label: 'HotPink', id: 'FF69B4' },
  { label: 'DeepPink', id: 'FF1493' },
  { label: 'MediumVioletRed', id: 'C71585' },
];

const mapToString = (o: unknown) => (o as ColorOption).label;

// combobox--combobox
@Component({
  selector: 'bui-combobox-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiCombobox],
  template: `
    <div style="width:375px;padding:12px 48px">
      <div style="margin-bottom:8px">
        <label for="combobox" style="font:var(--bw-font-LabelSmall);color:var(--bw-content-primary)">label</label>
      </div>
      <bui-combobox
        id="combobox"
        listBoxLabel="Color list"
        [value]="value()"
        [options]="options"
        [mapOptionToString]="mapToString"
        (valueChange)="value.set($event)"
      />
      <p style="font:var(--bw-font-ParagraphXSmall);color:var(--bw-content-secondary);margin-top:4px">caption</p>
    </div>
  `,
})
export class ComboboxScenario {
  readonly value = signal('');
  readonly options = colorOptions;
  readonly mapToString = mapToString;
}

// combobox--combobox-sizes
@Component({
  selector: 'bui-combobox-sizes-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiCombobox],
  template: `
    <div style="padding:12px 48px;display:flex;flex-direction:column;gap:16px">
      @for (size of sizes; track size) {
        <div>
          <p style="color:var(--bw-content-primary);margin-bottom:4px">{{ size }}</p>
          <div style="width:375px">
            <bui-combobox
              [value]="value()"
              [options]="options"
              [mapOptionToString]="mapToString"
              [size]="size"
              (valueChange)="value.set($event)"
            />
          </div>
        </div>
      }
    </div>
  `,
})
export class ComboboxSizesScenario {
  readonly value = signal('');
  readonly options = colorOptions;
  readonly mapToString = mapToString;
  readonly sizes = ['mini', 'compact', 'default', 'large'] as const;
}

// combobox--combobox-disabled
@Component({
  selector: 'bui-combobox-disabled-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiCombobox],
  template: `
    <div style="width:375px;padding:12px 48px">
      <bui-combobox
        disabled
        [value]="value()"
        [options]="options"
        [mapOptionToString]="mapToString"
        (valueChange)="value.set($event)"
      />
    </div>
  `,
})
export class ComboboxDisabledScenario {
  readonly value = signal('');
  readonly options = colorOptions;
  readonly mapToString = mapToString;
}

// combobox--combobox-search
@Component({
  selector: 'bui-combobox-search-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiCombobox],
  template: `
    <div style="width:375px;padding:12px 48px">
      <bui-combobox
        [value]="value()"
        [options]="filteredOptions()"
        [mapOptionToString]="mapToString"
        (valueChange)="onValueChange($event)"
      />
    </div>
  `,
})
export class ComboboxSearchScenario {
  readonly value = signal('');
  readonly mapToString = mapToString;

  filteredOptions(): ColorOption[] {
    return manyColorOptions.filter((o) =>
      o.label.toLowerCase().includes(this.value().toLowerCase()),
    );
  }

  onValueChange(v: string): void {
    this.value.set(v);
  }
}

// combobox--combobox-autocomplete-false
@Component({
  selector: 'bui-combobox-autocomplete-false-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiCombobox],
  template: `
    <div style="width:375px;padding:12px 48px">
      <div style="margin-bottom:8px">
        <label for="combobox-ac" style="font:var(--bw-font-LabelSmall);color:var(--bw-content-primary)">label</label>
      </div>
      <bui-combobox
        id="combobox-ac"
        [autocomplete]="false"
        [value]="value()"
        [options]="options"
        [mapOptionToString]="mapToString"
        (valueChange)="value.set($event)"
      />
      <p style="font:var(--bw-font-ParagraphXSmall);color:var(--bw-content-secondary);margin-top:4px">caption</p>
    </div>
  `,
})
export class ComboboxAutocompleteFalseScenario {
  readonly value = signal('');
  readonly options = colorOptions;
  readonly mapToString = mapToString;
}

// combobox--combobox-inline-text-search
@Component({
  selector: 'bui-combobox-inline-text-search-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiCombobox],
  template: `
    <div style="padding:12px 48px">
      <p style="font:var(--bw-font-ParagraphSmall);color:var(--bw-content-secondary);margin-bottom:8px">
        Type # to trigger channel autocomplete
      </p>
      <bui-combobox
        [autocomplete]="false"
        [value]="value()"
        [options]="channelOptions()"
        [mapOptionToString]="identityFn"
        (valueChange)="handleChange($event)"
      />
    </div>
  `,
})
export class ComboboxInlineTextSearchScenario {
  private readonly availableChannels = [
    'general', 'random', 'announcements', 'ask-me-anything',
    'movies', 'music', 'running', 'happy-place', 'friends',
  ];

  readonly value = signal('');
  readonly channelOptions = signal<string[]>([]);
  private searching = false;

  readonly identityFn = (o: unknown) => o as string;

  handleChange(nextInputValue: string): void {
    const lastChar = nextInputValue[nextInputValue.length - 1];

    if (lastChar === ' ') {
      this.searching = false;
      this.channelOptions.set([]);
      this.value.set(nextInputValue);
      return;
    }

    if (lastChar === '#') {
      this.searching = true;
      this.value.set(nextInputValue);
      this.channelOptions.set(this.availableChannels);
      return;
    }

    if (this.searching) {
      const idx = nextInputValue.lastIndexOf('#');
      const query = nextInputValue.substring(idx + 1);
      this.channelOptions.update((opts) =>
        opts.filter((o) => o.toLowerCase().includes(query.toLowerCase())),
      );
      this.value.set(nextInputValue);
      return;
    }

    this.value.set(nextInputValue);
  }
}

// combobox--combobox-async
@Component({
  selector: 'bui-combobox-async-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiCombobox],
  template: `
    <div style="width:375px;padding:12px 48px">
      <p style="font:var(--bw-font-ParagraphSmall);color:var(--bw-content-secondary);margin-bottom:8px">
        Type to search — simulates async fetch (200ms delay)
      </p>
      <bui-combobox
        [value]="value()"
        [options]="asyncOptions()"
        [mapOptionToString]="mapToString"
        (valueChange)="onSearch($event)"
      />
    </div>
  `,
})
export class ComboboxAsyncScenario {
  readonly value = signal('');
  readonly asyncOptions = signal<ColorOption[]>([]);
  readonly mapToString = mapToString;

  private _timer: ReturnType<typeof setTimeout> | null = null;

  onSearch(v: string): void {
    this.value.set(v);
    if (this._timer) clearTimeout(this._timer);
    if (!v) { this.asyncOptions.set([]); return; }
    this._timer = setTimeout(() => {
      this.asyncOptions.set(
        manyColorOptions.filter((o) => o.label.toLowerCase().includes(v.toLowerCase())),
      );
    }, 200);
  }
}

// combobox--combobox-replacement-node (approximation — Angular doesn't support dynamic node overrides)
@Component({
  selector: 'bui-combobox-replacement-node-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiCombobox],
  template: `
    <div style="width:375px;padding:12px 48px">
      <bui-combobox
        [value]="value()"
        [options]="options"
        [mapOptionToString]="mapToString"
        (valueChange)="value.set($event)"
      />
    </div>
  `,
})
export class ComboboxReplacementNodeScenario {
  readonly value = signal('');
  readonly options = colorOptions;
  readonly mapToString = mapToString;
}

// combobox--combobox-overrides (approximation — no style overrides in Angular)
@Component({
  selector: 'bui-combobox-overrides-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiCombobox],
  template: `
    <div style="width:375px;padding:12px 48px">
      <bui-combobox
        [value]="value()"
        [options]="options"
        [mapOptionToString]="mapToString"
        (valueChange)="value.set($event)"
      />
    </div>
  `,
})
export class ComboboxOverridesScenario {
  readonly value = signal('');
  readonly options = colorOptions;
  readonly mapToString = mapToString;
}

// combobox--combobox-form
@Component({
  selector: 'bui-combobox-form-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiCombobox, Button],
  template: `
    <div style="padding:12px 48px">
      <form (submit)="handleSubmit($event)" style="display:flex;gap:8px;align-items:flex-start">
        <div style="width:375px">
          <bui-combobox
            [value]="value()"
            [options]="options"
            [mapOptionToString]="mapToString"
            (valueChange)="value.set($event)"
          />
        </div>
        <bui-button type="submit">Search</bui-button>
      </form>
      @if (submitted()) {
        <p style="margin-top:8px;color:var(--bw-content-secondary)">Submitted: "{{ submitted() }}"</p>
      }
    </div>
  `,
})
export class ComboboxFormScenario {
  readonly value = signal('');
  readonly submitted = signal('');
  readonly options = colorOptions;
  readonly mapToString = mapToString;

  handleSubmit(e: Event): void {
    e.preventDefault();
    this.submitted.set(this.value());
  }
}

// combobox--combobox-form-control
@Component({
  selector: 'bui-combobox-form-control-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiCombobox],
  template: `
    <div style="width:375px;padding:12px 48px">
      <div style="margin-bottom:8px">
        <label for="combo" style="font:var(--bw-font-LabelSmall);color:var(--bw-content-primary)">label</label>
      </div>
      <bui-combobox
        id="combo"
        [value]="value()"
        [options]="options"
        [mapOptionToString]="mapToString"
        (valueChange)="value.set($event)"
      />
      <p style="font:var(--bw-font-ParagraphXSmall);color:var(--bw-content-secondary);margin-top:4px">caption</p>
    </div>
  `,
})
export class ComboboxFormControlScenario {
  readonly value = signal('');
  readonly options = colorOptions;
  readonly mapToString = mapToString;
}
