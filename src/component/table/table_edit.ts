import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { BaseForm } from "component/abstract/base_form";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatTabsModule } from "@angular/material/tabs";
import { TableDetail } from "./table_detail";
import { BackendService } from "service/rest_service";
import { RecordForm } from "component/form/form_record";
import { MatButtonModule } from "@angular/material/button";

@Component({
    selector: 'table-edit',
    templateUrl: './table_edit.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [
        RecordForm,
        MatButtonModule,
        MatTabsModule,
        TableDetail,
    ]
})
export class TableEdit extends BaseForm implements OnInit {
    @Input() record: any = {};
    @Input() override tableName = '';
    @Input() apiName = '';
    isReadOnlyMode = true;
    private readonly backendService = inject(BackendService);
    private readonly dialogRef = inject(MatDialogRef<TableEdit>, {optional: true});
    private readonly dialogData = inject<any>(MAT_DIALOG_DATA as any, {optional: true});
    private readonly cdr = inject(ChangeDetectorRef);

    protected tabCount = 0;
    protected tabFields: string[] = [];

    ngOnInit(): void {
        if (this.dialogData) {
            this.record = this.dialogData.record ?? {};
            this.tableName = this.dialogData.tableName ?? '';
            this.apiName = this.dialogData.apiName ?? '';
            this.isNew = this.dialogData.isNew;
            this.isReadOnlyMode = !this.isNew;
        }
        if (this.isNew) {
            this.initializeNewRecord();
            this.buildTabs();
        } else {
            this.fetchFullRecord();
        }
    }

    private initializeNewRecord() {
        this.editableRecord = this.emptyRecord();
        if (this.record) Object.assign(this.editableRecord, this.record);
    }

    private buildTabs() {
        this.tabCount = 0;
        this.tabFields = [];
        for (const field of Object.keys(this.editableRecord)) {
            if (this.isArray(this.editableRecord[field])) {
                this.tabCount++;
                this.tabFields.push(field);
            }
        }
    }

    private fetchFullRecord() {
        this.editableRecord = {...this.record};
        this.formatRecordTimeStamp(this.editableRecord);

        const filter = this.getKeyFilters(this.record);
        if (!filter) {
            console.warn('Key definition could not be found');
            return;
        }

        this.backendService.get<any>(this.apiName, filter).subscribe({
            next: (record) => {
                if (!record) {
                    console.error('failed to read single record from the backend');
                    return;
                }
                this.editableRecord = Array.isArray(record) ? record[0] : record;
                this.formatRecordTimeStamp(this.editableRecord);
                this.buildTabs();
                this.cdr.markForCheck();
            },
            error: (error) => {
                console.error('failed to fetch full record details', error);
            },
        });
    }

    override isReadOnly(fieldName: string): boolean {
        if (this.isReadOnlyMode) return true;
        return super.isReadOnly(fieldName);
    }

    onEdit() {
        this.isReadOnlyMode = false;
        this.isNew = false;
        this.isReadOnlyBound = this.isReadOnly.bind(this);
    }

    onNew() {
        this.isReadOnlyMode = false;
        this.isNew = true;
        this.editableRecord = this.emptyRecord();
        this.isReadOnlyBound = this.isReadOnly.bind(this);
    }

    onSave() {
        const result = {...this.editableRecord};
        this.readyToSave(result);

        if (this.dialogRef) {
            this.dialogRef.close(result);
        } else {
            this.backendService.post(this.apiName, result).subscribe({
                next: () => {
                    this.isReadOnlyMode = true;
                    this.isNew = false;
                    this.isReadOnlyBound = this.isReadOnly.bind(this);
                    this.cdr.markForCheck();
                },
                error: (err) => console.error('Save failed', err),
            });
        }
    }

    onDelete() {
        if (confirm('Are you sure you want to delete this record?')) {
            const result = {...this.editableRecord};
            result[this.opField] = 'D';
            this.backendService.post(this.apiName, result).subscribe({
                next: () => {
                    this.isReadOnlyMode = true;
                    this.isReadOnlyBound = this.isReadOnly.bind(this);
                    this.cdr.markForCheck();
                },
                error: (err) => console.error('Delete failed', err),
            });
        }
    }

    onCancel() {
        if (this.dialogRef) {
            this.dialogRef.close();
            return;
        }
        this.isReadOnlyMode = true;
        this.editableRecord = {...this.record};
        this.isNew = false;
        this.isReadOnlyBound = this.isReadOnly.bind(this);
    }
}
