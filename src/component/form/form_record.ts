import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DynamicField } from './form_field';

@Component({
    selector: 'record-form',
    templateUrl: './form_record.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DynamicField],
})
export class RecordForm {
    readonly record = input<{[key: string]: any}>({});
    readonly tableName = input('');
    readonly fields = input<string[]>([]);
    readonly isReadOnly = input<(key: string) => boolean>(() => false);

    readonly computedFields = computed(() => {
        const f = this.fields();
        return f.length > 0 ? f : Object.keys(this.record());
    });

    isArray(value: any): boolean {
        return Array.isArray(value);
    }

    onRecordUpdate(updates: {[key: string]: any}) {
        Object.assign(this.record(), updates);
    }
}
