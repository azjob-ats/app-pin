import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  signal,
} from '@angular/core';
import { BuiStyledGridTable, BuiStyledGridHeadCell, BuiStyledBodyCell, BuiGridSortableHeadCell } from './table-grid.component';
import type { SortDirection } from '../table/table.component';

/* ── table-grid (main) ──────────────────────────────────────────────────────── */

const GRID_DATA = Array.from({ length: 100 }, () => [
  `As we find ourselves caught between unraveling old realities and emerging weird ones, Worlding — creating art, games, institutions, religions, or life itself: live to world and world to live.`,
  'Cell two', 'Cell three', 'Cell four', 'Cell five', 'Cell six',
]);

@Component({
  selector: 'bui-s-table-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStyledGridTable, BuiStyledGridHeadCell, BuiStyledBodyCell],
  styleUrl: './table-grid.component.scss',
  template: `
    <div style="height:750px;width:900px">
      <bui-styled-grid-table
        tabindex="0"
        gridTemplateColumns="minmax(400px,max-content) 200px 200px 200px 200px 200px"
      >
        <bui-styled-grid-head-cell [attr.aria-colindex]="1">Column 1</bui-styled-grid-head-cell>
        <bui-styled-grid-head-cell [attr.aria-colindex]="2">Column 2</bui-styled-grid-head-cell>
        <bui-styled-grid-head-cell [attr.aria-colindex]="3">Column 3</bui-styled-grid-head-cell>
        <bui-styled-grid-head-cell [attr.aria-colindex]="4">Column 4</bui-styled-grid-head-cell>
        <bui-styled-grid-head-cell [attr.aria-colindex]="5">Column 5</bui-styled-grid-head-cell>
        <bui-styled-grid-head-cell [attr.aria-colindex]="6">Column 6</bui-styled-grid-head-cell>
        @for (row of data; track $index) {
          <bui-styled-body-cell [attr.aria-rowindex]="$index + 2" [attr.aria-colindex]="1">{{ row[0] }}</bui-styled-body-cell>
          <bui-styled-body-cell [attr.aria-rowindex]="$index + 2" [attr.aria-colindex]="2">{{ row[1] }}</bui-styled-body-cell>
          <bui-styled-body-cell [attr.aria-rowindex]="$index + 2" [attr.aria-colindex]="3">{{ row[2] }}</bui-styled-body-cell>
          <bui-styled-body-cell [attr.aria-rowindex]="$index + 2" [attr.aria-colindex]="4">{{ row[3] }}</bui-styled-body-cell>
          <bui-styled-body-cell [attr.aria-rowindex]="$index + 2" [attr.aria-colindex]="5">{{ row[4] }}</bui-styled-body-cell>
          <bui-styled-body-cell [attr.aria-rowindex]="$index + 2" [attr.aria-colindex]="6">{{ row[5] }}</bui-styled-body-cell>
        }
      </bui-styled-grid-table>
    </div>
  `,
})
export class TableGridScenario {
  protected readonly data = GRID_DATA;
}

/* ── table-grid-jobs ────────────────────────────────────────────────────────── */

type JobStatus = 'running' | 'passed' | 'failed';
interface JobRow { name: string; status: JobStatus; date: string; commit: string; tasks: Array<{name: string; status: JobStatus; date: string; description: string}> }

const STATUS_COLOR: Record<JobStatus, string> = { running: '#276ef1', passed: '#027a48', failed: '#ae1900' };

const JOBS: JobRow[] = Array.from({ length: 3 }, (_, i) => ({
  name: `Baseui Github CI Job ${i + 1}`,
  status: (['running', 'passed', 'failed'] as JobStatus[])[i % 3],
  date: '2019-07-22',
  commit: 'feat(side-navigation): improve item rendering performance',
  tasks: [
    { name: 'buildkite/baseui', status: 'running', date: '2019-07-22', description: 'Build #7728 in progress' },
    { name: 'buildkite/baseui/eslint', status: 'passed', date: '2019-07-22', description: 'Passed (1 minute, 34 seconds)' },
    { name: 'buildkite/baseui/flowtype', status: 'passed', date: '2019-07-22', description: 'Passed (1 minute, 33 seconds)' },
  ],
}));

