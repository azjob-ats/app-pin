import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal, viewChild } from '@angular/core';
import { Select, type Option, type SelectOptions } from './select.component';
import { BuiModal, BuiModalHeader, BuiModalBody, BuiModalFooter, BuiModalButton } from '../modal/modal.component';
import { Button } from '../button/button.component';
import { BuiInput } from '../input/input.component';

/** Paleta padrão das stories (labelKey="id", valueKey="color"). */
const COLORS: Option[] = [
  { id: 'AliceBlue', color: '#F0F8FF' },
  { id: 'AntiqueWhite', color: '#FAEBD7' },
  { id: 'Aqua', color: '#00FFFF' },
  { id: 'Aquamarine', color: '#7FFFD4' },
  { id: 'Azure', color: '#F0FFFF' },
  { id: 'Beige', color: '#F5F5DC' },
];

const base = {
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
};

// select.scenario.tsx — stateful + loading + single + multi (com/sem disabled).
@Component({
  ...base,
  imports: [Select],
  selector: 'bui-s-select',
  template: `
    <bui-select [options]="opts" ariaLabel="Select a color" labelKey="id" valueKey="color" /><br />
    <bui-select [options]="opts" labelKey="id" valueKey="color" [disabled]="true" /><br />
    <bui-select [options]="opts" labelKey="id" valueKey="color" [isLoading]="true" /><br />
    <bui-select [options]="opts" labelKey="id" valueKey="color" [isLoading]="true" [disabled]="true" /><br />
    <bui-select [options]="opts" labelKey="id" valueKey="color" [value]="aqua" /><br />
    <bui-select [options]="opts" labelKey="id" valueKey="color" [value]="aqua" [disabled]="true" /><br />
    <bui-select [options]="opts" labelKey="id" valueKey="color" [multi]="true" [value]="aqua" /><br />
    <bui-select [options]="opts" labelKey="id" valueKey="color" [multi]="true" [value]="aqua" [disabled]="true" />
  `,
})
export class SelectScenario {
  protected readonly opts = COLORS;
  protected readonly aqua: Option[] = [{ color: '#00FFFF' }];
}

// select-sizes.scenario.tsx — mini/compact/default/large.
@Component({
  ...base,
  imports: [Select],
  selector: 'bui-s-select-sizes',
  template: `
    <bui-select [options]="opts" labelKey="id" valueKey="color" placeholder="Select a color" size="mini" /><br />
    <bui-select [options]="opts" labelKey="id" valueKey="color" placeholder="Select a color" size="compact" /><br />
    <bui-select [options]="opts" labelKey="id" valueKey="color" placeholder="Select a color" size="default" /><br />
    <bui-select [options]="opts" labelKey="id" valueKey="color" placeholder="Select a color" size="large" />
  `,
})
export class SelectSizesScenario {
  protected readonly opts = COLORS;
}

// select-sizes-selected-value.scenario.tsx — 4 sizes com valor, width 400.
@Component({
  ...base,
  imports: [Select],
  selector: 'bui-s-select-sizes-value',
  template: `
    <div style="width:400px">
      <bui-select [options]="opts" labelKey="id" valueKey="color" [value]="val" size="mini" /><br />
      <bui-select [options]="opts" labelKey="id" valueKey="color" [value]="val" size="compact" /><br />
      <bui-select [options]="opts" labelKey="id" valueKey="color" [value]="val" size="default" /><br />
      <bui-select [options]="opts" labelKey="id" valueKey="color" [value]="val" size="large" />
    </div>
  `,
})
export class SelectSizesValueScenario {
  protected readonly opts = COLORS;
  protected readonly val: Option[] = [{ color: '#F0FFFF' }];
}

// select-states.scenario.tsx — default / focused / positive / error / disabled.
@Component({
  ...base,
  imports: [Select],
  selector: 'bui-s-select-states',
  template: `
    <bui-select [options]="opts" labelKey="id" valueKey="color" placeholder="Select a color" /><br />
    <bui-select [options]="opts" labelKey="id" valueKey="color" placeholder="Select a color" [autoFocus]="true" /><br />
    <bui-select [options]="opts" labelKey="id" valueKey="color" placeholder="Select a color" [positive]="true" /><br />
    <bui-select [options]="opts" labelKey="id" valueKey="color" placeholder="Select a color" [error]="true" /><br />
    <bui-select [options]="opts" labelKey="id" valueKey="color" placeholder="Select a color" [disabled]="true" />
  `,
})
export class SelectStatesScenario {
  protected readonly opts = COLORS;
}

