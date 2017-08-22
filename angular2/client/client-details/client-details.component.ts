import { Component, ViewChild, OnInit,  ChangeDetectionStrategy, ChangeDetectorRef  } from '@angular/core';
import { NgForm } from '@angular/forms'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../client.service';
import {Observable} from 'rxjs/Rx';
import {ReferenceData} from '../../model/reference-data.model';
import { ClientInfo } from './client-info.model';
import { ClientDemoAuditInfo } from './client-demo-audit-info.model';
import { ClientAddressAuditInfo } from './client-address-audit-info.model';
import { ActivatedRoute } from '@angular/router';
import {Router} from "@angular/router";
import {  SafeHtml } from "@angular/platform-browser";
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ValidationService } from '../../formCustomValidators/form-custom-validators.service';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css'],
  providers: [ClientService,DatePipe]
})
export class ClientDetailsComponent implements OnInit {
private dOB:string
private dOE:string
canChooseProgram: boolean = false;
  dateOfBirth :'';
  dateOfEntry:'';
  autocompleteModel='';
  immigrationStatuses = Array<ReferenceData>();
  providers = Array<ReferenceData>();
  states = Array<ReferenceData>();
  clientDemoAuditInfos = Array<ClientDemoAuditInfo>();
  clientAddressAuditInfos = Array<ClientAddressAuditInfo>();
  alienModel='';
  primaryAlienModel = '';
  genders = ["","Male" , "Female"];
  maritalStatus = Array<ReferenceData>();
  previousOcuupationaldata = Array<ReferenceData>();
  highersEducationaldata = Array<ReferenceData>();
  countryOfOriginData = Array<ReferenceData>();
  secondaryMigrants= [{code:null, value:null}, {code:"Y",value:"Yes"}, {code:"N",value:"No"}];
  englishSpeaks =  [{code:null, value:''}, {code:"Y",value:"Yes"}, {code:"N",value:"No"}];
  interPreterNeeded =  [{code:null, value:''}, {code:"Y",value:"Yes"}, {code:"N",value:"No"}];
  primaryApplicantData =  [ {code:"Y",value:"Yes"}, {code:"N",value:"No"}];
    relationShipData = Array<ReferenceData>();
  newClient = true;
  invalidAlienNumber = false;
  clientId: any;
  alienNumbers=[];
  primaryAlienNumbers=[];
  saveStatus = "";
  clientInfo : FormGroup;
  routeAlienNumber = "";
  formErrors = {};
  stepsInvolved = ["Profile", "Demographic Information", "Program eligibility"];
  stepsCompleted = []; // doesnt include current step
  currentStep:number;
  constructor(private fb: FormBuilder,
              private clientService: ClientService,private router: Router,private route: ActivatedRoute,private datePipe: DatePipe) {
}

  autocompleListFormatter = (data: any) : SafeHtml => {

     let html = `<span>${data}</span>`;
     return html;
  }
   primaryApplicantListFormatter = (data: any) : SafeHtml => {

     let html = `<span>${data.alienNmbr}</span>`;
     return html;
  }
  

