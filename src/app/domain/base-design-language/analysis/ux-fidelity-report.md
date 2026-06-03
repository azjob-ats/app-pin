# UX Fidelity Report — Uber Base Web (`baseui` v18.1.0)

> **Fonte:** `/home/azjob/workspace/app-pin/base-design-language/baseweb` (extração direta do código).
> **Status:** auditoria de fidelidade (Fase 1.5). **Nenhum código Angular.** Implementação só após aprovação.
> **Escopo:** clonar **UX/UI** (design, tokens, variantes, estados, navegação, comportamento), **não** a arquitetura de pastas.
> Toda afirmação aqui é rastreável a arquivos do repositório.

---

## Seção 1 — Theme Architecture

### 1.1 Estrutura (`src/themes/`)
```
themes/
├── index.ts                      # exports públicos dos temas
├── types.ts                      # Theme, Primitives, tipos de token
├── utils.ts                      # getFoundationColorOverrides, helpers
├── shared/                       # subgrupos NÃO-cor (iguais em todos os temas)
│   ├── typography.ts  sizing.ts  borders.ts  lighting.ts
│   ├── animation.ts   breakpoints.ts  media-query.ts  grid.ts
├── light-theme/
│   ├── primitives.ts                 # lightThemePrimitives
│   ├── color-foundation-tokens.ts    # foundation (primary, accent, negative…)
│   ├── color-semantic-tokens.ts      # getSemanticColors(foundation)
│   ├── color-component-tokens.ts     # getComponentColors(semantic)
│   ├── create-light-theme.ts         # fábrica
│   └── light-theme.ts                # objeto LightTheme montado
├── dark-theme/  (espelha light-theme: primitives, 3 camadas de cor, create, dark-theme.ts)
└── move-theme/
    ├── light-theme-with-move.ts   # LightThemeMove (fonte "Move")
    ├── dark-theme-with-move.ts    # DarkThemeMove
    └── typography.ts              # typography Move
```

### 1.2 Composição (como o tema é criado)
`create-light-theme.ts` (idem dark):
```
foundationColors = defaultFoundation + getFoundationColorOverrides(overrides.colors)
semanticColors   = getSemanticColors(foundationColors)
componentColors  = getComponentColors(semanticColors)
theme = { ...LightTheme,                      // shared: typography/sizing/borders/lighting/animation/breakpoints/grid/mediaQuery/zIndex
          colors: { ...primitiveColors, ...foundationColors, ...semanticColors, ...componentColors } }
return deepMerge(theme, overrides)
```
- **Cadeia de herança das cores:** `primitive` → `foundation` (apelidos de marca) → `semantic` (intenção) → `component` (tokens por componente). Cada camada **deriva** da anterior via função.
- **Shared** (typography, sizing, borders, lighting, animation, breakpoints, grid, mediaQuery) é **idêntico** entre light/dark; só **cor** muda. O **move-theme** muda também a **typography** (fonte Uber Move).
- **Shape do objeto `Theme`** (de `light-theme.ts`): `{ name, colors, animation, borders, breakpoints, direction, grid, lighting, mediaQuery, sizing, typography, zIndex }`.
- **Consumo:** componentes usam `styled(tag, ({$theme}) => ({ color: $theme.colors.buttonPrimaryFill }))` (Styletron + React context).

### 1.3 Temas existentes (`themes/index.ts`)
Pré-montados: **LightTheme**, **DarkTheme**, **LightThemeMove**, **DarkThemeMove**.
Fábricas: **createLightTheme**, **createDarkTheme** (`createTheme` = alias de createLightTheme).
Primitives: **lightThemePrimitives**, **darkThemePrimitives**.
> Não existe arquivo "creator-theme"; o equivalente a "Creator/Move theme objects" é o **move-theme** + a fábrica `createTheme(overrides)`.

### 1.4 Theme Matrix
| Theme | Primitive Tokens | Semantic Tokens | Component Tokens | Typography |
|-------|------------------|-----------------|------------------|-----------|
| Light | `lightThemePrimitives` + `color-primitive-tokens` (gray/red/orange/amber/yellow/lime/green/teal/blue/purple/magenta/brand 50–900) | `light-theme/color-semantic-tokens` (`background*`,`content*`,`border*`) derivado do foundation | `light-theme/color-component-tokens` (`buttonPrimaryFill`, `inputFill`, `tickFill`…) | shared (Helvetica/Arial stack) |
| Dark | `darkThemePrimitives` + variantes `*Dark` | `dark-theme/color-semantic-tokens` | `dark-theme/color-component-tokens` | shared |
| LightThemeMove / DarkThemeMove | iguais ao Light/Dark | iguais | iguais | **move-theme/typography** (fonte Uber Move) |

---

## Seção 2 — Overrides System (`src/helpers/overrides.tsx`)

