import { inject } from '@angular/core';
import { ForeignKey, TableColumn, TableDefinition } from 'model/appdata';
import { ConstantValue } from 'model/tripdb';
import { AuthService } from 'service/auth.service';

export enum ColumnType {
  PG_BOOL      = 0,
  PG_INT2      = 1,
  PG_INT4      = 2,
  PG_INT8      = 3,
  PG_NUMERIC   = 4,
  PG_FLOAT8    = 5,
  PG_BPCHAR    = 6,
  PG_VARCHAR   = 7,
  PG_TEXT      = 8,
  PG_JSONB     = 9,
  PG_BYTEA     = 10,
  PG_TIMESTAMP = 11,
  PG_DATE      = 12,
}

export abstract class BaseTable {
    protected readonly cacheService = inject(AuthService);
    protected readonly dialogWidth: string = '400px';
    tableName = '';
    caption = '';
    fieldOptions: {[key: string]: ConstantValue[]} = {};
    fieldLabels: {[key: string]: string} = {};
    isReadOnlyBound = this.isReadOnly.bind(this);

    isReadOnly(_fieldName: string): boolean {
        return false;
    }

    titleCase(str: string): string {
        return str.replaceAll('_', ' ').toLowerCase().split(' ').map((word: string) => {
                return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
    }

    getCaption() {
        if (!this.caption) {
            this.caption = this.titleCase(this.tableName);
        }
        return this.caption;
    }

    colCaption(fieldName: string): string {
        if (!this.fieldLabels[fieldName]) {
            this.fieldLabels[fieldName] = this.titleCase(fieldName);
        }
        return this.fieldLabels[fieldName];
    }

    canRead() {
        return this.cacheService.canRead(this.tableName);
    }

    canCreate() {
        return this.cacheService.canCreate(this.tableName);
    }

    canUpdate() {
        return this.cacheService.canUpdate(this.tableName);
    }

    canDelete() {
        return this.cacheService.canDelete(this.tableName);
    }

    emptyRecord(): any {
        const record: any = {siud_op: 'I'};
        const tableDef = this.cacheService.getTableDefinition(this.tableName);

        if (tableDef) {
            if (tableDef.Columns) {
                tableDef.Columns.forEach((field) => {
                    record[field.PascalName] = '';
                });
            }
            if (tableDef.Children) {
                tableDef?.Children.forEach((child) => {
                    record[child.PascalName] = [];
                });
            }
        }
        return record;
    }

    getDisplayedColumns(records: any[] = []): string[] {
        const tableDef = this.cacheService.getTableDefinition(this.tableName);
        if (tableDef && tableDef.Columns && tableDef.Columns.length > 0) {
            return tableDef.Columns.sort((a, b) => a.Order - b.Order).map((field) => field.PascalName);
        } else if (records.length > 0) {
            return Object.keys(records[0]);
        }
        return [];
    }

    getColumn(fieldName: string): TableColumn | undefined {
        const tableDef = this.cacheService.getTableDefinition(this.tableName);
        if (tableDef && tableDef.Columns) {
            return tableDef.Columns.find((field) => field.PascalName === fieldName);
        }
        return undefined;
    }

    isTimeStamp(fieldName: string): boolean {
        const col = this.getColumn(fieldName);
        if (col) {
            return (col.Datatype == ColumnType.PG_TIMESTAMP || col.Datatype == ColumnType.PG_DATE);
        }
        return fieldName.endsWith('Time') || fieldName.endsWith('time');
    }

    isNumber(fieldName: string): boolean {
        const col = this.getColumn(fieldName);
        if (col) {
            return (col.Datatype == ColumnType.PG_INT2 || col.Datatype == ColumnType.PG_INT4 || col.Datatype == ColumnType.PG_INT8 || col.Datatype == ColumnType.PG_NUMERIC || col.Datatype == ColumnType.PG_FLOAT8);
        }
        return false;
    }

    isBoolean(fieldName: string): boolean {
        const col = this.getColumn(fieldName);
        if (col) {
            return (col.LookupDomain == 'BOOLEAN');
        }
        return false;
    }

    isKey(fieldName: string): boolean {
        const col = this.getColumn(fieldName);
        if (col) {
            return (col.IsKey);
        }
        return false;
    }

    isArray(value: any): boolean {
        return Array.isArray(value);
    }

    formatTimeStamp(val: string): string {
        if (val && typeof val === 'string') {
            return val.slice(0, 16);
        }
        return val;
    }

    formatRecordTimeStamp(record: any) {
        if (record) {
            for (const key of Object.keys(record)) {
                if (this.isTimeStamp(key)) {
                    record[key] = this.formatTimeStamp(record[key]);
                }
            }
        }
    }

    restoreTimeStamp(val: string): string {
        if (val && typeof val === 'string' && !val.endsWith('Z')) {
            return val + ':00Z';
        }
        return val;
    }

    restoreRecordTimeStamp(record: any) {
        if (record) {
            for (const key of Object.keys(record)) {
                if (this.isTimeStamp(key)) {
                    record[key] = this.restoreTimeStamp(record[key]);
                }
            }
        }
    }

    readyToSave(record: any) {
        this.restoreRecordTimeStamp(record);
        if (record['siud_op'] !== 'I' && record['siud_op'] !== 'D') {
            record['siud_op'] = 'U';
        }
    }

    getDialogData(record: any, isNew: boolean, readOnlyColumns: string[] = []): any {
        return {record, tableName: this.tableName, isNew, readOnlyColumns};
    }

    getTableName(fieldName: string): string {
        const tableDef = this.cacheService.getTableDefinition(this.tableName);
        if (!tableDef) return '';
        const fk = tableDef.Children?.find((c) => c.PascalName == fieldName);
        return fk ? fk.ChildTable : '';
    }

    getOptions(fieldName: string): ConstantValue[] | undefined {
        if (this.fieldOptions[fieldName]) {
            return this.fieldOptions[fieldName];
        }
        const col = this.getColumn(fieldName);
        if (col && col.LookupDomain) {
            return this.cacheService.getDomainValues(col.LookupDomain);
        }
        return undefined;
    }

    getKeyFilters(record: any): {[key: string]: string} | undefined {
        const tableDef = this.cacheService.getTableDefinition(this.tableName);
        if (!tableDef || !tableDef.Keys || tableDef.Keys.length === 0) {
            return undefined;
        }
        const filters: {[key: string]: string} = {};
        for (const key of tableDef.Keys) {
            filters[key.PascalName] = record[key.PascalName];
        }
        return filters;
    }

    getForeignKeyConfig(parentTable: string): {fk: ForeignKey, parent: TableDefinition} | null {
        if (!parentTable) return null;
        const tableDef = this.cacheService.getTableDefinition(this.tableName);
        const parent = this.cacheService.getTableDefinition(parentTable);
        if (!tableDef || !tableDef.Keys || !tableDef.Parents || !parent) return null;
        const fk = tableDef.Parents.find((parent) => parent.ParentTable === parentTable);
        if (!fk) return null;
        return {'fk': fk, 'parent': parent};
    }

    initializeForeignKeys(record: any, parentTable: string, parentRecord: any) {
        const readOnlyColumns: string[] = [];
        const fkData = this.getForeignKeyConfig(parentTable);
        if (fkData && fkData.fk && fkData.parent) {
            fkData.fk.Columns.forEach((column, index) => {
                record[column.PascalName] = parentRecord[fkData.parent.Keys[index].PascalName];
                readOnlyColumns.push(column.PascalName);
            });
        }
    }

    updateInput(record: any, field: string, event: any) {
        if (event && event.target) {
            record[field] = event.target.value;
        }
    }

    buildSearchTerms(record: {[key: string]: any}): {[key: string]: string} {
        const searchTerms: {[key: string]: string} = {};
        for (const key of Object.keys(record)) {
            const val = record[key];
            if (val !== '' && val !== null && val !== undefined && !Array.isArray(val)) {
                searchTerms[key] = val;
            }
        }
        return searchTerms;
    }
}
