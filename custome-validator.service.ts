import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from "@angular/forms";
@Injectable()

export class CustomValidatorsService {

    static validEmail(control) {
        const regex = new RegExp('^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$');
        const val = control.value;

        if (control.valid && control.dirty && val.length > 0 && !(regex.test(val.toString()))) {
            return { 'invalidEmail': 'invalid Email' };
        } else {
            return null;
        }
    }
    static validateAmount(control) {
        // const regex = new RegExp('^(?!0.00|11\)\(?!00)\(?!0)\$');
        const val = control.value;

        if (val == '0.00') {
            return { 'invalidAmount': 'Invalid Amount' };
        }
        return null;
    }


    static validSsn(event: any) {
        const regex = new RegExp('^(?!666|000|888-88-8888|9\\d{2})\\d{3}-(?!00)\\d{2}-(?!0{4})\\d{4}$');
        const value = event.target.value;

        if (value !== '' && !(regex.test(value))) {
            return true;
        }
        return false;
    }

    static textOnly(event: any) {
        return (event.charCode === 32 || event.charCode >= 65 && event.charCode <= 90 || event.charCode >= 97 && event.charCode <= 122);
    }

    static numberOnly(event: any) {
        return (event.charCode >= 48 && event.charCode <= 57);
    }

    static ssnMasking(event: any) {
        let val = event.target.value;
        const charCode = (event.charCode) ? event.charCode : event.keyCode;      // Allow only backspace and delete
        if (charCode === 46 || charCode === 8 || charCode === 37 || charCode === 45) {// let it happen, don't do anything
        } else {   // Ensure that it is a number and stop the keypress
            if (!this.numberOnly(event)) {
                event.preventDefault();
            } else {
                let formatFlag = false;
                if (/^\d{3}$/.test(val)) {
                    val = val.substring(0, 3) + '-';
                    formatFlag = true;
                } else if (/^\d{3}-\d{2}$/.test(val)) {
                    val = val.substring(0, 6) + '-';
                    formatFlag = true;
                }
                if (formatFlag) {
                    event.target.value = val;
                }
            }
        }
    }

