import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { RestReport } from 'model/appdata';
import { ReportService } from 'service/report_service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'report-list',
    templateUrl: './report_list.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportList implements OnInit, OnDestroy {
    private report!: RestReport;

    caption = '';
    records = signal<{[key: string]: unknown}[]>([]);
    displayedColumns = signal<string[]>([]);
    loading = signal(false);

    private readonly route = inject(ActivatedRoute);
    private readonly reportService = inject(ReportService);
    private queryParamsSub?: Subscription;

    ngOnInit() {
        this.report = this.route.snapshot.data['report'];
        this.caption = this.titleCase(this.report.Id);
        this.queryParamsSub = this.route.queryParams.subscribe((params) => this.handleQueryParams(params));
    }

    ngOnDestroy() {
        this.queryParamsSub?.unsubscribe();
    }

    colCaption(fieldName: string): string {
        return fieldName.replace(/([A-Z])/g, ' $1').trim();
    }

    private handleQueryParams(params: Params) {
        const filter: {[key: string]: string} = {};
        for (const key in params) {
            if (Object.prototype.hasOwnProperty.call(params, key)) {
                filter[key] = params[key];
            }
        }
        if (Object.keys(filter).length === 0) return;
        this.fetchReport(filter);
    }

    private fetchReport(params: {[key: string]: string}) {
        this.loading.set(true);
        this.reportService.fetch<{[key: string]: unknown}>(this.report.Version, this.report.QueryName, params).subscribe({
            next: (data) => {
                this.records.set(data);
                if (data.length > 0) {
                    this.displayedColumns.set(Object.keys(data[0]));
                }
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Report fetch failed', err);
                this.loading.set(false);
            },
        });
    }

    private titleCase(str: string): string {
        return str.replaceAll('_', ' ').toLowerCase().split(' ')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
}
