import { Component, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms'
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ClientService } from '../client.service';
import { Observable } from 'rxjs/Rx';
import { ReferenceData } from '../../model/reference-data.model';
import { RssInfo } from './rss.component.model';
import { DropDownModelInfo } from './rss.dropdown';
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router";
import { SafeHtml } from "@angular/platform-browser";
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DatePickerOptions, DateModel } from 'ng2-datepicker';
import * as moment from 'moment'



@Component({
  selector: 'app-client-rss',
  templateUrl: './rss.component.html',
  providers: [ClientService, DatePipe],
    styleUrls: ['./rss.component.css'],
  
})

export class RssComponent implements OnInit {
  stepsInvolved = ["RSS Intake", "RSS Profile", "Job Placement"];
  stepsCompleted = []; // doesnt include current step
  currentStep: number;

  private clientId;
  rssInfoIntake: FormGroup;
  rssInfoServices:FormGroup;
  dropDownValues: DropDownModelInfo[] = [];
  dropDownStatusCode: DropDownModelInfo = null;
  selectedService: '';
  selectedCapt: '';
  selectedServiceModel: DropDownModelInfo = null;
  capts = [];
  capt: "";
  dateModel: DateModel;

  constructor(private fb: FormBuilder,
    private clientService: ClientService, private router: Router, private route: ActivatedRoute, private datePipe: DatePipe) {

    this.capts.push("None");
    this.capts.push("TANF");
    this.capts.push("RTCA");

    this.dropDownValues.push(new DropDownModelInfo('1', 'Employability Assessment', true, false, false, true, false));
    this.dropDownValues.push(new DropDownModelInfo('2', 'Case Management', true, false, false, true, false));
    this.dropDownValues.push(new DropDownModelInfo('3', 'Transportation Assistance', true, false, false, true, false));
    this.dropDownValues.push(new DropDownModelInfo('4', 'EAD Assistance', true, false, false, true, false));
    this.dropDownValues.push(new DropDownModelInfo('5', 'Child Care Assistance', true, false, false, true, false));
    this.dropDownValues.push(new DropDownModelInfo('6', 'Referral to Services', true, false, false, true, false));

    this.dropDownValues.push(new DropDownModelInfo('7', 'Energy Assistance', false, false, false, false, true));
    this.dropDownValues.push(new DropDownModelInfo('8', 'Medical Assistance', false, false, false, false, true));
    this.dropDownValues.push(new DropDownModelInfo('9', 'Uniform Assistance', false, false, false, false, true));
    this.dropDownValues.push(new DropDownModelInfo('10', 'Housing Assistance', false, false, false, false, true));
    this.dropDownValues.push(new DropDownModelInfo('11', 'Credential Evaluation Referral', false, false, false, false, true));
    this.dropDownValues.push(new DropDownModelInfo('12', 'Professional Licensing Assistance', false, false, false, false, true));
  }

  private constructFormObject() {
    this.rssInfoIntake = this.fb.group({
      clientId: [],
      alienNmbr: ['', [Validators.required, Validators.maxLength(9)]],
      intakeDate: [],
      snap: [],
      cashAssistProgram: []   

    });

     this.rssInfoServices = this.fb.group({
            services: this.fb.array([
                this.initServices(),
            ])
        });
  }

  initServices() {
    return this.fb.group({
      isNa: [''],
      init: [''],
      completed: ['']
    });
  }

  addServices() {
    const control = <FormArray>this.rssInfoServices.controls['services'];
    control.push(this.initServices());
  }

  removeServices(i: number) {
    const control = <FormArray>this.rssInfoServices.controls['services'];
    control.removeAt(i);
  }

  ngOnInit() {
    this.currentStep = 1;
    this.constructFormObject();
    console.log(this.dropDownValues);
  }

  addService() {
    this.selectedServiceModel.uiVisible = true;
    console.log(JSON.stringify(this.dropDownValues));
  }

  removeService(val) {
    let model: DropDownModelInfo;
    this.selectedServiceModel = this.dropDownValues.find(item => item.id == val);
    this.selectedServiceModel.uiVisible = false;
    this.selectedServiceModel.completed = false;
    this.selectedServiceModel.init = false;
    this.selectedServiceModel.isNa = false;
  }

  onSelectionChange(val) {
    this.selectedServiceModel = this.dropDownValues.find(item => item.id == val);
  }

  showVisibleList(input: boolean): DropDownModelInfo[] {
    return this.dropDownValues.filter(item => item.uiVisible == input);
  }

  onChange(event, model: DropDownModelInfo, type: number) {
    console.log("model triggered=>" + JSON.stringify(model));
    if (model.init && type == 2) {
      model.isNa = false;
      model.completed = false;
    }
    if (model.isNa && type == 1) {
      model.init = false;
      model.completed = false;
    }
    if (model.completed && type == 3) {
      model.init = false;
      model.isNa = false;
    }
    console.log("model triggered and changed=>" + JSON.stringify(model));
    console.log(JSON.stringify(this.dropDownValues));
  }

  getStepValue() {
    console.log("getstep:"+this.currentStep);
    return this.currentStep;
  }

  stepFront() {
    console.log("stepFront:"+this.currentStep);
    this.stepsCompleted.push(this.stepsInvolved[this.currentStep - 1]);
    this.currentStep++;
  }

  stepBack() {
    console.log("stepBack:"+this.currentStep);
    this.stepsCompleted.pop();
    this.currentStep--;
  }

    callBackGetDate(val, type) {
    if (val) {
      if (val == 'Invalid date') {
        if (type == 'dob') {
          this.rssInfoIntake.patchValue({
            intakeDate: 'Invalid date'
          })
        }
      }
      if (type == 'dob') {
        this.rssInfoIntake.patchValue({
          intakeDate: val
        })
      }
      console.log("in callback mystringchaged=>" + JSON.stringify(val));
    }
  }
}
