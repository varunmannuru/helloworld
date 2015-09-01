'use strict';

angular.module('cv.datePicker', [])

.controller('DatePickerController', ['$scope', function ($scope) {

}])

.directive('cvDatePicker', function () {
    var timezoneOffset = moment().zone();
    return  {
        templateUrl: "components/date-picker/date-picker.html",
        restrict: 'AE',
        replace: 'true',
        scope: {
        	updateCallback      : "=",
          showDatepicker      : "=",
          disableInput        : "="
        },
        controller: "DatePickerController",
        link: function(scope, element){
          var datepickerEl = $(element).find('.date-picker');

          scope.displayPicker = function(){
            datepickerEl.fdatepicker('show');
          };

          if(typeof(scope.showDatepicker) != 'undefined'
            && scope.showDatepicker !== null) {
            scope.$watch('showDatepicker', function(newValue, oldValue) {
              if(newValue == oldValue) {
                return;
              }
              datepickerEl.fdatepicker('show');
            });
          }
          var input = datepickerEl.fdatepicker().on('changeDate', function (ev) {
            if (typeof(scope.updateCallback == 'function')) {
              // convert to current timezone, return moment
              scope.updateCallback(moment(ev.date.getTime()).add(timezoneOffset, 'minutes'))
            }
          input.hide();
		    }).data('datepicker');
        }
    }
});