### 2.1 Tipos de override
Cada **parte nomeada** de um componente aceita um override no formato:
```ts
overrides = {
  Root:  { component?, props?, style? },
  Label: { component?, props?, style? },
  Input: ConfigurationOverrideFunction | ConfigurationOverrideObject,
}
```
Tipos exportados: `Override<T>`, `Overrides<T>`, `OverrideObject`, `ConfigurationOverride`, `ConfigurationOverrideObject`, `ConfigurationOverrideFunction`, `StyleOverride`.

### 2.2 APIs de override (funções exportadas)
| Função | Papel |
|--------|-------|
| `getOverride(override)` | extrai o `component` custom (ou null) |
| `getOverrideProps(override)` | extrai `props` + `style` (vira `$style`) |
| `toObjectOverride(override)` | normaliza função → objeto |
| `getOverrides(override, defaultComponent)` | retorna `[Component, props]` resolvidos |
| `mergeOverrides(target, source)` | merge profundo de mapas de override |
| `mergeOverride(target, source)` | merge de um único override |
| `mergeConfigurationOverrides(...)` | merge dos overrides de configuração |
| `useOverrides(defaults)` | hook que resolve um mapa de partes → componentes (API mais nova) |

### 2.3 Arquitetura
- **Passagem:** consumidor passa `overrides={{ Parte: {...} }}`; o componente declara um mapa de partes default (Styled*).
- **Merge:** defaults do componente são combinados com os do consumidor via `mergeOverrides`/`useOverrides`.
- **Consumo:** para cada parte, `getOverrides(override, StyledDefault)` devolve `[Component, props]`; o componente renderiza `<Component {...props} $style={styleOverride} />`. O styled aplica `$style` por último (vence o default).

### 2.4 Proposta de mapeamento Angular (apenas proposta)
- **Não há `overrides` 1:1** (não há styled runtime). Proposta fiel ao comportamento:
  - cada componente expõe **partes nomeadas** como classes (`bui-button__root`, `__start-enhancer`…) e/ou `TemplateRef` slots;
  - um input `overrides` aceitando `{ Parte: { class?, style?, attrs? } }` aplicado às partes via `[class]`/`[style]`/`[attr.*]`;
  - substituição de componente de parte via **content projection / TemplateRef** por parte;
  - merge feito por um util `mergeOverrides` equivalente.
- Decisão final fica para a fase de implementação (não agora).

---

## Seção 3 — Styled Components Audit (Component Anatomy Matrix)

Partes estilizadas reais (`export const X = styled(...)` em cada `styled-components.ts`). Prefixos `Styled` mantidos como no source.

