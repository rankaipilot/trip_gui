import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LabelService {
    protected labels: Map<string, string> = new Map();

    GetOptions(langcode: string, key: string): string {
        return this.labels.get(langcode) ?? '';
    }

    LoadLabels(langcode: string) {
        // TODO load language labels
    }
}
