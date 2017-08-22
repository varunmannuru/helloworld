import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from "@angular/router";
import { RouterModule, Routes } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ClientSearchRequest } from '../search/clientSearchRequest.model';
import { ClientSearchResult } from '../search/clientSearchResult.model';
import { ClientService } from '../client.service';
import { Observable } from 'rxjs/Rx';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { ElementRef } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { DatePickerOptions, DateModel } from 'ng2-datepicker';
import { PaginationInstance } from 'ngx-pagination';
import { ValidationService } from '../../formCustomValidators/form-custom-validators.service';

@Component({
  selector: 'rtca',
  templateUrl: './rtca.component.html',
  styleUrls: ['./rtca.component.css'],
  providers: [ClientService,DatePipe]
})
export class RTCAComponent implements OnInit {
  stepsInvolved = ["Profile", "Demographic Information", "Program eligibility"];
  stepsCompleted = []; // doesnt include current step
  clientId: any;
  currentStep:number = 1;
  routeAlienNumber = "";
  alienNmbr: number;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  ssn: number;
  addressStreet1: string;
  addressCity:string;
  addressCounty: string;
  addressStateCode:string;
  adddressZip:number;
  primLang:string;
  genders:string[] = ["","Male" , "Female"];
  activeMembers = [];

  dob : Date;
  dateOfEntry: Date;
  dateOfEntry1: Date;
  mymodel='';
  clientSearchRequest : FormGroup;
  clientSearchResults : ClientSearchResult[];
  clientSearchResultsAvailable = false;
  date: DateModel;
  options: DatePickerOptions;
  currentSearchRequest = {}; 
   total: number;
  loading: boolean;
  totalElements: number;
  p: number = 1;
  size:number = 2;

  minVal = (this.p - 1)*this.size  + 1;
   maxVal = this.size*this.p;
  public elementRef;
  selectedRTCAClients = [];
  otherAlienNmbrs = [12341,123652 , 125214];

 
  constructor(myElement: ElementRef,
                private ref: ChangeDetectorRef,
                private fb: FormBuilder,  
                private _sanitizer: DomSanitizer,
                private clientService: ClientService,
                private router: Router,
                private route: ActivatedRoute,
                private datePipe: DatePipe) { 

 this.clientService.updateRTCAForm$.subscribe(alienNumberReceived => {
    this.selectedRTCAClients.push(alienNumberReceived);
    console.log(" this.selectedRTCAClients",  this.selectedRTCAClients, alienNumberReceived);
 })
 this.elementRef = myElement;
       this.options = new DatePickerOptions();
       this.clientSearchRequest = this.fb.group({
          alienNmbr: ['', [Validators.maxLength(9), ValidationService.onlyNumber]],
          firstName: ['',[Validators.minLength(1)]],
          lastName: ['',[Validators.minLength(2)]],
          dateOfBirth: [''],
          entryDate: ['']
      });
  }

   public alienNumbers=[];
  
    qsearchtxtRouteParam = '';

   autocompleListFormatter = (data: any) : SafeHtml => {
      let html = `<span>${data}</span>`;
      return html;
  }

  ngOnInit() {

     this.clientSearchRequest.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();


      this.clientId = this.route.params.subscribe(params => {
          let id:number = Number.parseInt(params['id']);
          this.routeAlienNumber = params['id'];
       
          this.getClientInfo(this.routeAlienNumber);
    });
  }

  formErrors = {
      'alienNmbr': '',
      'firstName': '',
      'lastName': '',
      'entryDate':'',
      'dateOfBirth':''
    };

      getPage(p: number) {
        this.p = p;
        this.updateStats(this.p, this.size);
        this.loading = true;
        
        this.clientService.getClientSearchResults(this.currentSearchRequest, p-1, this.size).subscribe(
          data => {
            this.loading = false;
          this.clientSearchResultsAvailable = true;
          this.clientSearchResults = data.content;
          this.totalElements = data.totalElements;
          this.ref.markForCheck();
          },
          errors => {console.log("Eror in getting the results " + errors)},
          () => {console.log("Done")}
        );
        
       
    }

