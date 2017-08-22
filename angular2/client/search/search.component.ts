import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, Directive, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ClientSearchRequest } from './clientSearchRequest.model';
import { ClientSearchResult } from './clientSearchResult.model';
import { ClientService } from '../client.service';
import { Observable } from 'rxjs/Rx';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { ElementRef } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { DatePickerOptions, DateModel } from 'ng2-datepicker';
import { DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { PaginationInstance } from 'ngx-pagination';
import { ValidationService } from '../../formCustomValidators/form-custom-validators.service';
import { DatePicker } from '../../date/date.component'

@Component({
  entryComponents: [DatePicker],
  selector: 'client-search',
  templateUrl: './search.component.html',
  providers: [ClientService, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {
  dob: Date;
  dateOfEntry: Date;
  dateOfEntry1: Date;
  mymodel = '';
  clientSearchRequest: FormGroup;
  clientSearchResults: ClientSearchResult[];
  clientSearchResultsAvailable = false;
  currentSearchRequest = {};

  total: number;
  loading: boolean;
  totalElements: number;

  dateModel: DateModel;
  p: number = 1;
  size: number = 2;

  minVal = (this.p - 1) * this.size + 1;
  maxVal = this.size * this.p;

  headerSearchClicked = false;
  mainSearchClicked = false;
  public elementRef;

  constructor(myElement: ElementRef,
    private ref: ChangeDetectorRef,
    private fb: FormBuilder,
    private clientService: ClientService,
    private _sanitizer: DomSanitizer,
    private router: Router,
    private datePipe: DatePipe,
    private route: ActivatedRoute) {
    this.elementRef = myElement;
    this.clientSearchRequest = this.fb.group({
      alienNmbr: ['', [Validators.maxLength(9), ValidationService.onlyNumber, ValidationService.leadingZeros]],
      firstName: ['', [Validators.minLength(1)]],
      lastName: ['', [Validators.minLength(2)]],
      dateOfBirth: ['', [ValidationService.invalidDateFormat]],
      entryDate: ['', [ValidationService.invalidDateFormat]]
    });

  }

  public alienNumbers = [];

  qsearchtxtRouteParam = '';

  autocompleListFormatter = (data: any): SafeHtml => {
    let html = `<span>${data}</span>`;
    return html;
  }

  ngOnInit() {

    this.clientSearchRequest.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();

    //adding quick search parsing
    this.route.params.subscribe(params => {
      let qsearchtxt: string = params['searchstr'];
      this.qsearchtxtRouteParam = qsearchtxt;
      console.log("updated params");
      if (qsearchtxt) {
        this.p = 1;
        this.updateStats(this.p, this.size);
        this.getPageFromRoute(qsearchtxt, 0);
      }
    },
      failure => { console.log("Eror in getting the results " + failure) }
    );

  }
  formErrors = {
    'alienNmbr': '',
    'firstName': '',
    'lastName': '',
    'entryDate': '',
    'dateOfBirth': ''
  };
  getPageFromRoute(qsearchtxt, p) {
    this.headerSearchClicked = true;
    this.mainSearchClicked = false;
    this.clientService.getQuickSearchResults(qsearchtxt, p, this.size).subscribe(
      data => {
        this.clientSearchResultsAvailable = true;
        this.clientSearchResults = data.content;
        this.totalElements = data.totalElements;
        this.ref.markForCheck();
      },
      errors => { console.log("Eror in getting the quick search results " + errors) },
    );
  }

  getPage(p: number) {
    this.p = p;
    this.updateStats(this.p, this.size);
    this.loading = true;

    if (this.mainSearchClicked) {
      this.clientService.getClientSearchResults(this.currentSearchRequest, p - 1, this.size).subscribe(
        data => {
          this.loading = false;
          this.clientSearchResultsAvailable = true;
          this.clientSearchResults = data.content;
          this.totalElements = data.totalElements;
          this.ref.markForCheck();
        },
        errors => { console.log("Eror in getting the results " + errors) },
        () => { console.log("Done") }
      );
    } else {
      this.getPageFromRoute(this.qsearchtxtRouteParam, this.p - 1);
    }

  }
  onValueChanged(data?: any) {
    //alert("called.."+data);
    if (!this.clientSearchRequest) { return; }
    const form = this.clientSearchRequest;
    for (const field in this.formErrors) {
      //alert("field : "+field.toString);
      this.formErrors[field] = '';
      const control = form.get(field);
     // alert("control : "+control.dirty+" valid : "+control.valid);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          console.log("key " + key);
          console.log("field " + field);
         // alert("field : "+field);
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }

  }

  dobChangeEvent(event){
    //alert("dobChangeEvent called..."+event);

     this.formErrors.dateOfBirth="Date is invalida";
  }
  
  validationMessages = {
    'alienNmbr': {
      'maxlength': 'Alien Number cannot be more than 9 digits.',
      'pattern': 'Not a valid Number',
      'notNum': 'Please check the value entered is a number',
      'leadingZeros': 'No Leading Zeros'
    },
    'firstName': {
      'minlength': 'Atleast 2 characters is required.'
    },
    'lastName': {
      'minlength': 'Atleast 2 characters is required.'
    },
    'dateOfBirth': {
      'invalidDateFormat': 'Please Enter Valid date '
    },
    'entryDate': {
      'invalidDateFormat': 'Please Enter Valid date '
    },
  };

  updateStats(p, size) {
    this.p = p;
    this.minVal = (p - 1) * size + 1;
    this.maxVal = size * p;
    this.ref.markForCheck();
  }
  onSubmit({ value }: { value: ClientSearchRequest }) {
    this.p = 1;
    this.updateStats(this.p, this.size);
    this.mainSearchClicked = true;
    this.headerSearchClicked = false;
    this.currentSearchRequest = value;
    if (this.dateOfEntry) {
      value.entryDate = this.datePipe.transform(this.dateOfEntry, 'MM/dd/yyyy');
    }
    if (this.dob) {
      value.dateOfBirth = this.datePipe.transform(this.dob, 'MM/dd/yyyy');
    }

    this.clientService.getClientSearchResults(value, 0, this.size).subscribe(
      data => {
        this.clientSearchResultsAvailable = true;
        this.clientSearchResults = data.content;
        if (this.clientSearchResults.length == 1) {
          this.router.navigate(['/home/client/details/' + this.clientSearchResults[0].alienNmbr]);
        }
        this.totalElements = data.totalElements;
        this.ref.markForCheck();
      },
      errors => { console.log("Eror in getting the results " + errors) },
      () => { console.log("Done") }
    );

  }

  cancel(e) {
    e.preventDefault();
    this.clientSearchRequest.reset();
    this.clientSearchResultsAvailable = false;
    this.clientSearchResults = null;
  }
  autoCompleteValuechange(pattern) {
    this.mymodel = pattern;
    if (pattern) {
      if (pattern.length != 0) {
        this.clientService.getAlienNbrsAutoCompleteResults(pattern).subscribe(
          data => {
            this.alienNumbers.length = 0;
            for (var i = 0; i < data.length; i++) {
              let temp = { "alienNmbr": JSON.parse(JSON.stringify(data[i])).alienNmbr }
              this.alienNumbers.push(temp.alienNmbr);
              this.ref.markForCheck();
            }
          },
          errors => { console.log("Eror in getting the results " + errors) },
          () => { console.log("Done") }
        );
      }
      else {
        this.alienNumbers.length = 0;
        this.ref.markForCheck();
      }
    }
  }

  callBackGetDate(val, type) {
    if (val) {
      if (val == 'Invalid date') {
        if (type == 'dob') {
          this.clientSearchRequest.patchValue({
            dateOfBirth: 'Invalid date'
          })
        }
        else if(type == 'doe')
        {
           this.clientSearchRequest.patchValue({
            dateOfEntry: 'Invalid date'
          })
        }
        
      }
      if (type == 'dob') {
        this.clientSearchRequest.patchValue({
          dateOfBirth: val
        })
      }
       
        else if(type=='doe')
        {
           this.clientSearchRequest.patchValue({
            dateOfEntry: val
          })
        }
      console.log("in callback mystringchaged=>" + JSON.stringify(val));
      this.onValueChanged();
    }

  }

}
