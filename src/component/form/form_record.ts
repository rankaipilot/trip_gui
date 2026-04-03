import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';
import { DynamicField } from './form_field';
import { AuthService } from 'service/auth.service';

@Component({
    selector: 'record-form',
    templateUrl: './form_record.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [DynamicField],
})
export class RecordForm {
    private readonly auth = inject(AuthService);
    private readonly hiddenFieldNames = ['op_code', 'PartnerId'];
    readonly record = input<{[key: string]: any}>({});
    readonly tableName = input('');
    readonly fields = input<string[]>([]);
    readonly isReadOnly = input<(key: string) => boolean>(() => false);

    private get hiddenFields(): Set<string> {
        return new Set(this.hiddenFieldNames);
    }

    readonly computedFields = computed(() => {
        const f = this.fields();
        const hidden = this.hiddenFields;
        if (f.length > 0) {
            return f.filter(key => !hidden.has(key));
        }
        const tableDef = this.auth.getTableDefinition(this.tableName());
        const recordKeys = new Set(Object.keys(this.record()));
        if (tableDef && tableDef.Columns && tableDef.Columns.length > 0) {
            return tableDef.Columns
                .filter(col => !(col.HasDefault && col.DataType === 'timestamp'))
                .sort((a, b) => a.Order - b.Order)
                .map(col => col.PascalName)
                .filter(key => !hidden.has(key) && recordKeys.has(key));
        }
        return [...recordKeys].filter(key => !hidden.has(key));
    });

    isArray(value: any): boolean {
        return Array.isArray(value);
    }

    onRecordUpdate(updates: {[key: string]: any}) {
        Object.assign(this.record(), updates);
    }
}
