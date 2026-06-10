import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BuiFileUploaderBasic } from './file-uploader-basic.component';

// file-uploader-basic--file-uploader
@Component({
  selector: 'bui-fub-default-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiFileUploaderBasic],
  template: `<div style="padding:16px;max-width:480px"><bui-file-uploader-basic /></div>`,
})
export class FileUploaderBasicScenario {}

// file-uploader-basic--pre-drop
@Component({
  selector: 'bui-fub-pre-drop-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiFileUploaderBasic],
  template: `<div style="padding:16px;max-width:480px"><bui-file-uploader-basic /></div>`,
})
export class FileUploaderBasicPreDropScenario {}

// file-uploader-basic--post-drop
@Component({
  selector: 'bui-fub-post-drop-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiFileUploaderBasic],
  template: `<div style="padding:16px;max-width:480px"><bui-file-uploader-basic progressMessage="uploading..." [progressAmount]="40" /></div>`,
})
export class FileUploaderBasicPostDropScenario {}

// file-uploader-basic--spinner
@Component({
  selector: 'bui-fub-spinner-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiFileUploaderBasic],
  template: `<div style="padding:16px;max-width:480px"><bui-file-uploader-basic progressMessage="Uploading... hang tight." /></div>`,
})
export class FileUploaderBasicSpinnerScenario {}

// file-uploader-basic--progress-bar
@Component({
  selector: 'bui-fub-progress-bar-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiFileUploaderBasic],
  template: `<div style="padding:16px;max-width:480px"><bui-file-uploader-basic [progressAmount]="40" progressMessage="Uploading... 8.24 of 45.08MB" /></div>`,
})
export class FileUploaderBasicProgressBarScenario {}

// file-uploader-basic--error
@Component({
  selector: 'bui-fub-error-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiFileUploaderBasic],
  template: `<div style="padding:16px;max-width:480px"><bui-file-uploader-basic [progressAmount]="40" progressMessage="Uploading... 8.24 of 45.08MB" errorMessage="Upload failed... connection was lost." /></div>`,
})
export class FileUploaderBasicErrorScenario {}

// file-uploader-basic--disabled
@Component({
  selector: 'bui-fub-disabled-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiFileUploaderBasic],
  template: `<div style="padding:16px;max-width:480px"><bui-file-uploader-basic disabled /></div>`,
})
export class FileUploaderBasicDisabledScenario {}
