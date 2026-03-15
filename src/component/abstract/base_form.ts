import { BaseTable } from './base_table';

export abstract class BaseForm extends BaseTable {
    editableRecord: {[key: string]: any} = {};
    objectKeys = Object.keys;
    isNew = false;
    isSearchMode = false;
    title = '';

    override isReadOnly(fieldName: string): boolean {
        return !this.isNew && this.isKey(fieldName);
    }
}