| Componente | Styled Parts |
|-----------|--------------|
| accordion | Root, PanelContainer, Header, ToggleIcon, ToggleIconGroup, Content, ContentAnimationContainer |
| app-nav-bar | Root, SubnavContainer, Spacing, AppName, PrimaryMenuContainer, MainMenuItem, SecondaryMenuContainer, UserProfileTileContainer, UserProfilePictureContainer, UserProfileInfoContainer, DesktopMenuContainer, DesktopMenu |
| avatar | Avatar, Initials, Root |
| badge | Root, Positioner, Badge, NotificationCircle, HintDot |
| banner | Root, LeadingContent, MessageContent, TrailingContent, BelowContent, Title, Message, TrailingButtonContainer, TrailingIconButton |
| block | Block |
| bottom-navigation | Root, SelectorList, OverflowPanel, OverflowPanelList, Title, Selector, Panel |
| breadcrumbs | Root, List, ListItem, Separator |
| button | BaseButton, StartEnhancer, EndEnhancer, StartEnhancerButtonContentContainer, LoadingSpinnerContainer, LoadingSpinner |
| button-dock | Root, ActionContainer, ActionSubContainer |
| button-group | Root |
| button-timed | TimerContainer (+ BaseButtonTimed, enhancers) |
| card | Action, Body, Contents, HeaderImage, Root, Thumbnail, Title |
| checkbox | Root, Checkmark, Label, Input, Toggle, ToggleTrack |
| checkbox-v2 | Root, CheckmarkContainer, Checkmark, Label, Input |
| combobox | Root, InputContainer, ListBox, ListItem |
| datepicker | InputWrapper, InputLabel, StartDate, EndDate, Root, MonthContainer, CalendarContainer, SelectorContainer, CalendarHeader, MonthHeader, MonthYearSelectButton, MonthYearSelectIconContainer, PrevButton, NextButton, Month, Week, Day, DayLabel, WeekdayHeader, InputContainer |
| dialog | Root, Overlay, ScrollContainer, Heading, Body |
| divider | Divider |
| dnd-list | Root, List, Item, DragHandle, CloseHandle, Label |
| drawer | Root, Backdrop, DrawerContainer, DrawerBody, Close, Hidden |
| file-uploader | FileRow, FileRowColumn, FileRowContent, FileRowFileName, FileRowText, FileRowUploadMessage, FileRowUploadText, FileRows, Hint, ImagePreviewThumbnail, ItemPreviewContainer, Label, ParentRoot |
| file-uploader-basic | FileDragAndDrop, ContentMessage, ErrorMessage, Root, HiddenInput |
| form-control | Label, LabelContainer, LabelEndEnhancer, Caption, CaptionMessage, CaptionIcon, ControlContainer |
| header-navigation | Root, NavigationItem, NavigationList |
| helper | Body, Arrow |
| icon | Svg |
| input | Root, InputEnhancer, InputContainer, Input, MaskToggleButton, ClearIconContainer, ClearIcon |
| layout-grid | GridWrapper, Grid, Cell |
| link | Link |
| list | Root, Content, EndEnhancerContainer, ArtworkContainer, LabelRoot, LabelContent, LabelDescription, LabelSublistContent, HeadingRoot, HeadingContent, HeadingContentRow, HeadingMainHeading, HeadingSubHeading, HeadingEndEnhancerContainer, HeadingEndEnhancerDescriptionContainer |
| map-marker | (Fixed/Floating/Route markers + LocationPuck): DragShadow*, Needle, FloatingMarkerRoot, PinHead*, FixedMarkerRoot, Anchors, StrokedLabel*, BadgeEnhancerRoot, FloatingRouteMarker*, LocationPuck* (28 partes) |
| menu | List, EmptyState, OptgroupHeader, ListItemAnchor, ListItemElement, ListItemProfile, ProfileImgContainer, ProfileImg, ProfileLabelsContainer, ProfileTitle, ProfileSubtitle, ProfileBody, MenuDivider |
| message-card | Root, Image, ContentContainer, HeadingContainer, ParagraphContainer |
| mobile-header | Root, NavContainer, ActionButtonsContainer, Title |
| modal | Root, DialogContainer, Dialog, Close, ModalHeader, ModalBody, ModalFooter, Hidden |
| page-control | Root, Dot |
| pagination | Root, MaxLabel, DropdownContainer |
| payment-card | IconWrapper |
| phone-input | PhoneInputRoot, FlagContainer, DialCode, CountrySelectContainer, CountrySelectDropdown(Flag/Name/Dialcode)Column |
| pin-code | Root |
| popover | Body, Arrow, Inner, Padding, Hidden |
| progress-bar | Root, BarContainer, Bar, BarProgress, InfiniteBar, Label, ProgressBarRoundedRoot, ProgressBarRoundedText |
| progress-steps | ProgressSteps, Step, IconContainer, Icon, InnerIcon, Content, ContentTitle, ContentTail, ContentDescription, NumberStep, NumberIcon, NumberContentTail |
| radio | RadioGroupRoot, Root, RadioMarkInner, RadioMarkOuter, Label, Input, Description |
| radio-v2 | RadioGroupRoot, Root, RadioBackplate, RadioMarkInner, RadioMarkOuter, LabelWrapper, Label, Input, Description |
| rating | Root, Star, Emoticon |
| segmented-control | Root, SegmentList, Segment, ArtworkContainer, Active, SegmentPanel, Label, Description, LabelBlock, Badge, BadgeHint |
| select | DropdownContainer, OptionContent, Root, ControlContainer, ValueContainer, Placeholder, SingleValue, InputContainer, Input, InputSizer, IconsContainer, SelectArrow, ClearIcon, SearchIconContainer |
| sheet | Root, TopContainer, BottomContainer, Header, Grabber, HeaderGrid, EmptyDiv, HeaderTextContainer, Title, Description, Body |
| side-navigation | Root, NavItemContainer, NavLink, NavItemElement, SubNavContainer |
| skeleton | Root, Row |
| slider | Root, Track, InnerTrack, Mark, Tick, TickBar, Thumb, InnerThumb, ThumbValue |
| sliding-button | Root, Track, LoadingOverlay, LoadingSpinner, Label, Slider, CompletedLabel, Grabber |
| snackbar | Root, Content, StartEnhancerContainer, Message, WrapActionButtonContainer, ActionButtonContainer, PlacementContainer |
| spinner | Spinner |
| stepper | Root |
| switch | Root, Toggle, ToggleTrack, Label, Input |
| table-semantic | Root, Table, TableHead, TableHeadRow, TableHeadCell, SortIconContainer, SortAsc/Desc/NoneIcon, TableBody, TableBodyRow, TableBodyCell, TableLoadingMessage |
| table (flex) | SortableLabel, FilterButton, FilterContent, FilterHeading, FilterFooter, Action |
| tabs | Root, Tab, TabBar, TabContent |
| tabs-motion | Root, TabBar, TabList, Tab, EndEnhancerContainer, ArtworkContainer, TabBorder, TabHighlight, TabPanel |
| tag | Action, StartEnhancerContainer, Text, Root |
| tag-group | Root |
| textarea | TextAreaRoot, TextareaContainer, Textarea |
| tile | TileRoot, TileGroupRoot, HeaderContainer, LeadingContentContainer, TrailingContentContainer, BodyContainer, BodyContainerContent, Label, Paragraph |
| toast | Root, InnerContainer, Body, CloseIconSvg |
| tooltip | Body, Inner, Arrow |
| tree-view | TreeItemList, TreeItem, ItemContent, IconContainer, NoIconContainer, LabelInteractable |

