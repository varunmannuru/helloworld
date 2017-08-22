import * as moment from 'moment';
import { DatePickerOptions, DateModel } from 'ng2-datepicker';


export class ValidationService {

    static onlyNumber(control) {
        if (control.valid && control.dirty && isNaN(control.value))
            return { 'notNum': 'notNum' };
        else
            return null;

    }

    static leadingZeros(control) {
        if (control.value) {
            let tempVal = (control.value).toString();
            console.log("Value inside Leading Zeros is " + typeof (tempVal));
            if (control.valid && control.dirty && tempVal.startsWith('0')) {
                return { 'leadingZeros': 'leadingZeros' };
            }
            else {
                return null;
            }
        }
    }

    static invalidDateFormat(control) {
        if (control.value) {
            if (control.value == 'Invalid date') {
                return { 'invalidDateFormat': 'invalidDateFormat' };
            }
            else {
                return null;
            }
        }
    }

}