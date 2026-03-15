import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { BaseForm } from "component/abstract/base_form";
import { RecordForm } from "component/form/form_record";

@Component({
    selector: 'table-search',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './table_search.html',
    imports: [
        MatButtonModule,
        MatDialogModule,
        RecordForm,
    ],
})
export class TableSearch extends BaseForm implements OnInit {
    @Input() override tableName = '';
    @Input() apiName: string = '';
    @Input() targetRoute: string = '';
    searchColumns: string[] = [];

    private readonly router = inject(Router);
    private readonly cdr = inject(ChangeDetectorRef);

    ngOnInit() {
        this.title = this.getCaption() + ' Search';
        if (!this.targetRoute && (this.apiName || this.tableName)) {
            this.cacheService.getMenus().subscribe((menus) => {
                for (const menu of menus) {
                    for (const page of menu.ApplicationMenuItems!) {
                        if (this.apiName.endsWith(page.RestUri!) ||
                            (this.tableName && page.RestUri!.includes(this.tableName))
                        ) {
                            if (page.FilterOnList) {
                                this.targetRoute = '/' + menu.Id!.toLowerCase() + '/' + page.ItemId!;
                            } else {
                                this.targetRoute = '/' + menu.Id!.toLowerCase() + '/' + page.ItemId! + '/list';
                            }
                            this.cdr.markForCheck();
                            return;
                        }
                    }
                }
            });
        }
        this.editableRecord = this.emptyRecord();
        this.searchColumns = this.getDisplayedColumns();
    }

    onSearch() {
        if (!this.targetRoute) {
            alert('Navigation target not found for this table');
            return;
        }
        this.router.navigate([this.targetRoute], {queryParams: this.buildSearchTerms(this.editableRecord)});
    }

    onClear() {
        this.editableRecord = this.emptyRecord();
    }

    onAddRecord() {
        if (!this.canCreate()) {
            alert('Missing authorization to create records');
            return;
        }
        if (!this.targetRoute) {
            alert('Navigation target not found for this table');
            return;
        }
        this.router.navigate([this.targetRoute], {queryParams: {'_action': 'create'}});
    }
}