// select-open.scenario.tsx — startOpen (dois selects abertos).
@Component({
  ...base,
  imports: [Select],
  selector: 'bui-s-select-open',
  template: `
    <div>
      <bui-select [options]="o" [startOpen]="true" />
      <div style="overflow:auto;margin-top:200px;height:100%">
        <bui-select [options]="o" [startOpen]="true" />
      </div>
    </div>
  `,
})
export class SelectOpenScenario {
  protected readonly o: Option[] = [
    { id: 'a', label: 'hey!' },
    { id: 'b', label: 'are you listening?' },
    { id: 'c', label: 'look at me!' },
  ];
}

// select-search-single.scenario.tsx — type=search, opção disabled.
@Component({
  ...base,
  imports: [Select],
  selector: 'bui-s-select-search-single',
  template: `
    <bui-select [options]="opts" labelKey="id" valueKey="color" type="search" placeholder="Start searching" />
  `,
})
export class SelectSearchSingleScenario {
  protected readonly opts: Option[] = [
    { id: 'AliceBlue', color: '#F0F8FF' },
    { id: 'AntiqueWhite', color: '#FAEBD7', disabled: true },
    { id: 'Aqua', color: '#00FFFF' },
    { id: 'Aquamarine', color: '#7FFFD4' },
    { id: 'Azure', color: '#F0FFFF' },
    { id: 'Beige', color: '#F5F5DC' },
  ];
}

// select-search-multi.scenario.tsx — multi + search, closeOnSelect=false.
@Component({
  ...base,
  imports: [Select],
  selector: 'bui-s-select-search-multi',
  template: `
    <bui-select
      [options]="opts"
      labelKey="id"
      valueKey="color"
      type="search"
      [multi]="true"
      [closeOnSelect]="false"
    />
  `,
})
export class SelectSearchMultiScenario {
  protected readonly opts: Option[] = [
    ...COLORS,
    { id: 'DarkBlue', color: '#00008B' },
    { id: 'DarkCyan', color: '#008B8B' },
  ];
}

// select-creatable.scenario.tsx
@Component({
  ...base,
  imports: [Select],
  selector: 'bui-s-select-creatable',
  template: `
    <bui-select [options]="opts" labelKey="label" valueKey="id" [creatable]="true" [closeOnSelect]="false" />
  `,
})
export class SelectCreatableScenario {
  protected readonly opts: Option[] = [
    { id: 'Portland', label: 'Portland' },
    { id: 'NYC', label: 'New York City' },
    { id: 'LosAngeles', label: 'Los Angeles' },
    { id: 'Boston', label: 'Boston' },
    { id: 'Atlanta', label: 'Atlanta' },
    { id: 'SanFrancisco', label: 'San Francisco' },
  ];
}

// select-creatable-multi.scenario.tsx
@Component({
  ...base,
  imports: [Select],
  selector: 'bui-s-select-creatable-multi',
  template: `
    <bui-select [options]="opts" labelKey="label" valueKey="id" [creatable]="true" [multi]="true" [closeOnSelect]="false" />
  `,
})
export class SelectCreatableMultiScenario {
  protected readonly opts: Option[] = [{ id: 'Portland', label: 'Portland' }];
}

// select-many-options.scenario.tsx — lista longa (original virtualiza com react-window).
@Component({
  ...base,
  imports: [Select],
  selector: 'bui-s-select-many',
  template: `<bui-select [options]="opts" />`,
})
export class SelectManyOptionsScenario {
  protected readonly opts: Option[] = Array.from({ length: 1000 }, (_, i) => ({
    id: `${i}`,
    label: `Option ${i + 1}`,
  }));
}