    onValueChanged(data?: any) {
    
    if (!this.clientSearchRequest) { return; }
    const form = this.clientSearchRequest;

      for (const field in this.formErrors) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
            const messages = this.validationMessages[field];
              for (const key in control.errors) {
                this.formErrors[field] += messages[key] + ' ';
              }
          }    
      }

  }
  showSearch: boolean = true;

  toggleAdd(){
    this.showSearch = !this.showSearch;
  }

  

  validationMessages = {
    'alienNmbr': {
      'maxlength':'Alien Number cannot be more than 9 digits.',
      'pattern': 'Not a valid Number',
      'notNum' : 'Please check the value entered is a number'
    },
    'firstName': {
      'minlength': 'Atleast 2 characters is required.'
    },
    'lastName': {
      'minlength': 'Atleast 2 characters is required.'
    },
  };

  updateStats(p,size) {
    this.p = p;
    this.minVal = (p - 1)*size  + 1;
    this.maxVal = size*p;
      this.ref.markForCheck();
  }
  onSubmit({ value }: { value: ClientSearchRequest }) {
    this.p = 1;
    this.updateStats(this.p, this.size);
      this.currentSearchRequest = value;
      if(this.dateOfEntry){
        value.entryDate= this.datePipe.transform(this.dateOfEntry, 'MM/dd/yyyy');
      }
      if(this.dob){
        value.dateOfBirth= this.datePipe.transform(this.dob, 'MM/dd/yyyy');
      }
      
        this.clientService.getClientSearchResults(value, 0, this.size).subscribe(
          data => {
            this.clientSearchResultsAvailable = true;
            this.clientSearchResults = data.content;
            this.totalElements = data.totalElements;
            this.ref.markForCheck();
          },
          errors => {console.log("Eror in getting the results " + errors)},
          () => {console.log("Done")}
        );

    }

  cancel(e){
    e.preventDefault();
    this.clientSearchRequest.reset();
    this.clientSearchResultsAvailable = false;
    this.clientSearchResults = null;
  }
 autoCompleteValuechange(pattern) {
   this.mymodel=pattern;
    if(pattern){
      if (pattern.length!=0)
            {
        this.clientService.getAlienNbrsAutoCompleteResults(pattern).subscribe(
          data => {
            this.alienNumbers.length = 0 ;
              for (var i = 0; i < data.length; i++) {
                let temp={"alienNmbr": JSON.parse(JSON.stringify(data[i])).alienNmbr}
              this.alienNumbers.push(temp.alienNmbr);
            }
          },
          errors => {console.log("Eror in getting the results " + errors)},
          () => {console.log("Done")}
        );
      }
      else
      {
        this.alienNumbers.length = 0 ;
      }
    }
}



   private getClientInfo(id) {
         this.clientService.getClientDetails(id).subscribe(
       data => {
        let getDentry = this.datePipe.transform(data.entryDate, 'yyyy-MM-dd');
        let getDob = this.datePipe.transform(data.dateOfBirth, 'yyyy-MM-dd');
        this.activeMembers.push(data);
        console.log("data in the rtca", data);
                  this.clientId =  data.clientId;
                  this.alienNmbr = data.alienNmbr;
                  this.firstName = data.firstName;
                  this.middleName = data.middleName;
                  this.lastName = data.lastName;
                  this.gender = data.gender;
                  this.ssn = data.ssn;
                   this.primLang = data.primLang;
                   this.addressStreet1 = data.addressStreet1;
                  this.addressCity = data.addressCity;
                  this.addressCounty = data.addressCounty;
                  this.addressStateCode = data.addressStateCode;
                  this.adddressZip = data.adddressZip;

                  this.selectedRTCAClients.push(this.alienNmbr);
            
    },
      errors => {console.log("Eror in getting the results. Status is " + errors.status + "final msg is " + errors);
    
        });
    }

    private getQuickResults(qSearchText) {
         this.clientService.getQuickSearchResults(qSearchText,0,1).subscribe(data => {
             console.log("data,", data);
         });
    }



    
}
