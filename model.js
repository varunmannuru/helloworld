angular.module('cv.confirmationModal', [])

  .service('confirmationModal',
  ['$compile', '$modal', '$timeout', function ($compile, $modal, $timeout) {

      return function (options) {

          var templateUrl = options.templateUrl ?
                            options.templateUrl :
                            'components/confirmation-modal/confirmation-modal.html';

          var confirmationModal = $modal.open({
              templateUrl: templateUrl,
              backdrop:    'static',
              windowClass: 'medium',
              controller:  ['$scope', '$modalInstance', 'blockUI', '$document',
                  function ($scope, $modalInstance, blockUI, $document) {

                      $scope.headerText = options.headerText;
                      $scope.bodyText = options.bodyText;
                      $scope.hideCancel = options.hideCancel;
                      $scope.value = options.value;

                      $timeout(function () {
                          //puts default focus on modal to prevent enter re-opening multiple modals
                          $('.reveal-modal').focus();
                          if (!options.hideCancel) {
                              //hides cancel first so it doesn't pop in and out of view on open
                              $('#confirmation-modal-cancel-button').removeClass('hidden');
                          }
                      }, 200);

                      // prevent tabbing to avoid tabbing outside of modal
                      // (unfixed issue with Reveal Modals)
                      function onKeydown(e) {
                          if (e.which === 9) { //tab key
                              e.preventDefault();
                          }
                      }

                      $document.on('keydown', onKeydown);
                      $scope.$on('$destroy', function () {
                          $document.off('keydown', onKeydown);
                      });

                      var confirmationModalBlock = blockUI.instances.get('confirmationModalBlock');

                      $scope.cancel = function () {
                          $modalInstance.dismiss('cancelled');
                          if (options.cancelFunction){
                              options.cancelFunction();
                          }
                      };
                      $scope.confirm = function () {

                          if (options.action) {
                              confirmationModalBlock.start();
                              //console.log(options.action);
                              options.action().then(function (result) {
                                  confirmationModalBlock.stop();
                                  $modalInstance.close(result);
                              })
                          } else {
                              $modalInstance.close('no promise');
                          }
                      }
                  }]
          });
          return confirmationModal.result;
      }
  }]);
