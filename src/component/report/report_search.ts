import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportParam, RestReport } from 'model/appdata';

@Component({
    selector: 'report-search',
    templateUrl: './report_search.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
})
export class ReportSearch implements OnInit {
    report!: RestReport;
    caption = '';
    searchValues: {[key: string]: string} = {};

    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    ngOnInit() {
        this.report = this.route.snapshot.data['report'];
        this.caption = this.titleCase(this.report.Id);
        for (const param of this.report.Params ?? []) {
            this.searchValues[param.Name] = '';
        }
    }

    onSearch() {
        const params: {[key: string]: string} = {};
        for (const param of this.report.Params ?? []) {
            if (this.searchValues[param.Name]) {
                params[param.Name] = this.searchValues[param.Name];
            }
        }
        if (Object.keys(params).length === 0) return;
        this.router.navigate(['/report/' + this.report.Id + '/list'], {queryParams: params});
    }

    onClear() {
        for (const param of this.report.Params ?? []) {
            this.searchValues[param.Name] = '';
        }
    }

    inputType(param: ReportParam): string {
        switch (param.DataType.toLowerCase()) {
            case 'int': case 'float': case 'number': return 'number';
            case 'time': case 'timestamp': return 'datetime-local';
            case 'date': return 'date';
            default: return 'text';
        }
    }

    paramLabel(param: ReportParam): string {
        return param.Name.replaceAll('_', ' ').toLowerCase().split(' ')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    private titleCase(str: string): string {
        return str.replaceAll('_', ' ').toLowerCase().split(' ')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
}
