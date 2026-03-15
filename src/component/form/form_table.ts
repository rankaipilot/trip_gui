import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BaseForm } from 'component/abstract/base_form';
import { RecordForm } from './form_record';
import { MatButtonModule } from '@angular/material/button';

interface TableFormDialogData {
    record: {[key: string]: any};
    tableName: string;
    isNew?: boolean;
    readOnlyColumns?: string[];
    attributeName?: string;
}

@Component({
    selector: 'table-form',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './form_table.html',
    imports: [
        MatButtonModule,
        MatDialogModule,
        RecordForm,
    ]
})
export class TableForm extends BaseForm implements OnInit {
    dialogRef = inject(MatDialogRef<TableForm>);
    data = inject(MAT_DIALOG_DATA as any) as TableFormDialogData;

    readOnlyColumns: string[] = [];

    constructor() {
        super();
        this.editableRecord = {...this.data.record};
        this.tableName = this.data.tableName;
        this.isNew = !!this.data.isNew;
        this.readOnlyColumns = this.data.readOnlyColumns ?? [];
    }

    ngOnInit() {}

    override isReadOnly(fieldName: string): boolean {
        if (this.readOnlyColumns.includes(fieldName)) return true;
        return false;
    }

    onSave(): void {
        const result = {...this.editableRecord};
        this.readyToSave(result);
        this.dialogRef.close(result);
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