// select-option-group.scenario.tsx — grupos (__ungrouped + Blueish + Whiteish).
@Component({
  ...base,
  imports: [Select],
  selector: 'bui-s-select-option-group',
  template: `<bui-select [options]="groups" labelKey="id" valueKey="color" />`,
})
export class SelectOptionGroupScenario {
  protected readonly groups: SelectOptions = {
    __ungrouped: [{ id: 'Black', color: '#000000' }],
    Blueish: [
      { id: 'AliceBlue', color: '#F0F8FF' },
      { id: 'Aqua', color: '#00FFFF' },
      { id: 'Aquamarine', color: '#7FFFD4' },
    ],
    Whiteish: [
      { id: 'AntiqueWhite', color: '#FAEBD7' },
      { id: 'Azure', color: '#F0FFFF' },
      { id: 'Beige', color: '#F5F5DC' },
    ],
  };
}

// select-highlight.scenario.tsx — valor controlado (Beige).
@Component({
  ...base,
  imports: [Select],
  selector: 'bui-s-select-highlight',
  template: `<bui-select [options]="opts" labelKey="id" valueKey="color" [value]="val" />`,
})
export class SelectHighlightScenario {
  protected readonly opts = COLORS;
  protected readonly val: Option[] = [{ id: 'Beige', color: '#F5F5DC' }];
}

// select-async-options.scenario.tsx — busca assíncrona (resultados após onInputChange).
@Component({
  ...base,
  imports: [Select],
  selector: 'bui-s-select-async',
  template: `
    <bui-select
      [options]="results()"
      type="search"
      (inputChange)="onSearch($event)"
    />
  `,
})
export class SelectAsyncScenario {
  private readonly all: Option[] = [
    { label: 'AliceBlue', id: '#F0F8FF' },
    { label: 'AntiqueWhite', id: '#FAEBD7' },
    { label: 'Aqua', id: '#00FFFF' },
    { label: 'Aquamarine', id: '#7FFFD4' },
    { label: 'Azure', id: '#F0FFFF' },
    { label: 'Beige', id: '#F5F5DC' },
  ];
  protected readonly results = signal<Option[]>([]);
  protected onSearch(q: string): void {
    this.results.set([]);
    setTimeout(() =>
      this.results.set(
        this.all.filter((c) => String(c['label']).toLowerCase().includes(q.toLowerCase())),
      ),
    );
  }
}

// select-disable-href-anchor.scenario.tsx — itens com href NÃO viram <a>.
@Component({
  ...base,
  imports: [Select],
  selector: 'bui-s-select-href',
  template: `<bui-select [options]="o" [startOpen]="true" />`,
})
export class SelectDisableHrefScenario {
  protected readonly o: Option[] = [
    { id: 'a', label: 'hey!', href: 'https://baseweb.design' },
    { id: 'b', label: 'are you listening?', href: 'https://baseweb.design' },
    { id: 'c', label: 'look at me!', href: 'https://baseweb.design' },
  ];
}

// select-in-flex-container.scenario.tsx — grid 3 colunas (stateful/single/multi).
@Component({
  ...base,
  imports: [Select],
  selector: 'bui-s-select-flex',
  template: `
    <div style="display:grid;grid-template-columns:repeat(3,1fr)">
      <div style="display:flex;align-items:center;justify-content:center">
        <bui-select [options]="opts" labelKey="id" valueKey="color" />
      </div>
      <div style="display:flex;align-items:center;justify-content:center">
        <bui-select [options]="opts" labelKey="id" valueKey="color" [value]="aqua" />
      </div>
      <div style="display:flex;align-items:center;justify-content:center">
        <bui-select [options]="opts" labelKey="id" valueKey="color" [multi]="true" [value]="aqua" />
      </div>
    </div>
  `,
})
export class SelectInFlexScenario {
  protected readonly opts = COLORS;
  protected readonly aqua: Option[] = [{ color: '#00FFFF' }];
}

// select-rtl.scenario.tsx — direção rtl.
@Component({
  ...base,
  imports: [Select],
  selector: 'bui-s-select-rtl',
  template: `
    <div dir="rtl">
      <bui-select dir="rtl" [options]="opts" labelKey="id" valueKey="color" /><br />
      <bui-select dir="rtl" [options]="opts" labelKey="id" valueKey="color" [value]="aqua" /><br />
      <bui-select dir="rtl" [options]="opts" labelKey="id" valueKey="color" [multi]="true" [value]="aqua" />
    </div>
  `,
})
export class SelectRtlScenario {
  protected readonly opts = COLORS;
  protected readonly aqua: Option[] = [{ color: '#00FFFF' }];
}

