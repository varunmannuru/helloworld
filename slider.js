'use strict';

angular.module('cv.ionSlider', [])
  .directive('ionSlider', [function () {
      return {
          template: '<div class="ion-slider"><input/></div>',
          restrict: 'AE',
          replace:  true,
          require:  '?ngModel',
          scope:    {
              min:                '=',
              max:                '=',
              step:               '=',
              from:               '=', // start value
              fromMin:            '=',
              fromShadow:         '@',
              grid:               '@',
              gridNum:            '=',
              gridSnap:           '@',
              externalOnComplete: '&onComplete',
              prettifyEnabled:    '@',
              hideMinMax:         '@',
              hideFromTo:         '@',
              prettifyFunc:       '&'
          },
          link:     function (scope, element, attrs, model) {

              if (!model) {
                  console.error('ion-slider requires an ng-model!');
                  return;
              }

              var sliderData = null;
              //done to prevent instantiation before 'from' attr is ready
              //so slider appears at '0'
              //(issue generally otherwise manifests when loaded to server)
              angular.element(document).ready(function () {
                  var sliderInput = element.find('input');

                  /*
                   pass in other attributes as needed, full list here:
                   http://ionden.com/a/plugins/ion.rangeSlider/demo_interactions.html
                   */

                  var options = {
                      min: (scope.min !== 'undefined') ? Number(scope.min) : 50,
                      max: (scope.max !== 'undefined') ? Number(scope.max) : 100,
                      step: (scope.step !== 'undefined') ? Number(scope.step) : 1,
                      from: (scope.from != 'undefined' ) ? Number(scope.from) : 0,
                      from_min: (scope.fromMin !== 'undefined') ? Number(scope.from_min) : 0,
                      from_shadow:      (scope.fromMin === 'true'),
                      grid:             (scope.grid === 'true'),
                      grid_num: (scope.gridNum !== 'undefined') ? Number(scope.grid_num) : scope.max,
                      grid_snap:        (scope.gridSnap === 'true'),
                      prettify_enabled: (scope.prettifyEnabled === 'true'),
                      hide_min_max:     (scope.hideMinMax === 'true'),
                      hide_from_to:     (scope.hideFromTo === 'true'),
                      prettify: (_.isFunction(scope.prettifyFunc)) ? scope.prettifyFunc() : null,
                      onChange:         function (data) {
                          onChange(data);
                      },
                      onFinish:         function (data) {
                          onComplete(data)
                      },

                      onStart: function (data) {
                          if (data.from) {
                              model.$setViewValue(data.from);
                          }
                      }
                  };
                  //console.log('ionRangeSlider options:', options);
                  sliderInput.ionRangeSlider(options);

                  sliderData = sliderInput.data("ionRangeSlider");
              });


              function onChange(data) {
                  model.$setViewValue(data.from);
              }

              function onComplete(data) {

                  model.$setViewValue(data.from);

                  if (_.isFunction(scope.externalOnComplete)) {
                      scope.externalOnComplete()
                  }
              }

              model.$render = function () {
                  sliderData.update({from: model.$viewValue})
              };
          }
      }
        ;
  }])
;
