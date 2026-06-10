import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BuiStatefulTreeView, type TreeNodeData } from './tree-view.component';

const wrap = (template: string) => `<div style="padding:16px;max-width:480px">${template}</div>`;

const twoNodeData: TreeNodeData[] = [
  {
    id: 1,
    label: 'Node 1',
    isExpanded: true,
    children: [
      {
        id: 2,
        label: 'Child 1',
        isExpanded: true,
        children: [{ id: 3, label: 'Grandchild 1' }],
      },
    ],
  },
  {
    id: 4,
    label: 'Node 2',
    isExpanded: true,
    children: [
      {
        id: 5,
        label: 'Child 2',
        isExpanded: true,
        children: [{ id: 6, label: 'Grandchild 2' }],
      },
    ],
  },
];

// tree-view--tree-view
@Component({
  selector: 'bui-tv-default-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiStatefulTreeView],
  template: wrap(`<bui-stateful-tree-view [data]="data" />`),
})
export class TreeViewScenario {
  data = twoNodeData;
}

// tree-view--interactable
@Component({
  selector: 'bui-tv-interactable-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiStatefulTreeView],
  template: wrap(`<bui-stateful-tree-view [data]="data" />`),
})
export class TreeViewInteractableScenario {
  data: TreeNodeData[] = [
    {
      id: 1,
      label: 'Node 1',
      isExpanded: true,
      children: [
        {
          id: 2,
          label: 'Child 1',
          isExpanded: true,
          children: [{ id: 3, label: 'Grandchild 1 (interactive label)' }],
        },
      ],
    },
    {
      id: 4,
      label: 'Node 2',
      isExpanded: true,
      children: [
        {
          id: 5,
          label: 'Child 2',
          isExpanded: true,
          children: [{ id: 6, label: 'Grandchild 2 (interactive label)' }],
        },
      ],
    },
  ];
}

// tree-view--render-all
@Component({
  selector: 'bui-tv-render-all-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiStatefulTreeView],
  template: wrap(`<bui-stateful-tree-view [data]="data" [renderAll]="true" />`),
})
export class TreeViewRenderAllScenario {
  data: TreeNodeData[] = [
    {
      id: 1,
      label: 'Node 1',
      children: [
        {
          id: 2,
          label: 'Child 1',
          children: [
            {
              id: 3,
              label: 'Grandchild 1',
              children: [{ id: 4, label: 'hidden' }],
            },
          ],
        },
      ],
    },
    {
      id: 5,
      label: 'Node 2',
      isExpanded: true,
      children: [
        {
          id: 6,
          label: 'Child 2',
          isExpanded: true,
          children: [{ id: 7, label: 'Grandchild 2' }],
        },
      ],
    },
  ];
}

// tree-view--rtl
@Component({
  selector: 'bui-tv-rtl-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiStatefulTreeView],
  template: wrap(`<div dir="rtl"><bui-stateful-tree-view [data]="data" /></div>`),
})
export class TreeViewRtlScenario {
  data = twoNodeData;
}

// tree-view--single-expanded
@Component({
  selector: 'bui-tv-single-expanded-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiStatefulTreeView],
  template: wrap(`<bui-stateful-tree-view [data]="data" [singleExpanded]="true" />`),
})
export class TreeViewSingleExpandedScenario {
  data: TreeNodeData[] = [
    {
      id: 1,
      label: 'Node 1',
      isExpanded: true,
      children: [
        {
          id: 2,
          label: 'Child 1.1',
          isExpanded: true,
          children: [
            {
              id: 3,
              label: 'Grandchild 1.1.1',
              isExpanded: true,
              children: [
                { id: 4, label: 'Greatgrandchild 1.1.1.1', isExpanded: true },
                { id: 5, label: 'Greatgrandchild 1.1.1.2' },
                { id: 6, label: 'Greatgrandchild 1.1.1.3' },
              ],
            },
            {
              id: 7,
              label: 'Grandchild 1.1.2',
              children: [
                { id: 8, label: 'Greatgrandchild 1.1.2.1' },
                { id: 9, label: 'Greatgrandchild 1.1.2.2' },
                { id: 10, label: 'Greatgrandchild 1.1.2.3' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 41,
      label: 'Node 2',
      children: [
        {
          id: 42,
          label: 'Child 2.1',
          children: [
            { id: 43, label: 'Grandchild 2.1.1' },
            { id: 44, label: 'Grandchild 2.1.2' },
          ],
        },
      ],
    },
  ];
}

// tree-view--icon-overrides (approximation: renders with default icons)
@Component({
  selector: 'bui-tv-icon-overrides-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiStatefulTreeView],
  template: wrap(`<bui-stateful-tree-view [data]="data" />`),
})
export class TreeViewIconOverridesScenario {
  data = twoNodeData;
}