// select-icon-overrides.scenario.tsx — aproximação (overrides de ícone = API React).
@Component({
  ...base,
  imports: [Select],
  selector: 'bui-s-select-icon-overrides',
  template: `
    <bui-select [options]="opts" labelKey="id" valueKey="color" type="search" />
    <bui-select [options]="opts" labelKey="id" valueKey="color" />
    <bui-select [options]="opts" labelKey="id" valueKey="color" />
    <bui-select [options]="opts" labelKey="id" valueKey="color" [value]="first" />
    <bui-select [options]="opts" labelKey="id" valueKey="color" [value]="first" />
  `,
})
export class SelectIconOverridesScenario {
  protected readonly opts = COLORS;
  protected readonly first: Option[] = [COLORS[0]];
}

// select-search-single-fontsize.scenario.tsx — fonte grande (override 28px) + valor.
@Component({
  ...base,
  imports: [Select],
  selector: 'bui-s-select-search-fontsize',
  styles: [
    `bui-s-select-search-fontsize .bui-select__input,
     bui-s-select-search-fontsize .bui-select__single {
       font-size: 28px; font-weight: 500; line-height: 38px;
     }`,
  ],
  template: `
    <bui-select
      [options]="opts"
      labelKey="name"
      valueKey="id"
      type="search"
      [clearable]="false"
      [value]="val"
    />
  `,
})
export class SelectSearchFontsizeScenario {
  protected readonly opts: Option[] = [
    { id: 'la', name: 'Los Angeles' },
    { id: 'sf', name: 'San Francisco' },
    { id: 'ny', name: 'New York City' },
  ];
  protected readonly val: Option[] = [{ id: 'la', name: 'Los Angeles' }];
}

// select-maintains-input-value.scenario.tsx — 4 selects rotulados.
@Component({
  ...base,
  imports: [Select],
  selector: 'bui-s-select-maintains',
  template: `
    <div id="maintain-after-blur">maintain after blur<bui-select [options]="opts" labelKey="id" valueKey="color" /></div>
    <div id="maintain-after-close">maintain after close<bui-select [options]="opts" labelKey="id" valueKey="color" /></div>
    <div id="maintain-after-select">maintain after select<bui-select [options]="opts" labelKey="id" valueKey="color" /></div>
    <div id="maintain-after-all">maintain after all<bui-select [options]="opts" labelKey="id" valueKey="color" /></div>
  `,
})
export class SelectMaintainsScenario {
  protected readonly opts = COLORS;
}

// select-backspace-behavior.scenario.tsx — 2 selects rotulados.
@Component({
  ...base,
  imports: [Select],
  selector: 'bui-s-select-backspace',
  template: `
    <div id="backspace-behavior">backspace behavior<bui-select [options]="opts" labelKey="id" valueKey="color" /></div>
    <div id="backspace-clears-input-value">backspace clears input value<bui-select [options]="opts" labelKey="id" valueKey="color" /></div>
  `,
})
export class SelectBackspaceScenario {
  protected readonly opts = COLORS;
}

// select-in-modal.scenario.tsx
@Component({
  ...base,
  imports: [Select, Button, BuiModal, BuiModalHeader, BuiModalBody, BuiModalFooter, BuiModalButton],
  selector: 'bui-s-select-in-modal',
  template: `
    <bui-button (click)="open.set(true)">Open Modal</bui-button>
    <bui-modal [isOpen]="open()" (modalClose)="open.set(false)">
      <bui-modal-header>Hello world</bui-modal-header>
      <bui-modal-body>
        <bui-select
          [options]="opts"
          labelKey="id"
          valueKey="color"
          ariaLabel="Color"
        />
      </bui-modal-body>
      <bui-modal-footer>
        <bui-modal-button (buttonClick)="open.set(false)">Cancel</bui-modal-button>
        <bui-modal-button (buttonClick)="open.set(false)">Okay</bui-modal-button>
      </bui-modal-footer>
    </bui-modal>
  `,
})
export class SelectInModalScenario {
  protected readonly opts = COLORS;
  protected readonly open = signal(false);
}

