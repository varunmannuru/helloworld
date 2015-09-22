angular.module('cv.dpHotswapDevice', ['blockUI'])
  .controller('dpHotswapDeviceModelController', ['$scope', '$modalInstance', 'blockUI', 'onHotswap', 'supportedDeviceTypes', 'isInvalidSerial',
    function ($scope, $modalInstance, blockUI, onHotswap, supportedDeviceTypes, isInvalidSerial) {
    var loaders = {};
    $scope.serialId = "";
    $scope.onHotswap = onHotswap;
    $scope.supportedDeviceTypes = supportedDeviceTypes;
    $scope.isInvalidSerial = isInvalidSerial;
    $scope.error = null;

    $scope.$watch('show', function(newVal){
      if(newVal) {
        // reset it back to false so a show set to true will show again
        // can't trap all states when model is closed
        $scope.show = false;
        $scope.openModal('dpHotswapDeviceModel');
      }
    });

    $scope.hotswap = function(serialId){
      // if input invalid, shortcut
      if($scope.isInvalidSerial(serialId)){
        return;
      }

      startLoader('dpHotswapDeviceModel');

      if( $scope.onHotswap &&
          _.isFunction($scope.onHotswap)
      ) {
        $scope.onHotswap(serialId)
          .then(function(){
            stopLoader('dpHotswapDeviceModel');
            $scope.closeModal('dpHotswapDeviceModel');
          })
          .catch(function(error){
            $scope.error = error;
            stopLoader('dpHotswapDeviceModel');
            //console.log('hotswap error:', error);
          });
      } else {
        stopLoader('dpHotswapDeviceModel');
      }
    };

    function startLoader(type){
      type = $.camelCase(type);

      if(!loaders[type]) {
        loaders[type] = {};
      }
      loaders[type].show = true;

      loaders[type].blockUI = blockUI.instances.get(type);
      if(loaders[type].blockUI) {
        loaders[type].blockUI.start();
      }
    }

    function stopLoader(type){
      type = $.camelCase(type);

      if(!loaders[type]) {
        loaders[type] = {};
      }
      loaders[type].show = false;

      if(loaders.hasOwnProperty(type) &&
        loaders[type] &&
        loaders[type].blockUI) {
        loaders[type].blockUI.stop();
      }

    }

    $scope.closeModal = function() {
      $modalInstance.dismiss();
    };

  }]);