---

## Seção 4 — Component Export Audit

Exports relevantes por `index.ts` (Styled* omitidos aqui — ver Seção 3).

| Componente | Component(s) | Enums/Constants | Stateful/Helpers/Hooks/Types |
|-----------|--------------|-----------------|------------------------------|
| accordion | Accordion, Panel, StatelessAccordion, StatefulPanel | STATE_CHANGE_TYPE | StatefulPanelContainer |
| app-nav-bar | AppNavBar | POSITION, KIND | setItemActive |
| aspect-ratio-box | AspectRatioBox, AspectRatioBoxBody | — | — |
| avatar | Avatar | — | — |
| badge | Badge, NotificationCircle, HintDot | COLOR, HIERARCHY, PLACEMENT, SHAPE, ROLE | — |
| banner | Banner | KIND, HIERARCHY, ARTWORK_TYPE, ACTION_POSITION | — |
| block | Block | — | — |
| bottom-navigation | BottomNavigation, NavItem | — | — |
| breadcrumbs | Breadcrumbs | — | — |
| button | Button | KIND, SIZE, SHAPE, WIDTH_TYPE, MIN_HIT_AREA, BUTTON_GROUP_EXCLUSIVE_KINDS | — |
| button-dock | ButtonDock | — | — |
| button-group | ButtonGroup, StatefulButtonGroup | MODE, PADDING, SHAPE, SIZE, STATE_CHANGE_TYPE | StatefulContainer |
| button-timed | ButtonTimed | — | — |
| card | Card | — | hasThumbnail |
| checkbox | Checkbox, StatefulCheckbox | STATE_TYPE, STYLE_TYPE, LABEL_PLACEMENT | StatefulContainer |
| checkbox-v2 | Checkbox, StatefulCheckbox | STATE_TYPE, LABEL_PLACEMENT | StatefulContainer |
| combobox | Combobox | SIZE | — |
| data-table | DataTable, StatefulDataTable, *Column (Anchor/Boolean/Categorical/Custom/Datetime/Numerical/RowIndex/String) | COLUMNS, NUMERICAL_FORMATS, DATETIME_OPERATIONS, SORT_DIRECTIONS | StatefulContainer |
| datepicker | Datepicker, DatePicker, Calendar, StatefulDatepicker, StatefulCalendar | DENSITY, ORIENTATION, RANGED_CALENDAR_BEHAVIOR, STATE_CHANGE_TYPE | formatDate |
| dialog | Dialog | — | — |
| divider | (Divider via Styled) | SIZE | — |
| dnd-list | List, StatefulList | STATE_CHANGE_TYPE | StatefulListContainer, arrayMove, arrayRemove |
| drawer | Drawer | ANCHOR, SIZE, SIZE_DIMENSION, CLOSE_SOURCE | — |
| file-uploader | FileUploader | FILE_STATUS | — |
| file-uploader-basic | FileUploaderBasic | — | — |
| flex-grid | FlexGrid, FlexGridItem | — | — |
| form-control | FormControl | — | — |
| header-navigation | HeaderNavigation | ALIGN | — |
| heading | Heading, HeadingLevel | — | LevelContext |
| icon | Icon | — | getSvgStyles |
| input | Input, BaseInput, MaskedInput, StatefulInput | SIZE, ADJOINED, CUSTOM_INPUT_TYPE, STATE_CHANGE_TYPE | StatefulContainer |
| layer | Layer, LayersManager, TetherBehavior | TETHER_PLACEMENT | LayersContext |
| layout-grid | Grid, Cell | — | — |
| link | (StyledLink) | — | — |
| list | ListItem, ListItemLabel, ListHeading, MenuAdapter | ARTWORK_SIZES, SHAPE | — |
| map-marker | FixedMarker, FloatingMarker, FloatingRouteMarker, LocationPuck | KIND + ~12 enums (sizes/anchors/positions) | calculateFloatingRouteMarkerOffsets, PINHEAD_DIMENSIONS |
| menu | Menu, StatefulMenu, OptionList, OptionProfile, NestedMenus | STATE_CHANGE_TYPES, KEY_STRINGS, OPTION_LIST_SIZE | StatefulContainer, NestedMenuContext |
| message-card | MessageCard | BACKGROUND_COLOR_TYPE, IMAGE_LAYOUT | — |
| mobile-header | MobileHeader | TYPE | — |
| modal | Modal, ModalHeader, ModalBody, ModalFooter, ModalButton | SIZE, ROLE, CLOSE_SOURCE | FocusOnce |
| notification | Notification | KIND | — |
| page-control | PageControl | SIZE, KIND | — |
| pagination | Pagination, StatefulPagination | SIZE, STATE_CHANGE_TYPE | StatefulContainer |
| payment-card | PaymentCard, StatefulPaymentCard | SIZE | valid |
| phone-input | PhoneInput, PhoneInputLite, CountryPicker, Flag, StatefulPhoneInput | STATE_CHANGE_TYPE, COUNTRIES | — |
| pin-code | PinCode, StatefulPinCode | SIZE | StatefulPinCodeContainer |
| popover | Popover, StatefulPopover | PLACEMENT, TRIGGER_TYPE, ACCESSIBILITY_TYPE, STATE_CHANGE_TYPE, ANIMATE_IN/OUT_TIME | StatefulContainer |
| progress-bar | ProgressBar, ProgressBarRounded | SIZE, INTENT | — |
| progress-steps | ProgressSteps, Step, NumberedStep | ORIENTATION | — |
| radio | Radio, RadioGroup, StatefulRadioGroup | ALIGN, STATE_TYPE | StatefulContainer |
| radio-v2 | Radio, RadioGroup, StatefulRadioGroup | ALIGN, LABEL_PLACEMENT, STATE_TYPE | RadioGroupContext, useRadioGroupContext |
| rating | StarRating, EmoticonRating | — | — |
| segmented-control | (SegmentedControl/Segment) | FILL, STATE_CHANGE_TYPE | — |
| select | Select, MultiSelect, SingleSelect, StatefulSelect, AutosizeInput | TYPE, SIZE, STATE_CHANGE_TYPE | filterOptions, StatefulSelectContainer |
| sheet | Sheet | — | — |
| side-navigation | Navigation, NavItem | STATE_CHANGE_TYPE | — |
| skeleton | Skeleton | — | — |
| slider | Slider, StatefulSlider | STATE_CHANGE_TYPE | StatefulContainer |
| sliding-button | SlidingButton | THRESHOLD | — |
| snackbar | SnackbarProvider, SnackbarElement | DURATION, PLACEMENT | useSnackbar |
| spinner | Spinner | — | — |
| stepper | Stepper | — | — |
| switch | Switch, StatefulSwitch | SIZE, STATE_TYPE, LABEL_PLACEMENT | StatefulContainer |
| system-banner | SystemBanner | — | — |
| table-semantic | Table, TableBuilder, TableBuilderColumn | SIZE, DIVIDER | — |
| table-grid | (Grid Table): SortableHeadCell | SORT_DIRECTION | — |
| table (flex) | Table, Filter, SortableHeadCell, SortableHeadCellFactory | SORT_DIRECTION | — |
| tabs | Tabs, Tab, StatefulTabs | ORIENTATION, STATE_CHANGE_TYPE | — |
| tabs-motion | (Tabs, Tab) | ORIENTATION, FILL, STATE_CHANGE_TYPE | — |
| tag | Tag | KIND, HIERARCHY, SIZE, SUPPORTED_KIND, DEPRECATED_KIND | — |
| tag-group | TagGroup | HIERARCHY, SIZE | — |
| textarea | Textarea, StatefulTextarea | SIZE, STATE_CHANGE_TYPE | StatefulContainer |
| tile | Tile, TileGroup | TILE_KIND, TILE_GROUP_KIND, ALIGNMENT, ARTWORK_SIZES | — |
| timepicker | TimePicker | — | — |
| timezonepicker | TimezonePicker | — | — |
| toast | Toast, ToasterContainer, toaster | KIND, TYPE, PLACEMENT, TOAST_ROLE | — |
| tooltip | Tooltip, StatefulTooltip | PLACEMENT, TRIGGER_TYPE, ACCESSIBILITY_TYPE, STATE_CHANGE_TYPE | StatefulContainer |
| tree-view | TreeView, StatefulTreeView, TreeLabel | — | toggleIsExpanded |
| typography | Display*, Heading*, Label*, Paragraph*, Mono* (componentes de texto) | — | — |