// select-input-ref.scenario.tsx — focus the select via viewChild
@Component({
  ...base,
  imports: [Select, Button],
  selector: 'bui-s-select-input-ref',
  template: `
    <div style="width:360px">
      <bui-button (click)="focusSelect()">focus</bui-button>
      <bui-select #inputRefSelect [options]="opts" ariaLabel="Select fruit" [value]="value()" (changed)="value.set($event)" />
    </div>
  `,
})
export class SelectInputRefScenario {
  protected readonly opts: Option[] = [
    { id: 'a', label: 'apples' },
    { id: 'b', label: 'bananas' },
    { id: 'c', label: 'dragon fruit' },
  ];
  protected readonly value = signal<Option[]>([]);
  private readonly selectRef = viewChild.required<Select>('inputRefSelect');
  protected focusSelect(): void {
    this.selectRef().focus();
  }
}

// select-controlref-set-dropdown-open.scenario.tsx
@Component({
  ...base,
  imports: [Select, Button],
  selector: 'bui-s-select-ctrl-open',
  template: `
    <div style="width:360px">
      <div style="display:flex;justify-content:space-between;margin-bottom:20px">
        <bui-button id="open" (click)="openDropdown()">Open Dropdown</bui-button>
        <bui-button id="close" (click)="closeDropdown()">Close Dropdown</bui-button>
      </div>
      <bui-select #ctrlOpenSelect [options]="opts" ariaLabel="Select fruit" [value]="value()" (changed)="value.set($event)" />
    </div>
  `,
})
export class SelectCtrlOpenScenario {
  protected readonly opts: Option[] = [
    { id: 'a', label: 'apples' },
    { id: 'b', label: 'bananas' },
    { id: 'c', label: 'dragon fruit' },
  ];
  protected readonly value = signal<Option[]>([]);
  private readonly selectRef = viewChild.required<Select>('ctrlOpenSelect');
  protected openDropdown(): void { this.selectRef().setDropdownOpen(true); }
  protected closeDropdown(): void { this.selectRef().setDropdownOpen(false); }
}

// select-controlref-set-input-value.scenario.tsx
@Component({
  ...base,
  imports: [Select, Button, BuiInput],
  selector: 'bui-s-select-ctrl-input',
  template: `
    <div style="width:360px">
      <div style="display:flex;justify-content:space-between;margin-bottom:20px">
        <bui-input [value]="inputText()" (valueChange)="inputText.set($event)" id="inputValue" ariaLabel="Input value" />
        <bui-button id="setInputValueBtn" (click)="setInputValue()" style="min-width:105px;margin-left:20px">Set value</bui-button>
      </div>
      <bui-select #ctrlInputSelect [options]="opts" type="search" ariaLabel="Select fruit" [value]="value()" (changed)="value.set($event)" />
    </div>
  `,
})
export class SelectCtrlInputScenario {
  protected readonly opts: Option[] = [
    { id: 'a', label: 'apples' },
    { id: 'b', label: 'bananas' },
    { id: 'c', label: 'dragon fruit' },
  ];
  protected readonly value = signal<Option[]>([]);
  protected readonly inputText = signal('apples');
  private readonly selectRef = viewChild.required<Select>('ctrlInputSelect');
  protected setInputValue(): void { this.selectRef().setInputValue(this.inputText()); }
}

// select-calls-provided-blur.scenario.tsx
@Component({
  ...base,
  imports: [Select],
  selector: 'bui-s-select-blur',
  template: `
    <bui-select
      [options]="opts"
      ariaLabel="Select option"
      [closeOnSelect]="false"
      (blurred)="blurCount.set(blurCount() + 1)"
    />
    <button>focus target</button>
    <p>{{ blurCount() }}</p>
  `,
})
export class SelectCallsBlurScenario {
  protected readonly opts: Option[] = [
    { id: 'a', label: 'hey!' },
    { id: 'b', label: 'are you listening?' },
    { id: 'c', label: 'look at me!' },
  ];
  protected readonly blurCount = signal(0);
}

