//import 'mdn-polyfills/Object.assign'; /* .apply error in IE; mozilla official support*/
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {ReactiveFormsModule} from "@angular/forms";
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { routing } from './app.routing';

import { AuthGuard} from './guards/auth.guard'
import { AuthenticationService } from './services/authentication.service'
import { AlertService } from './services/alert.service';
import { SearchComponent } from './client/search/search.component';
import { HomeComponent } from './home/home.component';
import { ClientDetailsComponent } from './client/client-details/client-details.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component'
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { DatePickerModule,DateModel  } from 'ng2-datepicker';
import { RouterModule, Routes } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { NavigationComponent } from './navigation/navigation.component';
import { RTCAComponent} from './client/rtca/rtca.component';
import { ClientSearchPaginationComponent} from './client/clientSearchPagination/client-search-pagination.component';
import { ProgramEligibilityComponent } from './client/program-eligibility/program-eligibility.component';


// imports for rtca
import { EnrollmentDateComponent } from './client/rtca/enrollmentDate/enrollment-date.component';
import { FamilyUnitComponent } from './client/rtca/familyUnit/family-unit.component';
import { AssetDetailsComponent } from './client/rtca/assetDetails/asset-details.component';
import { IncomeDetailsComponent } from './client/rtca/incomeDetails/income-details.component';
import { PaymentScheduleComponent } from './client/rtca/paymentSchedule/payment-schedule.component';
import { CaseClosureComponent } from './client/rtca/caseClosure/case-closure.component';
import { RssComponent} from './client/rss/rss.component';
import { DatePicker } from './date/date.component'




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SearchComponent,
    HomeComponent,
    ClientDetailsComponent,
    HeaderComponent,
    FooterComponent,
    NavbarComponent,
    NavigationComponent,
    RTCAComponent,
    RssComponent,
    ClientSearchPaginationComponent,
    ProgramEligibilityComponent,
    DatePicker,


    EnrollmentDateComponent,
    FamilyUnitComponent,
    AssetDetailsComponent,
    IncomeDetailsComponent,
    PaymentScheduleComponent,
    CaseClosureComponent,
    
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
    routing,
    NgxPaginationModule,
    NguiAutoCompleteModule,
    DatePickerModule,
    RouterModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [AuthGuard, AuthenticationService, AlertService],
  bootstrap: [AppComponent]
})
export class AppModule { }
