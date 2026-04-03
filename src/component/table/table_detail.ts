import { ChangeDetectionStrategy, Component, inject, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { DynamicField } from "component/form/form_field";
import { MatButtonModule } from "@angular/material/button";
import { BaseForm } from "component/abstract/base_form";
import { MatDialog } from "@angular/material/dialog";
import { TableForm } from "component/form/form_table";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: 'table-detail',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    templateUrl: './table_detail.html',
    imports: [
        DynamicField,
        MatButtonModule,
        MatIconModule,
    ],
})
export class TableDetail extends BaseForm implements OnInit {
    @Input() override tableName = '';
    @Input() records: any[] = [];
    @Input() parentTableName = '';
    @Input() parentRecord: any = {};

    editingRecord: any = null;
    originalRecord: any = null;
    displayedColumns: string[] = [];
    fkColumns: string[] = [];

    private readonly dialog = inject(MatDialog);

    ngOnInit(): void {
        this.displayedColumns = this.getDisplayedColumns(this.records);
        const fkCfg = this.getForeignKeyConfig(this.parentTableName);
        if (fkCfg && fkCfg.fk && fkCfg.fk.Columns) {
            for (const col of fkCfg.fk.Columns) {
                this.fkColumns.push(col.PascalName);
            }
        }
    }

    override isReadOnly(fieldName: string): boolean {
        return (this.fkColumns.includes(fieldName) || super.isReadOnly(fieldName));
    }

    openEditDialog(record: any, isNew: boolean, readOnlyColumns: string[]) {
        const dialogRef = this.dialog.open(TableForm, {
            width: this.dialogWidth,
            data: this.getDialogData(record, isNew, readOnlyColumns),
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                if (isNew) {
                    this.records.push(result);
                } else {
                    Object.assign(record, result);
                }
            }
        });
    }

    addRecord() {
        const newRecord = this.emptyRecord();
        this.initializeForeignKeys(newRecord, this.parentTableName, this.parentRecord);

        if (this.displayedColumns.length > 6) {
            this.openEditDialog(newRecord, true, this.fkColumns);
        } else {
            this.records.push(newRecord);
            this.isNew = true;
            this.originalRecord = null;
        }
    }

    editRow(record: any) {
        if (this.displayedColumns.length > 6) {
            this.openEditDialog(record, false, this.fkColumns);
        } else {
            this.editingRecord = record;
            this.isNew = record[this.opField] === 'I';
            this.originalRecord = {...record};
            this.formatRecordTimeStamp(record);
        }
    }

    saveRow() {
        this.readyToSave(this.editingRecord);
        this.editingRecord = null;
        this.originalRecord = null;
        this.isNew = false;
    }

    cancelRow(record: any) {
        if (this.originalRecord) {
            Object.assign(record, this.originalRecord);
        } else {
            const index = this.records.indexOf(record);
            if (index > -1) {
                this.records.splice(index, 1);
            }
        }
        this.editingRecord = null;
        this.originalRecord = null;
        this.isNew = false;
    }

    deleteRow(record: any) {
        if (record[this.opField] === 'I') {
            const index = this.records.indexOf(record);
            if (index > -1) {
                this.records.splice(index, 1);
            }
        } else {
            record[this.opField] = 'D';
        }
    }

    unDeleteRow(record: any) {
        if (record[this.opField] === 'D') {
            record[this.opField] = 'U';
        }
    }
}