@Component({
  selector: 'bui-s-table-grid-jobs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStyledGridTable, BuiStyledGridHeadCell, BuiStyledBodyCell],
  styleUrl: './table-grid.component.scss',
  template: `
    <div style="height:600px;width:1000px">
      <bui-styled-grid-table
        tabindex="0"
        gridTemplateColumns="2fr 1fr 1fr 1fr 3fr"
      >
        <bui-styled-grid-head-cell>Job</bui-styled-grid-head-cell>
        <bui-styled-grid-head-cell>Status</bui-styled-grid-head-cell>
        <bui-styled-grid-head-cell>Date</bui-styled-grid-head-cell>
        <bui-styled-grid-head-cell>Commit</bui-styled-grid-head-cell>
        <bui-styled-grid-head-cell>Task</bui-styled-grid-head-cell>
        @for (job of jobs; track $index) {
          <bui-styled-body-cell [gridRow]="'span ' + job.tasks.length">{{ job.name }}</bui-styled-body-cell>
          <bui-styled-body-cell [gridRow]="'span ' + job.tasks.length" [style.color]="statusColor(job.status)">{{ job.status }}</bui-styled-body-cell>
          <bui-styled-body-cell [gridRow]="'span ' + job.tasks.length">{{ job.date }}</bui-styled-body-cell>
          <bui-styled-body-cell [gridRow]="'span ' + job.tasks.length">{{ job.commit }}</bui-styled-body-cell>
          @for (task of job.tasks; track $index) {
            <bui-styled-body-cell [striped]="$index % 2 === 0">
              <span [style.color]="statusColor(task.status)">●</span>
              {{ task.name }}
              <br />
              <small style="color:#545454">{{ task.description }}</small>
            </bui-styled-body-cell>
          }
        }
      </bui-styled-grid-table>
    </div>
  `,
})
export class TableGridJobsScenario {
  protected readonly jobs = JOBS;
  protected statusColor(status: JobStatus): string { return STATUS_COLOR[status]; }
}

/* ── table-grid-records ─────────────────────────────────────────────────────── */

type RecordEvent = [string, string];
interface RecordRow { title: string; link: string; summary: string; type: string; author: string; events: RecordEvent[] }

const RECORD: RecordRow = {
  title: 'feat(docs-site): theme editor POC',
  link: 'https://github.com/uber/baseweb/pull/1296',
  summary: `integrates an inline theme editor for the base web documentation site user can edit a theme and see update applied to site globally`,
  type: 'feature',
  author: 'jh3y',
  events: [
    ['2019-07-22', 'jh3y added a commit'],
    ['2019-07-22', 'chasestarr left a comment'],
    ['2019-07-22', 'jh3y left a comment'],
    ['2019-07-22', 'chasestarr left a comment'],
    ['2019-07-22', 'jh3y added a commit'],
    ['2019-07-22', 'jh3y marked this pull request as ready'],
  ],
};

const RECORDS: RecordRow[] = [RECORD, RECORD, RECORD, RECORD, RECORD, RECORD, RECORD];

