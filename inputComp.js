'use strict';

// styles input field appropriately, and
// shows popup error messages
angular.module('cv.input', ['nsPopover'])

  .constant('cvInputDefaultDescriptions', {
    'email': 'shared.input.error.email.message',
    'required': 'shared.input.missing.general'
  })

  .controller('cvInputController', ['$scope', '$translate', 'cvInputDefaultDescriptions', function($scope, $translate, cvInputDefaultDescriptions) {

    // finds an error in model and
    // returns an appropriate error message form directive's parameters
    function getErrorMessage(model, descriptions){
      var errorKey = _.findKey(model.$error, function(value) {
        return value === true;
      });

      var description = (descriptions && descriptions[errorKey]) || cvInputDefaultDescriptions[errorKey];
      if(description) {
        return $translate.instant(description.toUpperCase());
      }
      return '';
    }

    $scope.modelApplied = function() {

      $scope.shouldShowError = function() {
        return $scope.model.$invalid && $scope.model.$dirty;
      };

      $scope.shouldShowSuccess = function() {
        return $scope.model.$valid && $scope.model.$dirty;
      };

      $scope.$watchCollection('model.$error', function(newValue, oldValue) {
        $scope.errorMessage = getErrorMessage($scope.model, $scope.descriptions);
      });

    };
  }])
  .directive('cvInput', ['$http', '$compile', '$interpolate', '$templateCache',  function ($http, $compile, $interpolate, $templateCache) {
    return {
      restrict: 'A',
      replace: true,
      require: '?ngModel',
      controller: 'cvInputController',
      scope: {},
      link: function ($scope, $element, $attrs, $model) {
        if (!$model) {
          return;
        }
        $scope.model = $model;
        $scope.modelApplied();

        $scope.descriptions = $scope.$eval($attrs.cvInput);

        $element.removeAttr('cv-input');
        $element.wrap('<div class="cv-input"></div>');
        $http.get('components/input/cv-input.html', {cache:$templateCache})
          .then(function(result) {
            $element.after($compile(result.data)($scope));
          });
      }
    }
  }]);
