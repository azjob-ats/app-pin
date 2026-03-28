export type FilterComponentType = 'radio' | 'checkbox' | 'select';

export interface FilterOption {
  label: string;
  value: string;
}

export interface IFilterComponentConfig {
  type: FilterComponentType;
  options: FilterOption[];
}

export interface IAttribute {
  key: string;
  name: string;
  filterComponent: IFilterComponentConfig;
  selectedValue?: string | string[];
}

export type AttributesSource = 'static' | 'api';

export interface ICatalog {
  key: string;
  label: string;
  selected?: boolean;
  attributesSource: AttributesSource;
  attributes?: IAttribute[];
}