> Padrões observados: a maioria expõe um par **Stateless + Stateful** (ex.: `Checkbox`/`StatefulCheckbox`, `Tabs`/`StatefulTabs`) e enums em `UPPER_CASE`. `*_CHANGE_TYPE`/`STATE_TYPE` são **action types do reducer interno** (não variantes visuais).

---

## Seção 5 — Variants Matrix

Eixos de variante visual reais (de `constants.ts`). `STATE_CHANGE_TYPE`/`STATE_TYPE` omitidos (internos).

| Componente | KIND / variantes | SIZE | SHAPE / outros eixos |
|-----------|------------------|------|----------------------|
| button | primary, secondary, tertiary, dangerPrimary, dangerSecondary, dangerTertiary | mini, default, compact, large (+ xSmall, small, medium novos) | SHAPE: default, rectangular, rounded, pill, round, circle, square · WIDTH_TYPE: hug, fill · MIN_HIT_AREA: tap, click |
| button-group | — | (herda do Button) | MODE: radio, checkbox · PADDING: default, none, custom · SHAPE |
| app-nav-bar | primary, secondary | — | POSITION: horizontal, vertical |
| badge | — | — | HIERARCHY: primary, secondary · SHAPE: pill, rectangle · COLOR: accent, primary, positive, negative, warning · PLACEMENT (14) · ROLE: badge, notificationCircle, hintDot |
| banner | info, negative, positive, warning | — | HIERARCHY: low, high · ARTWORK_TYPE: icon, badge · ACTION_POSITION: below, trailing |
| checkbox | — | — | STYLE_TYPE: default, toggle, toggle_round · LABEL_PLACEMENT: top, right, bottom, left |
| checkbox-v2 | — | — | LABEL_PLACEMENT: right, left |
| combobox | — | (SIZE via Input) | — |
| datepicker | — | — | ORIENTATION: horizontal, vertical · DENSITY: high, default · RANGED_CALENDAR_BEHAVIOR: default, locked |
| dialog | — | xSmall, small, medium, large | PLACEMENT: center, topLeft…bottomRight (7) |
| divider | — | cell, section, module | — |
| drawer | — | default, full, auto | ANCHOR: left, right, top, bottom |
| input | — | mini, default, compact, large | ADJOINED: none, left, right, both · ENHANCER_POSITION: start, end |
| layout-grid | — | — | BEHAVIOR: fluid, fixed · ALIGNMENT: start, center, end · STYLE: default, compact |
| list | — | — | ARTWORK_SIZES: SMALL, MEDIUM, LARGE · SHAPE: DEFAULT, ROUND |
| map-marker | default, accent, negative | (vários: pinhead/floating/puck sizes) | NEEDLE_SIZES, PINHEAD_SIZES_SHAPES (7), FLOATING_MARKER_*, LABEL_ENHANCER_POSITIONS, BADGE_ENHANCER_*, LOCATION_PUCK_TYPES: consumer, earner |
| menu | — | default, compact | KEY_STRINGS (teclado) |
| message-card | — | — | BACKGROUND_COLOR_TYPE: light, dark · IMAGE_LAYOUT: top, trailing |
| mobile-header | — | — | TYPE: fixed, floating |
| modal | — | default, full, auto | ROLE: dialog, alertdialog |
| notification | info, positive, warning, negative (KIND) | — | — |
| page-control | default, backgroundProtection, inverse, alwaysLight, alwaysDark (KIND) | large, medium, small | — |
| popover | — | — | PLACEMENT (13) · TRIGGER_TYPE: click, hover · ACCESSIBILITY_TYPE: none, menu, tooltip |
| progress-bar | — | small, medium, large | INTENT: default, positive, warning, negative, brand |
| progress-steps | — | — | ORIENTATION: horizontal, vertical |
| radio / radio-v2 | — | — | ALIGN: vertical, horizontal · LABEL_PLACEMENT (v2): top, right, bottom, left |
| segmented-control | — | — | FILL: fixed, intrinsic |
| select | — | (SIZE via Input) | TYPE: select, search |
| snackbar | — | — | DURATION: infinite, short, medium, long · PLACEMENT (6) |
| spinner | — | small, medium, large | — |
| switch | — | default, small | LABEL_PLACEMENT: left, right |
| table-semantic | — | compact, default, spacious | DIVIDER: horizontal, vertical, grid, clean |
| table-grid / table | — | — | SORT_DIRECTION: ASC, DESC |
| tabs / tabs-motion | — | — | ORIENTATION: horizontal, vertical · FILL (motion): fixed, intrinsic |
| tag | gray, red, orange, yellow, green, blue, purple, magenta, teal, lime, custom (SUPPORTED_KIND) | xSmall, small, medium, large | HIERARCHY: primary, secondary |
| tag-group | — | xSmall, small, medium, large | HIERARCHY: primary, secondary |
| textarea | — | mini, default, compact, large | — |
| tile | — | — | TILE_KIND: selection, action · TILE_GROUP_KIND: singleSelect, multiSelectBatch, multiSelectLive, none · ALIGNMENT · ARTWORK_SIZES |
| toast | info, positive, warning, negative (KIND) | — | TYPE: inline, toast · PLACEMENT (6) |
| sliding-button | — | — | THRESHOLD: low, high |

