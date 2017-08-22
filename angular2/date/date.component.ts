/*
hchalyam:05-11-2017 :Created 
Comments :utilized ng2-datepicker as parent component and customized to produce date-picker   
hchalyam:05-12-2017 :modified 
Renamed control events 
*/
import { DatePickerOptions, DateModel } from 'ng2-datepicker';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'date-picker',
    templateUrl: './date.component.html',
})

export class DatePicker implements OnInit {

    ngOnInit() {

    }

    modelText: ''

    @Input()
    modelDate: string;

    @Output()
    controlChangeEvent: EventEmitter<string> = new EventEmitter();

    @Output()
    keyChangeEvent: EventEmitter<string> = new EventEmitter();

    modelChange(value) {
        console.log("entered  modelchangeevent()");
        try {
            console.log("dateValue " + JSON.stringify(value));
            if (value) {
                let dateEvent = new Date(value);

                let datemodel = value;
                console.log("re-formatted date :" + datemodel.formatted);
                this.modelDate = datemodel.formatted;
                this.controlChangeEvent.emit(this.modelDate);
                console.log("exited  modelchangeevent()");
            }
        }
        catch (e) {
            console.log("error in  modelchangeevent()");
            let datemodel = new DateModel();
            datemodel.formatted = moment("1990-01-00").add(1, 'd').format('YYYY-MM-DD');

            this.controlChangeEvent.emit(this.modelDate);
            console.log("mapped to 1990");
        }
    }

    dateFocusEvent(value) {
        console.log("entered  dateFocusEvent()");
        try {
            console.log("dateValue " + value);
            if (value) {
                let dateEvent = new Date(value);

                var dateParts = value.split("-");
                 console.log("dateParts[0] " + dateParts[0]);
                console.log("dateParts[1] " + dateParts[1]);
                console.log("dateParts[2] " + dateParts[2]);

                if (!dateParts[0]|| !dateParts[1]  || !dateParts[2]) {
                console.log(" users error format ,throwing error  :" );
                    
                    throw TypeError("Error message");
                }

                let datemodel = new DateModel();
                this.modelDate = datemodel.formatted = moment(dateEvent).add(1, 'd').format('YYYY-MM-DD');
                console.log("re-formatted date :" + datemodel.formatted);

                if (datemodel.formatted == 'Invalid date') {
                    throw TypeError("Error message");
                }
                //   this.modelText.value=datemodel;
                this.keyChangeEvent.emit(this.modelDate);
                console.log("exited  dateFocusEvent()");
            }
        }
        catch (e) {
            console.log("error in  dateFocusEvent()");
            let datemodel = new DateModel();
            this.modelDate = moment("1990-01-00").add(1, 'd').format('YYYY-MM-DD');
            this.keyChangeEvent.emit(this.modelDate);
            console.log("mapped to 1990");
        }
    }

}