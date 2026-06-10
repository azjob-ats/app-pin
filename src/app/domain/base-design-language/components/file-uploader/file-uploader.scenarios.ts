import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BuiFileUploader, FileRow } from './file-uploader.component';

// file-uploader--file-uploader
@Component({
  selector: 'bui-fu-default-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiFileUploader],
  template: `<div style="padding:16px;max-width:480px"><bui-file-uploader /></div>`,
})
export class FileUploaderScenario {}

// file-uploader--item-preview
@Component({
  selector: 'bui-fu-item-preview-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiFileUploader],
  template: `<div style="padding:16px;max-width:480px"><bui-file-uploader itemPreview hint="Try uploading a file to see the itemPreview" /></div>`,
})
export class FileUploaderItemPreviewScenario {}

// file-uploader--label-hint
@Component({
  selector: 'bui-fu-label-hint-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiFileUploader],
  template: `<div style="padding:16px;max-width:480px"><bui-file-uploader label="Test label" hint="Test hint" /></div>`,
})
export class FileUploaderLabelHintScenario {}

// file-uploader--long-loading
@Component({
  selector: 'bui-fu-long-loading-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiFileUploader],
  template: `
    <div style="padding:16px;max-width:480px">
      <bui-file-uploader
        hint="Try uploading a file, it will load for 10 seconds"
        [processFileOnDrop]="processFile"
      />
    </div>
  `,
})
export class FileUploaderLongLoadingScenario {
  processFile = (_file: File): Promise<{ errorMessage: string | null }> =>
    new Promise((resolve) => setTimeout(() => resolve({ errorMessage: null }), 10000));
}

// file-uploader--long-loading-multiple-files
@Component({
  selector: 'bui-fu-long-loading-multiple-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiFileUploader],
  template: `
    <div style="padding:16px;max-width:480px">
      <bui-file-uploader
        hint="Try uploading multiple files at once to see the progress bar upload independently for each file"
        [processFileOnDrop]="processFile"
        [progressAmountStartValue]="0"
      />
    </div>
  `,
})
export class FileUploaderLongLoadingMultipleScenario {
  fileRows = signal<FileRow[]>([]);

  processFile = (
    fileToProcess: File,
    fileToProcessId: string,
    fileRows: FileRow[],
  ): Promise<{ errorMessage: string | null }> => {
    return new Promise((resolve) => {
      const fileRowsCopy: FileRow[] = [...fileRows];
      const indexOfFileToUpdate = fileRowsCopy.findIndex((r) => r.id === fileToProcessId);
      const numberOfMockedLoadingSteps = 5 - (indexOfFileToUpdate % 3);
      const mockedTotalLoadingTime = indexOfFileToUpdate % 2 === 0 ? 10000 : 8000;

      for (let i = 0; i <= numberOfMockedLoadingSteps; i++) {
        if (i === numberOfMockedLoadingSteps) {
          setTimeout(() => resolve({ errorMessage: null }), mockedTotalLoadingTime);
        } else {
          setTimeout(() => {
            const progressAmount = (i / numberOfMockedLoadingSteps) * 100;
            this.fileRows.set(
              fileRowsCopy.map((r) =>
                r.id === fileToProcessId ? { ...r, progressAmount } : r,
              ),
            );
          }, (i / numberOfMockedLoadingSteps) * mockedTotalLoadingTime);
        }
      }
    });
  };
}

// file-uploader--overrides
@Component({
  selector: 'bui-fu-overrides-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiFileUploader],
  template: `
    <div style="padding:16px;max-width:480px">
      <bui-file-uploader
        label="Upload documents"
        hint="Max file size: 10 MB"
        itemPreview
        [accept]="['image/png', 'image/jpeg', 'application/pdf']"
      />
    </div>
  `,
})
export class FileUploaderOverridesScenario {}

// file-uploader--upload-restrictions
@Component({
  selector: 'bui-fu-upload-restrictions-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiFileUploader],
  template: `
    <div style="padding:16px;max-width:480px">
      <bui-file-uploader
        [accept]="['image/png', 'application/pdf']"
        [maxFiles]="3"
        [maxSize]="100000"
        [minSize]="20000"
        hint="Try uploading files that break these conditions: 1. accept set to [&quot;image/png&quot;, &quot;application/pdf&quot;], 2. minSize set to 20000 bytes (20 KB), 3. maxSize set to 100000 bytes (100 KB), 4. maxFiles set to 3"
      />
    </div>
  `,
})
export class FileUploaderUploadRestrictionsScenario {}