> Componentes sem eixo de variante visual (apenas estado/props): aspect-ratio-box, avatar, block, breadcrumbs, card, divider(*), heading, icon, link, skeleton, stepper, tooltip, tree-view, typography, etc.

---

## Seção 6 — State Matrix

Estados derivados de **props** (`disabled`, `error`, `positive`, `isLoading`, `checked`, `indeterminate`, `readOnly`, `isSelected`, `isActive`) + **pseudo-estados** dos styled (`:hover`, `:active`, `:focus`/`$isFocusVisible`).

| Componente | States |
|-----------|--------|
| Button / ButtonGroup / ButtonTimed / SlidingButton | default, hover, active, focus, disabled, loading, selected |
| Input / Textarea / Combobox / PhoneInput / PinCode | default, hover, focus, disabled, error, positive, readOnly |
| Select | default, hover, focus, open, disabled, error, positive |
| Checkbox / Checkbox-v2 | default, hover, focus, checked, indeterminate, disabled, error |
| Radio / Radio-v2 | default, hover, focus, checked, disabled, error |
| Switch | default, hover, focus, checked, disabled |
| Slider | default, hover, focus(thumb), active(dragging), disabled |
| Menu / Select options | default, highlighted (keyboard/hover), selected, disabled |
| Tabs / Tabs-motion / SegmentedControl | default, hover, focus, active(selected), disabled |
| Link | default, hover, focus, visited |
| Accordion / Tile | default, hover, focus, expanded/selected, disabled |
| Datepicker (Day) | default, hover, selected, range, highlighted, disabled, today |
| Banner / Notification / Toast / Snackbar / SystemBanner | kinds (info/positive/warning/negative) × dismissable |
| Card / MessageCard | default, hover (quando acionável) |
| ProgressBar / ProgressSteps / Spinner / Skeleton | determinate, indeterminate / current, completed, incomplete / loading |
| Popover / Tooltip / Modal / Drawer / Dialog | closed, open (animate in/out), focus-trapped |
| Rating | default, hover, selected, readOnly |

