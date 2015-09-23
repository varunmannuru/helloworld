'use strict';

angular.module('cv.alertPopup', [])

  .directive("cvAlertPopup", ['$timeout', '$queueFactory', '$state', '$rootScope',
      function ($timeout, $queueFactory, $state, $rootScope) {
      return {
          templateUrl: "components/alert-popup/alert-popup.html",
          restrict:    'AE',
          replace:     true,
          controller:  [
              '$scope', '$element', '$attrs', '$translate',
              function ($scope, $element, $attrs, $translate) {

                  var defaults = {
                      popup:       false,
                      viewButton:  false,
                      closeButton: true
                  };

                  function resetShowToDefaults() {
                      $scope.show = {
                          popup:       defaults.popup,
                          viewButton:  defaults.viewButton,
                          closeButton: defaults.closeButton
                      };
                  }

                  $scope.state = 'success';

                  $rootScope.$on('alert:show', function (event, config) {

                      $scope.state = config.state || 'success';

                      if (config.key) {
                          $scope.message = convertToTranslate(config.key, config.interpolate);
                      } else {
                          $scope.message = config.message || null;
                      }

                      $scope.submessage = config.submsg ? config.submsg : '';
                      if (config.show) {
                          $scope.show = {
                              popup:       true,
                              viewButton:  (config.show.viewButton !== undefined) ? config.show.viewButton : defaults.viewButton,
                              closeButton: (config.show.closeButton !== undefined) ? config.show.closeButton : defaults.closeButton
                          }
                      } else {
                          //assume other defaults and then show the popup
                          resetShowToDefaults();
                          $scope.show.popup = true;
                      }

                  });

                  $rootScope.$on('alert:hide', function (event, delayExit) {
                      if (event && _.isFunction(event.stopPropagation)) {
                          event.stopPropagation();
                      }
                      $scope.hidePopover(delayExit)
                  });

                  $scope.hidePopover = function (delayExit) {
                      if (delayExit) {
                          $timeout(function () {
                              resetShowToDefaults();
                          }, 7000);
                      } else {
                          resetShowToDefaults()
                      }
                  };

                  $scope.refreshView = function () {
                      var id = $queueFactory.getCompletedRoute();
                      $state.go(id, {}, {reload:true});
                  };

                  function convertToTranslate(errorKey, interpolationParams) {
                      errorKey = errorKey.toUpperCase();
                      return $translate.instant(errorKey, interpolationParams);
                  }
              }
          ]
      };

  }]);
