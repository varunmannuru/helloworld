export class ValidationService {

    static validEmail(control) {
        //let regex = new RegExp('^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$');
        var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        let val = control.value;

        if (control.valid && control.dirty && val.length > 0 && !(regex.test(val.toString()))) {
            return { 'invalidEmail': 'invalidEmail' };
        }
        else {
            return null;
        }
    }
    static maxWorkingHrs(control) {
        //let regex = new RegExp('^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$');
        //var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        let val = control.value;

        if (val > 168) {
            return { 'invalidHrs': 'invalidHrs' };
        }
        else {
            return null;
        }
    }

    static validUSPhone(control) {
        //let regex = new RegExp('^\+?1?\s*\(?-*\.*(\d{3})\)?\.*-*\s*(\d{3})\.*-*\s*(\d{4})$');
        let phone = control.value.replace(/[^0-9]/g, '');
        console.log("Val:" + phone);
        if (control.valid && control.dirty && phone.length != 0 && phone.length != 10) {
            return { 'invalidPhone': 'invalidPhone' };
        }
        else {
            return null;
        }
    }

    static onlyNumber(control) {
        if (control.valid && control.dirty && isNaN(control.value))
            return { 'notNum': 'notNum' };
        else
            return null;

    }

    static noNumber(control) {
        if (control.valid && control.dirty && ValidationService.isNumeric(control.value))
            return { 'noNumber': 'noNumber' };
        else
            return null;

    }

    static isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };

    static onlyAlphabets(control) {
        let regex = new RegExp('^[a-zA-Z]+$');
        let val = control.value;
        if (control.valid && control.dirty && ((control.value == '') || isNaN(control.value)) && (regex.test(val.toString())))
            return null;
        else
            return { 'notAlphabet': 'notAlphabet' };

    }

    static leadingZeros(control) {
        if (control.value) {
            let tempVal = (control.value).toString();
            console.log("Value inside Leading Zeros is " + typeof (tempVal));
            if (control.valid && control.dirty && tempVal.startsWith('00')) {
                return { 'leadingZeros': 'leadingZeros' };
            }
            else {
                return null;
            }
        }
    }

    static formatCheck(control) {
        if (control.value) {
            let tempVal = (control.value).toString();
            let isValid = ValidationService.isValidDate(tempVal);
            if (control.valid && control.dirty && !isValid) {
                return { 'formatError': 'formatError' };
            }
            else {
                return null;
            }
        }


    }

    static isValidDate(dateString) {
        // First check for the pattern
        if (dateString.length !== 10) {
            return false;
        }
        // third and sixth character should be '/' 
        if (dateString.substring(2, 3) !== '/' || dateString.substring(5, 6) !== '/') {
            return false;
        }
        if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
            return false;

        // Parse the date parts to integers
        var parts = dateString.split("/");
        var day = parseInt(parts[1], 10);
        var month = parseInt(parts[0], 10);
        var year = parseInt(parts[2], 10);

        // Check the ranges of month and year
        if (year < 1000 || year > 3000 || month == 0 || month > 12)
            return false;

        var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // Adjust for leap years
        if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
            monthLength[1] = 29;

        // Check the range of the day
        return day > 0 && day <= monthLength[month - 1];
    };

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

    static validateDecimal(control) {
        var regex = new RegExp('^[0-9]+(\.[0-9]{1,2})?$');
        if (control.value == null) {
            return;
        }
        let val = (control.value).toString();
        if (!(regex.test(val))) {
            return { 'invalidDeciNumber': 'invalidDeciNumber' };
        }
        else {
            return null;
        }
    }

    validatePostiveNumeric(control) {
        var regex = new RegExp('^[0-9]*?$');
        if (control.value == null) {
            return;
        }
        let val = (control.value).toString();
        if (!(regex.test(val))) {
            return { 'invalidPositiveNumber': 'invalidPositiveNumber' };
        }
        else {
            return null;
        }
    }


}