---

## Seção 7 — Story Audit

**Contagem por componente** (nº de arquivos `*.scenario.tsx`; convenção "story count" do Base Web). Totais: **72** arquivos `*.stories.tsx`, **469** `*.scenario.tsx`.

| Componente | Stories | Componente | Stories | Componente | Stories |
|-----------|---------|-----------|---------|-----------|---------|
| data-table | 33 | select | 31 | datepicker | 30 |
| tabs-motion | 21 | button | 16 | input | 16 |
| popover | 15 | menu | 12 | button-group | 11 |
| combobox | 11 | layout-grid | 11 | slider | 9 |
| map-marker | 9 | checkbox | 9 | table | 9 |
| table-semantic | 9 | phone-input | 8 | switch | 7 |
| snackbar | 7 | progress-steps | 7 | list | 7 |
| file-uploader | 7 | file-uploader-basic | 7 | checkbox-v2 | 7 |
| app-nav-bar | 7 | accordion | 6 | typography | 6 |
| tag | 6 | tree-view | 6 | progress-bar | 6 |
| flex-grid | 6 | avatar | 5 | banner | 5 |
| card | 5 | drawer | 5 | pin-code | 5 |
| radio-v2 | 5 | breadcrumbs | 5 | tree-view | 6 |
| badge | 4 | modal | 4 | tooltip | 4 |
| toast | 4 | message-card | 4 | radio | 4 |
| table-grid | 4 | rating | 3 | tabs | 3 |
| skeleton | 3 | sliding-button | 3 | side-navigation | 3 |
| form-control | 3 | helper | 3 | icon | 3 |
| timezonepicker | 3 | payment-card | 3 | dnd-list | 2 |
| layer | 2 | mobile-header | 2 | pagination | 2 |
| textarea | 2 | timepicker | 2 | (1 cada) | aspect-ratio-box, block, button-dock, button-timed, divider, header-navigation, heading, link, notification, spinner, stepper, template-component |

**Story inventory** (exemplos representativos — nomes reais dos exports `*.stories.tsx`):
- **Button:** Button, Kinds, Sizes, Shapes, Colors, Enhancers, EnhancersCompact, EnhancersLoading, SizesLoading, Circle, Link, MinHitArea, FunctionalChildren, BackgroundSafe, WidthTypes, A11y
- **Input:** Input, Sizes, States, BeforeAfter, Clearable, ClearableNoescape, ClearableIconOverrides, Mask, Number, Password, PasswordIconOverrides, Selector, WithButton, FormControlStates, DisabledMatchesSelect
- **Select:** Select, Sizes, States, SearchSingle, SearchMulti, Creatable, CreatableMulti, AsyncOptions, OptionGroup, Highlight, InModal, InFlexContainer, ManyOptions, … (30)
- **Checkbox:** Checkbox, Indeterminate, Placement, States, Toggle, Unlabeled, Select, ReactHookForm
- **Accordion:** Accordion, Controlled, Disabled, Expanded, PanelOverride, StatelessAccordion
> Inventário completo de nomes por componente: extraível de cada `*.stories.tsx` (mapeados na auditoria; ids Ladle = `<grupo>--<kebab(export)>`).

---

## Seção 8 — Documentation Audit