  ngOnInit() {
    this.currentStep = 1;
    this.constructFormObject();
    this.populateFormDropDownData();

     this.clientId = this.route.params.subscribe(params => {
          let id:number = Number.parseInt(params['id']);
          this.routeAlienNumber = params['id'];
        console.log("Alien number obtained  is "+ this.routeAlienNumber);
        if(this.routeAlienNumber){
          console.log("Alien number present in the path. so get the client details")
          this.newClient = false;
          this.getClientInfo(this.routeAlienNumber);
        }
    });

   this.initializeFormErrors();
  }

private initializeFormErrors(){
  this.formErrors = {
      'alienNmbr': '',
      'firstName': '',
      'lastName': '',
      'gender': '',
      'ssn':'',
      'immigrationStatusCode':'',
      'secndMgntInd':'',
      'entryDate':'',
      'dateOfBirth':'',
      'countryOfOriginCode':'',
      'primLang':'',
      'secndLang':'',
      'secndLang2':'',
      'secndLang3':'',
      'homePhone':'',
      'cellPhone':'',
      'emailAddr':'',
      'addressStreet1':'',
      'addressCity':'',
      'addressCounty':'',
      'addressState':'',
      'adddressZip':'',
      'intrptnReqdInd':'',
      'engSpeaksInd':'',
      'previousOccupationCode':'',
      'educationLevelCode':'',
      'primaryApplicantInd':'',
      'primaryApplicantAlienNmbr':'',
      'relationShipCode':''
    };
}
  onValueChanged(data?: any) {
    console.log("form changed " + data);
    if (!this.clientInfo) { return; }
    const form = this.clientInfo;
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

  // zipChange(): any {
  //   console.log("zip changed",this.clientInfo.controls.adddressZip.value);
  //   this.clientService.getAddressInfo(this.clientInfo.controls.adddressZip.value)
  //     .subscribe( addresses => {
  //       console.log("addresses", addresses);
  //       if(addresses.length) {
  //          this.clientInfo.get('addressCity').setValue(addresses[0].city);
  //         this.clientInfo.get('addressCounty').setValue(addresses[0].county);
  //         this.clientInfo.get('addressStateCode').setValue(addresses[0].state);
  //       }
  //      }
  //     );
  // }

  getStepValue() {
    return  this.currentStep;
  }

  stepFront() {
    this.stepsCompleted.push(this.stepsInvolved[this.currentStep-1]);
    this.currentStep++;
  }

   stepBack() {
     this.stepsCompleted.pop();
     this.currentStep--;
  }


  validationMessages = {
    'alienNmbr': {
      'maxlength':'Alien Number cannot be more than 9 digits.',
      'minlength':'Alien Number cannot be less than 8 digits.',
      'pattern': 'Not a valid Number',
      'required': 'Alien Number is required',
      'notNum' : 'Please check the value entered is a number',
      'leadingZeros' : 'No Leading Zeros'

    },
    'firstName': {
      'required': 'First Name is required.'
    },
    'lastName': {
      'required': 'Last Name is required.'
    },
    'gender':{
      'required' : 'Gender is required'
    },
    'ssn':{
      'maxlength':'SSN cannot be more than 8 digits.',
      'minlength':'SSN cannot be less than 8 digits.',
      'notNum' : 'Please check the value entered is a number',
      'leadingZeros' : 'No Leading Zeros'
    },
    'immigrationStatusCode': {
    'required' : 'Immigration Status is required.'
    },
    'secndMgntInd': {
    'required' : 'Secondary Migrant Indicator is required.'
    },
    'entryDate': {
    'required' : 'Entry Date is required.'
    },
    'dateOfBirth': {
    'required' : 'Date of Birth is required.',
    'notNum' : 'Please check the value entered is a number',
    },
    'countryOfOriginCode': {
    'required' : 'County Of Origin is required.'
    }, 
    'primLang': {
    'required' : 'Primary Language is required.'
    },
    'engSpeaksInd': {
    'required' : 'Speaks English Indicator Needed is required.'
    },
    'intrptnReqdInd': {
    'required' : 'Interpreter Needed is required.'
    },
    'addressStreet1': {
    'required' : 'Street Address is required..'
    },
    'addressCounty': {
    'required' : 'County is required..'
    },
    'addressCity': {
    'required' : 'City is required..'
    },
    'addressStateCode': {
    'required' : 'State is required..'
    },
    'adddressZip': {
    'required' : 'Zip is required..'
  },
  'previousOccupationCode': {
    'required' : 'Previous Occupation is required..'
    },
  'educationLevelCode': {
    'required' : 'Highest Education is required..'
  },
    'primaryApplicantInd': {
    'required' : 'Are you a Primary Applicant  is required.'
    },
  'primaryApplicantAlienNmbr': {
      'maxlength':'Alien Number cannot be more than 9 digits.',
      'minlength':'Alien Number cannot be less than 8 digits.',
      'pattern': 'Not a valid Number',
      'required': 'Alien Number is required',
      'notNum' : 'Please check the value entered is a number',
      'leadingZeros' : 'No Leading Zeros',
      'validPrimaryApplicantNumber':' Choose a Primary applicant from the list.'
    }
  };

  public onStateChange(e){

    if( e != "MD"){
      console.log(" English speaking is no. so set intrptnReqdInd");
      this.clientInfo.get('addressCounty').setValue("");
    }
  }

  public onEngSpeakIndChange(e){
    console.log("English Speaking Indicator Changed. Value is " + e);

    if( e == "N"){
      console.log(" English speaking is no. so set intrptnReqdInd");
      this.clientInfo.get('intrptnReqdInd').setValue("Y");
    }else{
      this.clientInfo.get('intrptnReqdInd').setValue("N");
    }
  }

  public onPrimaryApplicantIndChange(e){
    console.log("onPrimaryApplicantIndChangeIndicator Changed. Value is " + e);

    if( e == "N"){
      this.clientInfo.get('primaryApplicantAlienNmbr').setValue(null);
      this.primaryAlienModel = "";
      this.clientInfo.get('relationShipCode').setValue(null);
      this.clientInfo.get('relationShipCode').setValidators(Validators.compose([Validators.required]));
      this.clientInfo.get('primaryApplicantAlienNmbr').setValidators(Validators.compose([Validators.required]));
    }else{
      console.log("Clearing two validators");
      this.clientInfo.get('relationShipCode').setValidators([]);
      this.clientInfo.get('primaryApplicantAlienNmbr').setValidators([]);
      this.clientInfo.get('relationShipCode').updateValueAndValidity();
      this.clientInfo.get('primaryApplicantAlienNmbr').updateValueAndValidity();
    }
  }

  


  public onSubmit({ value }: { value: ClientInfo }) {
    console.log("Submitting the form here......");

    // this.stepFront();

    // custom validation

      value.entryDate= this.datePipe.transform(this.dateOfEntry, 'MM/dd/yyyy');
      value.dateOfBirth= this.datePipe.transform(this.dateOfBirth, 'MM/dd/yyyy');
   console.log("doe before posting=>"+value.entryDate);
    this.saveStatus = "";
    this.clientService.saveClientDetailsResults(value).subscribe(
      data => {
        console.log("data Saved Successfully");
        this.saveStatus = "Client Information Saved Successfully";
        this.getClientDemoAuditData(value.alienNmbr);
        this.getClientAddressAuditData(value.alienNmbr);

        // New CLient Save successfull. So navigate to Client details page using the alien number. Just to make sure the page loads fine
        console.log('In Onsubmit. routeAlientNumber is ' + this.routeAlienNumber);
        if(!this.routeAlienNumber){
          console.log("New Client Save. So refresh the page");
          this.router.navigate(['/home/client/details/'+ value.alienNmbr]);
           }
                },
      failure => {
        console.log("Eror in getting the results " + failure.text());
        let response = JSON.parse(failure.text());
        console.log("Actual error is " + response.errors)
        this.saveStatus = JSON.parse(failure.text()).errors;
      }
    );
    let stepVal = this.currentStep;
    this.clientInfo.reset();
    setTimeout(()=> {
      this.ngOnInit();
      this.currentStep = stepVal;
    }, 1000);
     
  }


private constructFormObject(){
 this.clientInfo = this.fb.group({
      clientId: [],
      alienNmbr: ['', [ Validators.minLength(8), Validators.maxLength(9), ValidationService.onlyNumber, Validators.required, ValidationService.leadingZeros]],
      firstName: ['', [Validators.required]],
      middleName: [''],
      lastName: ['',[Validators.required]],
      gender: ['',[Validators.required]],
      ssn:['',[Validators.minLength(8),Validators.maxLength(8),ValidationService.onlyNumber, ValidationService.leadingZeros]],
      immigrationStatusCode:['',[Validators.required]],
      secndMgntInd:['',[Validators.required]],
      entryDate:['',[Validators.required]],
      dateOfBirth:['',[Validators.required]],
      countryOfOriginCode:['',[Validators.required]],
      primLang:['',[Validators.required]],
      secndLang:[''],
      secndLang2:[''],
      secndLang3:[''],
      homePhone:[''],
      cellPhone:[''],
      emailAddr:[''],
      addressStreet1:['',[Validators.required]],
      addressCity:['',[Validators.required]],
      addressCounty:['',[Validators.required]],
      addressStateCode:['MD',[Validators.required]],
      adddressZip:['',[Validators.required,Validators.maxLength(5)]],
      maritalStatusCode:[''],
      providerCode:[''],
      engSpeaksInd:['',[Validators.required]],
      intrptnReqdInd:['',[Validators.required]],
      previousOccupationCode:['',[Validators.required]],
      educationLevelCode :['',[Validators.required]],
      primaryApplicantInd:['',[]],
      primaryApplicantAlienNmbr: ['', [ ]],
      relationShipCode: [''] 
     });
      this.clientInfo.valueChanges
        .subscribe(data => this.onValueChanged(data));
      this.onValueChanged();
}


   private getClientInfo(id) {
         this.clientService.getClientDetails(id).subscribe(
       data => {
        // console.log("before patching:"+JSON.stringify(data));
        console.log("DataDta", data);
        let getDentry = this.datePipe.transform(data.entryDate, 'yyyy-MM-dd');
        let getDob = this.datePipe.transform(data.dateOfBirth, 'yyyy-MM-dd');

             this.clientInfo.patchValue({
                  clientId: data.clientId,
                  alienNmbr: data.alienNmbr,
                  firstName: data.firstName,
                  middleName: data.middleName,
                  lastName: data.lastName,
                  gender: data.gender,
                  ssn:data.ssn,
                  immigrationStatusCode:data.immigrationStatusCode,
                  secndMgntInd:data.secndMgntInd,
                  entryDate: getDentry,
                  dateOfBirth: getDob,
                  countryOfOriginCode:data.countryOfOriginCode,
                  primLang:data.primLang,
                  secndLang:data.secndLang,
                  secndLang2:data.secndLang2,
                  secndLang3:data.secndLang3,
                  homePhone:data.homePhone,
                  cellPhone:data.cellPhone,
                  emailAddr:data.emailAddr,
                  addressStreet1:data.addressStreet1,
                  addressCity:data.addressCity,
                  addressCounty:data.addressCounty,
                  addressStateCode:data.addressStateCode,
                  adddressZip:data.adddressZip,
                  maritalStatusCode:data.maritalStatusCode,
                  providerCode:data.providerCode,
                  engSpeaksInd:data.engSpeaksInd,
                  intrptnReqdInd:data.intrptnReqdInd,
                  previousOccupationCode:data.previousOccupationCode,
                  educationLevelCode :data.educationLevelCode,
                  primaryApplicantAlienNmbr: data.primaryApplicantAlienNmbr,
                  primaryApplicantInd: data.primaryApplicantInd,
                  relationShipCode:data.relationShipCode})
                  console.log("Got the data ---------------> " + data.primaryApplicantAlienNmbr)
                  if(data.primaryApplicantAlienNmbr){
                    this.primaryAlienModel = data.primaryApplicantAlienNmbr;
                  }
      },
      errors => {console.log("Eror in getting the results. Status is " + errors.status + "final msg is " + errors);
      if( errors.status == 404){
        this.invalidAlienNumber = true;
      }
    });

    this.getClientDemoAuditData(id);
    this.getClientAddressAuditData(id);
    this.dOE='';
    this.dOB='';
  }
  public cancel(e){
    console.log("Cancel clicked---->");
    // Remove the existing form errors.
    this.initializeFormErrors();
    this.saveStatus = "";
    let aNumber  = this.clientInfo.get('alienNmbr').value;
    if(this.routeAlienNumber){
      if(  aNumber != null && aNumber != ''){
        // Repopulate the form.
        this.getClientInfo(aNumber);
      }else{
        this.clientInfo.reset();
      }
    }else{
        console.log("Cancel clicked for new Client ")
        this.constructFormObject();
        this.newClient = true;
    }
    e.preventDefault();
    this.currentStep = 1;
  }

private getClientAddressAuditData(id){
  this.clientService.getClientAddressAuditData(id).subscribe(
    data => { this.clientAddressAuditInfos = data },
    errors => {console.log("Eror in getting the results " + errors);
  });
}
private getClientDemoAuditData(id){
  this.clientService.getClientDemoAuditData(id).subscribe(
    data => { this.clientDemoAuditInfos = data },
    errors => {console.log("Eror in getting the results " + errors);
  });
}
public  getAlienNumbers(pattern) {
    this.alienModel=pattern;
   console.log("Value pattern:" +pattern);
   if (pattern != undefined && pattern != null && pattern.length!=0)
   {
     this.clientService.getAlienNbrsAutoCompleteResults(pattern).subscribe(
       data => {
          this.alienNumbers.length = 0 ;
           for (var i = 0; i < data.length; i++) {
              this.alienNumbers.push(JSON.parse(JSON.stringify(data[i])).alienNmbr);
          }
       },
       errors => {console.log("Eror in getting the results " + errors)}
     );
   }
   else{
     this.alienNumbers.length = 0 ;
   }
 }

public  getPrimaryAlienNumbers(pattern) {
   this.primaryAlienModel=pattern;
   if (pattern != undefined && pattern != null && pattern.length!=0)
   {
     this.clientService.getAlienNbrsAutoCompleteResults(pattern).subscribe(
       data => {
          this.primaryAlienNumbers.length = 0 ;
          //this.primaryAlienNumbers = data;
           for (var i = 0; i < data.length; i++) {
              this.primaryAlienNumbers.push(JSON.parse(JSON.stringify(data[i])).alienNmbr);
          }
       },
       errors => {console.log("Eror in getting the results " + errors)}
     );
   }
   else{
     this.primaryAlienNumbers.length = 0 ;
   }
 }

public getClientInfoForSelectedClient(value){
  console.log("Selected value is. Gonna get Client Info for  " + value)
  this.newClient = false;
  //this.getClientInfo(e);
  this.router.navigate(['/home/client/details/'+value]);

}
private populateFormDropDownData(){
      this.clientService.getImmigrationStatuses().subscribe(
      data => { this.immigrationStatuses = data},
      errors => {console.log("Eror in getting the results " + errors)}
    );

      this.clientService.getStates().subscribe(
      data => { this.states = data},
      errors => {console.log("Eror in getting the results " + errors)}
    );

     this.clientService.getProviders().subscribe(
      data => { this.providers = data},
      errors => {console.log("Eror in getting the results " + errors)}
    );

    this.clientService.getMaritalStatuses().subscribe(
      data => { this.maritalStatus = data},
      errors => {console.log("Eror in getting the results " + errors)}
    );
    this.clientService.getHigherEducationalData().subscribe(
      data => { this.highersEducationaldata = data},
      errors => {console.log("Eror in getting the results " + errors)}
    );
    this.clientService.getCountryOfOriginData().subscribe(
      data => { 
        this.countryOfOriginData = data;
        console.log("country of origin", this.countryOfOriginData);
    },
      errors => {console.log("Eror in getting the results " + errors)}
    );
    this.clientService.getPreviousoccupationaData().subscribe(
      data => { this.previousOcuupationaldata = data},
      errors => {console.log("Eror in getting the results " + errors)}
    );

    this.clientService.getRelationships().subscribe(
      data => { this.relationShipData = data},
      errors => {console.log("Eror in getting the results " + errors)}
    );

     }

     // not required for now.
     validPrimaryApplicantNumber(control) {
       if(control)
       {
        if(control.valid && control.dirty)
        {
          let valueExists = false;
          for( let i=0; i < this.primaryAlienNumbers.length; i++){
            if(this.primaryAlienNumbers[i].alienNmbr = control.value){
              valueExists = true;
            }
          }
          if(!valueExists){
              return {'validPrimaryApplicantNumber': 'validPrimaryApplicantNumber'};
          }
                  
        }
        else
        return null;
       }
        
        
    }
/*
  validNumber(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const input = control.value;
      //  !isNaN(parseFloat(input)) && isFinite(input);
    if(isValid)
        return { 'maxValue': {max} }
    else
        return null;
}
}; */

}