// select-click-maintains-focus.scenario.tsx
@Component({
  ...base,
  imports: [Select],
  selector: 'bui-s-select-click-focus',
  template: `
    <button>before</button>
    <bui-select [options]="opts" ariaLabel="Select option" />
    <button>after</button>
  `,
})
export class SelectClickFocusScenario {
  protected readonly opts: Option[] = [
    { id: 'a', label: 'hey!' },
    { id: 'b', label: 'are you listening?' },
    { id: 'c', label: 'look at me!' },
  ];
}

// select-click-triggers-blur.scenario.tsx
@Component({
  ...base,
  imports: [Select],
  selector: 'bui-s-select-click-blur',
  template: `
    <button data-test-id="button" (click)="showSelect.set(true)">Show Select</button>
    @if (showSelect()) {
      <bui-select
        autoFocus
        [options]="opts"
        ariaLabel="Select color"
        placeholder="Select color"
        [value]="value()"
        (changed)="value.set($event)"
        (blurred)="showSelect.set(false)"
      />
    }
  `,
})
export class SelectClickBlurScenario {
  protected readonly opts: Option[] = [
    { label: 'AliceBlue', id: '#F0F8FF' },
    { label: 'AntiqueWhite', id: '#FAEBD7' },
    { label: 'Aqua', id: '#00FFFF' },
    { label: 'Aquamarine', id: '#7FFFD4' },
    { label: 'Azure', id: '#F0FFFF' },
    { label: 'Beige', id: '#F5F5DC' },
  ];
  protected readonly showSelect = signal(false);
  protected readonly value = signal<Option[]>([]);
}

// select-unmount-blur.scenario.tsx
@Component({
  ...base,
  imports: [Select],
  selector: 'bui-s-select-unmount',
  template: `
    <p>value selected: {{ value().length ? value()[0]['id'] : 'none' }}</p>
    @if (showSelect()) {
      <div data-testid="select-container">
        <bui-select
          [options]="opts"
          labelKey="id"
          valueKey="color"
          ariaLabel="Select color"
          [value]="value()"
          (changed)="value.set($event); showSelect.set(false)"
          (blurred)="showSelect.set(false)"
        />
      </div>
    } @else {
      <button (click)="showSelect.set(true)">click to show select</button>
    }
  `,
})
export class SelectUnmountScenario {
  protected readonly opts = COLORS;
  protected readonly showSelect = signal(false);
  protected readonly value = signal<Option[]>([]);
}

// select-overridden-icon-container.scenario.tsx — approximation (no React override API)
@Component({
  ...base,
  imports: [Select],
  selector: 'bui-s-select-icon-container',
  template: `
    <div>
      <bui-select
        type="search"
        [options]="opts"
        ariaLabel="Select color"
        [value]="value()"
        (changed)="value.set($event)"
      />
      <p>custom element click count <span data-testId="click-count">{{ count() }}</span></p>
    </div>
  `,
})
export class SelectOverriddenIconScenario {
  protected readonly opts: Option[] = [
    { label: 'AliceBlue', id: '#F0F8FF' },
    { label: 'AntiqueWhite', id: '#FAEBD7' },
    { label: 'Aqua', id: '#00FFFF' },
    { label: 'Aquamarine', id: '#7FFFD4' },
    { label: 'Azure', id: '#F0FFFF' },
    { label: 'Beige', id: '#F5F5DC' },
  ];
  protected readonly value = signal<Option[]>([]);
  protected readonly count = signal(0);
}

// select-overridden-menu.scenario.tsx — approximation (no React stateReducer override)
@Component({
  ...base,
  imports: [Select],
  selector: 'bui-s-select-menu-override',
  template: `
    <bui-select
      type="search"
      multi
      [closeOnSelect]="false"
      [options]="opts"
      labelKey="id"
      valueKey="color"
      ariaLabel="Select colors"
    />
  `,
})
export class SelectOverriddenMenuScenario {
  protected readonly opts = [
    ...COLORS,
    { id: 'DarkBlue', color: '#00008B' },
    { id: 'DarkCyan', color: '#008B8B' },
  ];
}