@Component({
  selector: 'bui-s-table-grid-records',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStyledGridTable, BuiStyledGridHeadCell, BuiStyledBodyCell],
  styleUrl: './table-grid.component.scss',
  template: `
    <div style="height:600px">
      <bui-styled-grid-table
        tabindex="0"
        gridTemplateColumns="auto minmax(auto,500px) repeat(4,auto)"
      >
        <bui-styled-grid-head-cell>Name</bui-styled-grid-head-cell>
        <bui-styled-grid-head-cell>Summary</bui-styled-grid-head-cell>
        <bui-styled-grid-head-cell>Release Type</bui-styled-grid-head-cell>
        <bui-styled-grid-head-cell>Author</bui-styled-grid-head-cell>
        <bui-styled-grid-head-cell>Date</bui-styled-grid-head-cell>
        <bui-styled-grid-head-cell>Event</bui-styled-grid-head-cell>
        @for (row of records; track $index) {
          <bui-styled-body-cell [gridRow]="'span ' + row.events.length">
            <a [href]="row.link" style="color:#276ef1">{{ row.title }}</a>
          </bui-styled-body-cell>
          <bui-styled-body-cell [gridRow]="'span ' + row.events.length">{{ row.summary }}</bui-styled-body-cell>
          <bui-styled-body-cell [gridRow]="'span ' + row.events.length">{{ row.type }}</bui-styled-body-cell>
          <bui-styled-body-cell [gridRow]="'span ' + row.events.length">{{ row.author }}</bui-styled-body-cell>
          @for (ev of row.events; track $index) {
            <bui-styled-body-cell [striped]="$index % 2 === 0">{{ ev[0] }}</bui-styled-body-cell>
            <bui-styled-body-cell [striped]="$index % 2 === 0">{{ ev[1] }}</bui-styled-body-cell>
          }
        }
      </bui-styled-grid-table>
    </div>
  `,
})
export class TableGridRecordsScenario {
  protected readonly records = RECORDS;
}

/* ── table-grid-sortable ────────────────────────────────────────────────────── */

const SORT_DATA: Array<[string, number]> = [
  ['Marlyn', 10], ['Luther', 15], ['Kiera', 13], ['Edna', 20],
  ['Soraya', 18], ['Dorris', 32], ['Astrid', 26], ['Wendie', 17],
  ['Marna', 11], ['Malka', 14], ['Jospeh', 10], ['Roselee', 12],
  ['Justine', 35], ['Marlon', 30], ['Mellissa', 32], ['Fausto', 21],
  ['Alfredia', 22], ['Abel', 18], ['Winford', 19], ['Neil', 27],
];

@Component({
  selector: 'bui-s-table-grid-sortable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStyledGridTable, BuiStyledBodyCell, BuiGridSortableHeadCell],
  styleUrl: './table-grid.component.scss',
  template: `
    <bui-styled-grid-table tabindex="0" gridTemplateColumns="repeat(2,1fr)">
      <bui-grid-sortable-head-cell
        title="Name"
        [direction]="nameDir()"
        (onSort)="handleSort('name')"
      />
      <bui-grid-sortable-head-cell
        title="Age"
        [direction]="ageDir()"
        disabled
        (onSort)="handleSort('age')"
      />
      @for (row of sortedData(); track $index) {
        <bui-styled-body-cell [attr.aria-rowindex]="$index + 2" [attr.aria-colindex]="1">{{ row[0] }}</bui-styled-body-cell>
        <bui-styled-body-cell [attr.aria-rowindex]="$index + 2" [attr.aria-colindex]="2">{{ row[1] }}</bui-styled-body-cell>
      }
    </bui-styled-grid-table>
  `,
})
export class TableGridSortableScenario {
  protected readonly nameDir = signal<SortDirection>(null);
  protected readonly ageDir = signal<SortDirection>(null);

  protected handleSort(col: 'name' | 'age'): void {
    const prev = col === 'name' ? this.nameDir() : this.ageDir();
    const next: SortDirection = prev === null ? 'ASC' : prev === 'ASC' ? 'DESC' : null;
    if (col === 'name') { this.nameDir.set(next); this.ageDir.set(null); }
    else { this.ageDir.set(next); this.nameDir.set(null); }
  }

  protected readonly sortedData = computed((): Array<[string, number]> => {
    const nd = this.nameDir(), ad = this.ageDir();
    if (nd) {
      const s = [...SORT_DATA].sort((a, b) => a[0].localeCompare(b[0]));
      return nd === 'ASC' ? s : s.reverse();
    }
    if (ad) {
      const s = [...SORT_DATA].sort((a, b) => a[1] - b[1]);
      return ad === 'ASC' ? s : s.reverse();
    }
    return SORT_DATA;
  });
}