### 8.1 Page templates
| Template | Como é montado |
|----------|----------------|
| **Component Page** | `pages/components/<id>.mdx` → `export default Layout` + `<SEO>` + `<Yard {...config}>` + prosa (`## When to use`) + `## Examples` com `<Example>` + `<Exports>` |
| **Guide Page** | `pages/guides/*.mdx` → `Layout` + prosa + `<Example>` ocasionais |
| **Landing Page** | `pages/index.jsx` (hero + destaques) |
| **Theme/Token Page** | guias `theming.mdx`/`colors.mdx` + a aba **Theme** do Yard (tokens editáveis por componente) |
| **Cheat Sheet** | `pages/cheat-sheet.mdx` (lista de APIs) |

### 8.2 Shared documentation layout (`components/layout.jsx`)
```
Layout = SkipToContent + HeaderNavigation(topbar) + [ Sidebar | Content(children) + TableOfContents ]
```
- **Sidebar** (`sidebar.jsx`): hierarquia de `routes.jsx` (Getting started, Guides, Components→10 subgrupos, Discover more), colapsável, item ativo, busca.
- **Top Navigation** (`header-navigation.jsx`): logo + version selector + busca + botão **"Components" → /ladle** + tema/GitHub.
- **Page Header:** `# Título` (markdown) + `Edit this page`.
- **Examples Section:** `<Example>` carrega a **fonte real** do arquivo (`examples/<comp>/<name>.tsx`) via raw-loader, mostra preview + código + "abrir no StackBlitz".
- **Props Table / Playground:** o **Yard** (`components/yard`, baseado em **react-view**) — preview + abas **Props (knobs)** / **Style Overrides** / **Theme**, código compilado ao vivo, dirigido por `yard/config/<comp>.ts`.
- **Exports Table:** `<Exports>` lista o que o módulo exporta.
- **Table of Contents:** âncoras da página (lado direito).

### 8.3 Ladle (2ª superfície)
- Build: `ladle build` → montado em **`/ladle`**; rota `/ladle/?story=<grupo>--<nome>`.
- Provider global (`.ladle/components.tsx`): `StyletronProvider` + `BaseProvider` com **theme Light/Dark** + **direction LTR/RTL** (switchers globais do Ladle).
- Stories (`*.stories.tsx`) reexportam scenarios (`*.scenario.tsx`).

---

## Seção 9 — UX Fidelity Matrix

| Área | Contagem |
|------|----------|
| Componentes documentados | **89** (em 10 categorias) |
| Pastas de componente em `src/` | 91 (inclui infra: sheet, helper, locale, etc.) |
| Story files (`*.stories.tsx`) | **72** |
| Scenarios (`*.scenario.tsx`) | **469** |
| Themes pré-montados | **4** (Light, Dark, LightMove, DarkMove) + fábricas createLight/createDark |
| Camadas de token de cor | **4** (primitive → foundation → semantic → component) |
| Subgrupos de token (shared) | 8 (typography, sizing, borders, lighting, animation, breakpoints, grid, mediaQuery) + zIndex |
| Páginas de documentação | ~**105** (89 componentes + ~16 não-componente: home, setup, learn, 8 guides, cheat-sheet, 3 discover, blog) |
| Breakpoints | 3 (small 320 / medium 600 / large 1136) |
| Escala de sizing | 22 steps (scale0 2px … scale4800 192px) |
| Escala tipográfica | 18 (Paragraph/Label/Heading/Display) + 18 Mono = 36 |
| Famílias de cor primitiva | 12 (gray, red, orange, amber, yellow, lime, green, teal, blue, purple, magenta, brand) × 50–900 + Dark |
| APIs de override | 8 funções + 7 tipos |
| Superfícies de navegação | 2 (Docs site + Ladle) |

---

## Critérios de aceite — respostas

1. **Como funcionam os temas?** §1 — 4 camadas de cor derivadas por função (primitive→foundation→semantic→component) + shared (não-cor); `createLightTheme/createDarkTheme(overrides)` com deepMerge; consumidos via Styletron `$theme`.
2. **Como funcionam os overrides?** §2 — mapa `{ Parte: {component, props, style} }`; resolvido por `getOverrides`/`useOverrides`; merge por `mergeOverrides`; cada styled aplica `$style` por último.
3. **Anatomia dos componentes?** §3 — partes nomeadas (Styled*) por componente.
4. **O que cada componente exporta?** §4 — component(s) + Stateful + enums + helpers/hooks/types.
5. **Quais variantes existem?** §5 — KIND/SIZE/SHAPE e eixos por componente.
6. **Quais estados existem?** §6 — por props + pseudo-estados.
7. **Quais stories existem?** §7 — contagem (469 scenarios) + inventário de nomes.
8. **Como o site de docs é montado?** §8 — Next.js + MDX, Layout(Sidebar+Header+TOC), Yard (react-view), Example (raw-loader), Exports.
9. **Como o Ladle é organizado?** §8.3 — `/ladle/?story=<grupo>--<nome>`, provider global Light/Dark + LTR/RTL, stories↔scenarios.

---

**Fim do relatório.** Aguardando aprovação para iniciar a implementação (Fase 3 — Foundations).
