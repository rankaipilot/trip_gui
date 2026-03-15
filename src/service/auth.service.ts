import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environment/environment';
import { map, shareReplay, take, tap } from 'rxjs/operators';
import { ApplicationData, AuthSummary, DictionaryPath, LoginResponse, RestReport, TableDefinition, UserRegistration } from 'model/appdata';
import { RestURL } from './rest_url';
import { Observable } from 'rxjs';
import { ApplicationMenu, ConstantValue } from 'model/tripdb';
import { ActivatedRouteSnapshot, GuardResult, MaybeAsync, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { TableSearch } from 'component/table/table_search';
import { TableList } from 'component/table/table_list';
import { ReportSearch } from 'component/report/report_search';
import { ReportList } from 'component/report/report_list';
import { DashUser } from 'component/dashboard/dash_user';
import { PublicRoutes } from 'app/app.routes';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private cache!: ApplicationData;
  private appData$: Observable<ApplicationData> = new Observable<ApplicationData>();
  private readonly authIndex = new Map<string, AuthSummary[]>();
  private readonly appdataUrl = environment.httphost + RestURL.appdataURL;
  private readonly loginUrl = environment.httphost + RestURL.loginURL;
  private readonly loginSocialUrl = environment.httphost + RestURL.loginSocialURL;
  private readonly registerUrl = environment.httphost + RestURL.registerURL;
  private readonly forgotPasswordUrl = environment.httphost + RestURL.forgotPasswordURL;
  private readonly resetPasswordUrl = environment.httphost + RestURL.resetPasswordURL;

  token: string | null = null;

  loadAppData() {
    this.appData$ = this.http.get<ApplicationData>(this.appdataUrl).pipe(
        tap((data) => {
            this.cache = data;
            this.buildAuthIndex();
        }),
        shareReplay(1),
    );
    this.appData$.subscribe();
  }

  login(username: string, password: string) {
    this.http.post<LoginResponse>(this.loginUrl, { username, password }).subscribe({
        next: (res) => {
            this.token = res.token;
            localStorage.setItem('jwt', res.token);
            this.loadAppData();
            this.initRoutes();
        },
        error: (err) => {
            console.error('Login failed:', err);
        },
    });
  }

  loginSocial(provider: string, idToken: string) {
    this.http.post<LoginResponse>(this.loginSocialUrl, { provider, id_token: idToken }).subscribe({
        next: (res) => {
            this.token = res.token;
            localStorage.setItem('jwt', res.token);
            this.loadAppData();
            this.initRoutes();
        },
        error: (err) => {
            console.error('Social login failed:', err);
        },
    });
  }

  forgotPassword(email: string) {
    return this.http.post<{ message: string }>(this.forgotPasswordUrl, { email });
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post<{ message: string }>(this.resetPasswordUrl, { token, new_password: newPassword });
  }

  loadStoredSession() {
    this.token = localStorage.getItem('jwt');
    if (this.token) {
      this.loadAppData();
      this.initRoutes();
    }
  }

  logout() {
    this.token = null;
    localStorage.removeItem('jwt');
    localStorage.removeItem('menu');
  }

  register(reg: UserRegistration) {
    return this.http.post<UserRegistration>(this.registerUrl, reg);
  }

  private buildAuthIndex() {
    this.authIndex.clear();
    for (const auth of this.cache.Permissions) {
        const obj = auth.AuthorizationObjectId ?? (auth as any).ObjectName;
        const act = auth.Action;
        const low = auth.LowLimit ?? (auth as any).Low;
        if (!obj || !act || !low) continue;
        const key = obj + '|' + act;
        if (!this.authIndex.has(key)) {
            this.authIndex.set(key, []);
        }
        const reg = low
            .replace(/[.+^${}()|[\]\\]/g, '\\$&')
            .replace(/\\\*/g, '.*')
            .replace(/\\\?/g, '.');
        this.authIndex.get(key)!.push({
            Obj: obj,
            Act: act,
            Val: low,
            Reg: reg,
        } as AuthSummary);
    }
  }

  private checkPermission(authorityObjectId: string, activity: string, value: string): boolean {
    if (!this.cache || !this.cache.Permissions) {
        return false;
    }
    const key = authorityObjectId + '|' + activity;
    const auths = this.authIndex.get(key);
    if (!auths) {
        return false;
    }
    for (const auth of auths) {
        if (new RegExp(`^${auth.Reg}$`).test(value)) {
            return true;
        }
    }
    return false;
  }

  getAppData(): Observable<ApplicationData> {
    return this.appData$;
  }

  getDomainValues(domainName: string): ConstantValue[] | undefined {
    if (!this.cache || !this.cache.ConstantCache || !this.cache.ConstantCache[domainName]) {
        return undefined;
    }
    const domainMap = this.cache.ConstantCache[domainName];
    return Object.keys(domainMap).map((key) => ({
        ConstantId: domainName,
        Value: key,
        Caption: domainMap[key],
        siud_op: 'S',
    } as ConstantValue));
  }

  getMenus(): Observable<ApplicationMenu[]> {
    return this.appData$.pipe(map((data) => data?.MainMenu ?? []));
  }

  getTableDefinition(tableName: string): TableDefinition | undefined {
    if (!this.cache || !this.cache.TableDefinitions) {
      return undefined;
    }
    return this.cache.TableDefinitions[tableName];
  }

  getApiDictionary(dictionaryId: string): DictionaryPath | undefined {
    if (!this.cache || !this.cache.Apis) {
      return undefined;
    }
    return this.cache.Apis[dictionaryId];
  }

  getReports(): RestReport[] {
    if (!this.cache || !this.cache.Reports) {
      return [];
    }
    return this.cache.Reports;
  }

  canRead(tableName: string)   { return this.checkPermission('TABLE', 'SELECT', tableName); }
  canCreate(tableName: string) { return this.checkPermission('TABLE', 'INSERT', tableName); }
  canUpdate(tableName: string) { return this.checkPermission('TABLE', 'UPDATE', tableName); }
  canDelete(tableName: string) { return this.checkPermission('TABLE', 'DELETE', tableName); }
  canAccess(pageName: string)  { return this.checkPermission('PAGE', 'ACCESS', pageName); }

  canActivate(next: ActivatedRouteSnapshot, _state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    return this.getAppData().pipe(
      map(() => {
        const path = next.routeConfig?.path;
        if (!path) return true;
        const allowed = this.canAccess(path.split('/')[0]);
        return allowed;
      }),
    );
  }

  initRoutes() {
    this.getAppData().pipe(take(1)).subscribe({
        next: (data: ApplicationData) => {
            const menus = data.MainMenu ?? [];
            const apis  = data.Apis;

            const newRoutes: Routes = [
                { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
                ...PublicRoutes,
                { path: 'dashboard', component: DashUser },
            ];

            for (const menu of menus) {
                if (!menu.Id || !menu.ApplicationMenuItems) continue;
                const menuPath = menu.Id.toLowerCase();
                const children: Routes = [];

                for (const page of menu.ApplicationMenuItems) {
                    if (!page.RestUri || !page.ItemId) continue;
                    const restUri = page.RestUri;
                    if (!apis || !apis[restUri] || !apis[restUri].Table) continue;

                    const api = apis[restUri];
                    const apiName = api.Version ? api.Version + '/' + restUri : restUri;
                    const tableName = api.Table.TableName;

                    if (page.FilterOnList) {
                        children.push({
                            path: page.ItemId,
                            component: TableSearch,
                            canActivate: [(next, state) => this.canActivate(next, state)],
                            data: { tableName, apiName },
                        });
                    } else {
                        children.push({
                            path: page.ItemId,
                            component: TableSearch,
                            canActivate: [(next, state) => this.canActivate(next, state)],
                            data: {
                                tableName,
                                apiName,
                                targetRoute: menuPath + '/' + page.ItemId + '/list',
                            },
                        });
                        children.push({
                            path: page.ItemId + '/list',
                            component: TableList,
                            canActivate: [(next, state) => this.canActivate(next, state)],
                            data: { tableName, apiName },
                        });
                    }
                }

                newRoutes.push({ path: menuPath, children });
            }

            const reports = data.Reports ?? [];
            for (const report of reports) {
                if (!report.Id) continue;
                newRoutes.push({
                    path: 'report/' + report.Id,
                    component: ReportSearch,
                    data: { report },
                });
                newRoutes.push({
                    path: 'report/' + report.Id + '/list',
                    component: ReportList,
                    data: { report },
                });
            }

            this.router.resetConfig(newRoutes);
            this.router.navigate(['/dashboard']);
        },
        error: (err) => {
            console.error('initRoutes failed:', err);
        },
    });
  }
}
