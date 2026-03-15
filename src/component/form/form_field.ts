import { ChangeDetectionStrategy, Component, inject, Input, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BaseTable } from 'component/abstract/base_table';
import { ConstantValue } from 'model/tripdb';
import { TableLookup } from 'component/table/table_lookup';

@Component({
    selector: 'dynamic-field',
    templateUrl: './form_field.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
    ]
})
export class DynamicField extends BaseTable {
    @Input() override tableName = '';
    readonly value = input<any>(undefined);
    readonly valueChange = output<any>();
    readonly recordUpdate = output<{[key: string]: any}>();
    readonly field = input('');
    readonly label = input('');
    readonly readonlyField = input(false, {alias: 'readonly'});
    readonly subscriptSizing = input<'fixed' | 'dynamic'>('fixed');
    readonly appearance = input<'fill' | 'outline'>('fill');

    private readonly dialog = inject(MatDialog);

    get col() {
        return this.getColumn(this.field());
    }

    get inputType() {
        if (!this.col || !this.col.Inputtype || this.col.LookupStyle === 'S') return 'text';
        return this.col.Inputtype;
    }

    isLookupTableSearch(): boolean {
        return !!(this.col && this.col.LookupTable && this.col.LookupStyle === 'S');
    }

    get maxLength() {
        if (!this.col) return 0;
        return this.col.Size;
    }

    get scale() {
        if (!this.col) return 0;
        return this.col.Scale;
    }

    get required() {
        if (!this.col) return false;
        return this.col.Required;
    }

    get options(): ConstantValue[] {
        if (!this.col) return [];
        return this.getOptions(this.field()) ?? [];
    }

    get step() {
        if (!this.col) return 0;
        return this.col.Step;
    }

    onInputChange(event: any) {
        if (event && event.target) this.valueChange.emit(event.target.value);
    }

    onSelectChange(event: any) {
        if (event) this.valueChange.emit(event.value);
    }

    onCheckboxChange(event: any) {
        if (event) this.valueChange.emit(event.checked ? '1' : '0');
    }

    updateForeignKeys(parentRecord: any) {
        if (!this.col || !this.col.LookupTable) return;
        const fk = this.getForeignKeyConfig(this.col.LookupTable);
        const updates: {[key: string]: any} = {};
        if (fk && fk.fk) {
            fk.fk.Columns.forEach((column, index) => {
                updates[column.PascalName] = parentRecord[fk.parent.Keys[index].PascalName];
            });
        }
        this.recordUpdate.emit(updates);
        this.valueChange.emit(updates[this.field()]);
    }

    openLookup() {
        if (!this.isLookupTableSearch()) return;
        const dialogRef = this.dialog.open(TableLookup, {
            width: this.dialogWidth,
            data: {tableName: this.col?.LookupTable},
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) this.updateForeignKeys(result);
        });
    }
}