    static phoneMasking(event: any) {
        return ['(', /[1-9]/, /[0-9]/, /[0-9]/, ')', ' ', /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
    }

    public validateNumberOnly(event: any) {
        if (!CustomValidatorsService.numberOnly(event)) {
            event.preventDefault();
        }
    }

    public validateText($event) {
        if (!CustomValidatorsService.textOnly(event)) {
            event.preventDefault();
        }
    }

    public alphaNumericOnly(event: any) {
        return (
            (event.charCode >= 48 && event.charCode <= 57) ||
            (event.charCode >= 65 && event.charCode <= 90) ||
            (event.charCode >= 97 && event.charCode <= 122)
        );
    }
    public dateOnly(event: any) {
        return event.charCode >= 47 && event.charCode <= 57;
    }
    static validPregnancyDate(control) {
        let checkDate: any;
        let pregnancyDueDate: Date;
        let today: Date;
        let no_of_months: number;
        if (control.value == "")
            return { 'empty': 'Required Field' }
        else
            checkDate = CustomValidatorsService.validDate(control);
        if (checkDate)
            return checkDate;
        else {
            today = new Date();
            pregnancyDueDate = new Date(control.value);
            no_of_months = Date.UTC(pregnancyDueDate.getFullYear(), pregnancyDueDate.getMonth(), pregnancyDueDate.getUTCDay()) - Date.UTC(today.getFullYear(), today.getMonth(), today.getUTCDay());
            // no_of_months = pregnancyDueDate.getDate() - today.getDate();
            if (no_of_months > 23673600000) {
                return { 'aboveNineMonths': 'Pregnancy due date cannot be greater than 9 months' };
            }
            else if (today > pregnancyDueDate) {
                return { 'lessThanPresentDay': 'Pregnancy due date cannot be less than present day' };
            }
            else {
                return null;
            }
        }
    }
    static validBirthDate(control: AbstractControl) {
        let no_of_years: number;
        let today: Date;
        let birthDate: Date;
        today = new Date();
        birthDate = new Date(control.value);
        no_of_years = today.getFullYear() - birthDate.getFullYear();
        if (no_of_years > 120) {
            //return { 'birthDate': 'Birth Date cannot be greater than 120 years' };
            return { 'birthDate': 'Client age cannot be greater than 120 years' };
        }
        if (birthDate > today) {
            return { 'futureDate': 'Future date is not allowed' };
        }
        else {
            return null;
        }
    }
    static Asset500(control: AbstractControl) {
        let inputAmount: any;
        inputAmount = new Number(control.value);
        console.log(inputAmount);
        if (inputAmount > 500) {
            return { 'inputAmount499': 'Amount Cannot be greater than $500' };
        }
        else {
            return null;
        }
    }
    static Asset20(control: AbstractControl) {
        let inputAmount: any;
        inputAmount = new Number(control.value);
        console.log(inputAmount);
        if (inputAmount > 20) {
            return { 'inputAmount19': 'Amount Cannot be greater than $20' };
        }
        else {
            return null;
        }
    }
    static Asset38(control: AbstractControl) {
        let inputAmount: any;
        inputAmount = new Number(control.value);
        console.log(inputAmount);
        if (inputAmount > 38) {
            return { 'inputAmount38': 'Amount Cannot be greater than $38' };
        }
        else {
            return null;
        }
    }
    static Asset25000(control: AbstractControl) {
        let inputAmount: any;
        inputAmount = new Number(control.value);
        console.log(inputAmount);
        if (inputAmount > 25000) {
            return { 'inputAmount25000': 'Amount Cannot be greater than $25,000' };
        }
        else {
            return null;
        }
    }
    static Asset999(control: AbstractControl) {
        let inputAmount: any;
        inputAmount = new Number(control.value);
        console.log(inputAmount);
        if (inputAmount < 999) {
            return { 'inputAmount999': 'Amount Cannot be less than $999' };
        }
        else {
            return null;
        }
    }
    static AssetLessThan999(control: AbstractControl) {
        let inputAmount: any;
        inputAmount = new Number(control.value);
        console.log(inputAmount);
        if (inputAmount > 999) {
            return { 'inputAmountLessThan999': 'Amount Cannot be less than $999' };
        }
        else {
            return null;
        }
    }
    static Asset4999(control: AbstractControl) {
        let inputAmount: any;
        inputAmount = new Number(control.value);
        console.log(inputAmount);
        if (inputAmount > 4999) {
            return { 'inputAmount4999': 'Amount Cannot be greater than $4,999' };
        }
        else {
            return null;
        }
    }
    static Asset199(control: AbstractControl) {
        let inputAmount: any;
        inputAmount = new Number(control.value);
        console.log(inputAmount);
        if (inputAmount < 200) {
            return { 'inputAmount199': 'Amount Cannot be less than $200' };
        }
        else {
            return null;
        }
    }
    static Asset99(control: AbstractControl) {
        let inputAmount: any;
        inputAmount = new Number(control.value);
        console.log(inputAmount);
        if (inputAmount > 100) {
            return { 'inputAmount99': 'Amount Cannot be greater than $100' };
        }
        else {
            return null;
        }
    }
    static Asset2000(control: AbstractControl) {
        let inputAmount: any;
        inputAmount = new Number(control.value);
        console.log(inputAmount);
        if (inputAmount > 2000) {
            return { 'inputAmount2000': 'Amount Cannot be less than $200' };
        }
        else {
            return null;
        }
    }

    static validDate(control: AbstractControl) {
        let dateString = control.value;
        //console.log("date string "+ dateString);
        if (dateString) {
            let formatResult = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
            if (!formatResult) {
                return { 'invalidDate': 'Invalid date (Required format: MM/DD/YYYY)' };
            }
            let dateArray: number[] = dateString.split('/');
            let date: Date;
            let dateNumber: number;
            let monthNumber: number;
            let yearNumber: number;
            date = new Date(control.value);
            monthNumber = date.getMonth() + 1;
            dateNumber = date.getDate();
            yearNumber = date.getFullYear();
            //console.log(monthNumber +"/" + dateNumber+ "/" + yearNumber );
            if ((dateArray && dateArray.length == 3)
                && (dateArray[0] != monthNumber || dateArray[1] != dateNumber || dateArray[2] != yearNumber)) {
                return { 'invalidDate': 'Invalid Date' };
            }
        }
    }

    static ValidFromToDate(group: AbstractControl) {
        let a = group.get('addressStartDate').value;
        let b = group.get('addressEndDate').value;
        if (!a || !b || isNaN(Date.parse(a)) || isNaN(Date.parse(b))) return null;
        a = Date.parse(a);
        b = Date.parse(b);
        if (a > b) {
            return { 'invalidDate': 'Start Date has to be before end Date' };
        }
        return null;
    }
    public ValidBeginEndDate(group: AbstractControl) {
        let x = group.get('effectiveBeginDate').value as Date;
        let y = group.get('effectiveEndDate').value as Date;
        if (!x || !y) return null;
        if (x > y) {
            return { 'invalidDate': 'Start Date has to be before End Date' };
        }
        return null;
    }
}
