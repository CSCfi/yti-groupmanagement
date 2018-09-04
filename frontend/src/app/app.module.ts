import { BrowserModule } from '@angular/platform-browser';
import { Injectable, NgModule } from '@angular/core';
import { CanDeactivate, ResolveEnd, Router, RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import {
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import { AppComponent } from './components/app.component';
import { ApinaConfig, ApinaModule } from './apina';
import { FrontpageComponent } from './components/frontpage.component';
import { LanguageService } from './services/language.service';
import { TranslateValuePipe } from './pipes/translate-value.pipe';
import { LocationService } from './services/location.service';
import { UsersComponent } from './components/users.component';
import { OrganizationsComponent } from './components/organizations.component';
import { OrganizationDetailsComponent } from './components/organization-details.component';
import { NewOrganizationComponent } from './components/new-organization.component';
import { SearchUserModalComponent, SearchUserModalService } from './components/search-user-modal.component';
import { AuthorizationManager } from './services/authorization-manager.service';
import { UserRequestsComponent } from './components/user-requests.component';
import { ApiService } from './services/api.service';
import { AUTHENTICATED_USER_ENDPOINT, LOCALIZER, YtiCommonModule } from 'yti-common-ui';
import { UserDetailsComponent } from './components/user-details.component';
import {
  DeleteConfirmationModalComponent,
  DeleteConfirmationModalService
} from './components/delete-confirmation-modal.component';
import { OrganizationComponent } from './components/organization.component';
import { ConfirmationModalService } from 'yti-common-ui/components/confirmation-modal.component';
import { FormatDateTimePipe } from './pipes/format-date-time.pipe';
import { InformationAboutServiceComponent } from './components/information/information-about-service.component';
import { ModalService } from './services/modal.service';
import { NavigationBarComponent } from './components/navigation/navigation-bar.component';
import { LogoComponent } from './components/navigation/logo.component';
import {HttpModule} from "@angular/http";
import {ConfigService} from "./services/config.service";
import { of } from 'rxjs';


const localizations: { [lang: string]: string } = {
  fi: {
    ...JSON.parse(require('raw-loader!po-loader?format=mf!../../po/fi.po')),
    ...JSON.parse(require('raw-loader!po-loader?format=mf!yti-common-ui/po/fi.po'))
  },
  en: {
    ...JSON.parse(require('raw-loader!po-loader?format=mf!../../po/en.po')),
    ...JSON.parse(require('raw-loader!po-loader?format=mf!yti-common-ui/po/en.po'))
  }
};

export function resolveAuthenticatedUserEndpoint() {
  return '/api/authenticated-user';
}

export function createTranslateLoader(): TranslateLoader {
  return { getTranslation: (lang: string) => of(localizations[lang]) };
}

export function createMissingTranslationHandler(): MissingTranslationHandler {
  return {
    handle: (params: MissingTranslationHandlerParams) => {
      if (params.translateService.currentLang === 'en') {
        return params.key;
      } else {
        return '[MISSING]: ' + params.key;
      }
    }
  };
}

@Injectable()
export class ConfirmCancelEditGuard implements CanDeactivate<{ hasChanges(): boolean }> {

  constructor(private confirmationModalService: ConfirmationModalService) {
  }

  canDeactivate(target: { hasChanges(): boolean }) {
    if (!target.hasChanges()) {
      return Promise.resolve(true);
    } else {
      return this.confirmationModalService.openEditInProgress().then(() => true, () => false);
    }
  }
}

@Injectable()
export class ConfirmModalCloseEditGuard implements CanDeactivate<void> {

  constructor(private modalService: ModalService,
              private confirmationModalService: ConfirmationModalService) {
  }

  canDeactivate(target: void) {
    if (!this.modalService.isModalOpen()) {
      return Promise.resolve(true);
    } else {
      return this.confirmationModalService.openModalClose().then(() => true, () => false);
    }
  }
}

const appRoutes: Routes = [
  { path: '', component: FrontpageComponent },
  {
    path: 'newOrganization',
    component: NewOrganizationComponent,
    canDeactivate: [ConfirmModalCloseEditGuard, ConfirmCancelEditGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'organization/:id',
    component: OrganizationComponent,
    canDeactivate: [ConfirmModalCloseEditGuard, ConfirmCancelEditGuard],
    runGuardsAndResolvers: 'always'
  },
  { path: 'userDetails', component: UserDetailsComponent },
  { path: 'information', component: InformationAboutServiceComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    FrontpageComponent,
    NavigationBarComponent,
    TranslateValuePipe,
    UsersComponent,
    OrganizationsComponent,
    NewOrganizationComponent,
    SearchUserModalComponent,
    OrganizationDetailsComponent,
    UserRequestsComponent,
    UserDetailsComponent,
    DeleteConfirmationModalComponent,
    OrganizationComponent,
    FormatDateTimePipe,
    InformationAboutServiceComponent,
    LogoComponent
  ],
  entryComponents: [
    SearchUserModalComponent,
    DeleteConfirmationModalComponent
  ],
  imports: [
    BrowserModule,
    ApinaModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    NgbModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader
      }
    }),
    YtiCommonModule
  ],
  providers: [
    { provide: AUTHENTICATED_USER_ENDPOINT, useFactory: resolveAuthenticatedUserEndpoint },
    { provide: LOCALIZER, useExisting: LanguageService },
    { provide: MissingTranslationHandler, useFactory: createMissingTranslationHandler },
    LanguageService,
    LocationService,
    ApiService,
    AuthorizationManager,
    SearchUserModalService,
    DeleteConfirmationModalService,
    NgbPopover,
    ConfirmCancelEditGuard,
    ConfirmModalCloseEditGuard,
    ModalService,
    ConfigService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(apinaConfig: ApinaConfig,
              router: Router,
              modalService: ModalService) {

    apinaConfig.registerIdentitySerializer('Dictionary<string>');

    router.events.subscribe(event => {
      if (event instanceof ResolveEnd) {
        modalService.closeAllModals();
      }
    });
  }
}
