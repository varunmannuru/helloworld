angular.module('cv.deviceDetailsPanel', ['cv.dpHotswapDevice', 'ui.utils'])
  .controller('DeviceDetailsPanelController', [
    '$scope',
    'serverServices',
    'serverDevices',
    'blockUI',
    '$q',
    '$modal',
    '$translate',
    'graphConfig',
    function($scope,
             serverServices,
             serverDevices,
             blockUI,
             $q,
             $modal,
             $translate,
             graphConfig) {
    var loaders = {};

    $scope.loadLogs = false;
    $scope.tempInput = "456";
    $scope.prevView = $scope.view;


    /** **********************************************
     // Config and load performance graph's data
     */
    $scope.graphSliderConfig = graphConfig.graphSliderConfig;

    $scope.graphDataMapping = {
      "x":"time",
      "y":"value",
      "graph1":{"src":"internetTraffic", "visible":true, "title": $translate.instant('DEVICES.CARD.INTERNET_TRAFFIC')},
      "graph2":{"src":"onNetTraffic", "visible":false},
      "graph3":{"src":"connectedUsers", "visible":false}
    };

    // Callback when the the graph needs data to plot or whenever the slider changes
    $scope.fetchGraphData = function(data){
      if ($scope.device) {
        return serverDevices.getDevicePerformanceGraphData([$scope.device.id], data.range);
      }

      var deferred = $q.defer();
      deferred.reject({});
      return deferred.promise;
    };

    $scope.$watch('device', function(data) {
        if (data) {
            // on device change reset view back to details
            $scope.viewDetails();
            $scope.$broadcast('graph:reload');
        }
    });

    $scope.startEditingDeviceInfo = function(type) {
      //console.log('device panel startEditingDeviceInfo:', $scope.device._editing);

      if($scope.device != null) {
        if(!$scope.device._editing) {
          $scope.device._editing = {};
        }

        $scope.device._editing[type] = true;
      }
    };

    $scope.stopEditingDeviceInfo = function(type) {
      if($scope.device != null) {

        if(!$scope.device._editing) {
          $scope.device._editing = {};
        }

        $scope.device._editing[type] = false;
      }
    };

    $scope.openPerformanceHistory = function (data) {
      var modalInstance = $modal.open({
        templateUrl: '/views/services/performancehistory.html',
        controller: 'ServicesPerformanceHistoryController',
        windowClass: 'performance-history',
        resolve: {
          graphData: function () {
            return data.graphData;
          },
          sliderConfig: function () {
            return angular.copy(data.sliderConfig);
          },
          graphDataMapping: function () {
            return data.graphDataMapping;
          },
          onFetchGraphData: function () {
            return data.onFetchGraphData;
          }
        }
      });
    };

    $scope.saveLocation = function(location) {

      $scope.device.location = location;

      serverDevices.setDeviceInfo(
        $scope.device.id,
        $scope.device.name,
        $scope.device.location)
        .then(function(){
          // done
        });
    };

    $scope.saveDeviceInfo = function(type){
      serverDevices.setDeviceInfo(
        $scope.device.id,
        $scope.device.name,
        $scope.device.location)
        .then(function(){
          // done saving
          $scope.stopEditingDeviceInfo(type);
        });
    };


    $scope.viewAdvConfig = function(){
      // make a copy of the configs for edit
      if($scope.device.configs) {
        $scope.device._configs = _.cloneDeep($scope.device.configs);
      }

      $scope.prevView = $scope.view;
      $scope.view = 'adv-config';
    };

    $scope.viewLogs = function() {
      $scope.loadLogs = true;
      $scope.device._logs = null; // empty logs

      serverDevices.getLogs($scope.device.id)
        .then(function (devicesLogs) {
          $scope.loadLogs = false;
          $scope.device._logs = devicesLogs;
        });

      $scope.prevView = $scope.view;
      $scope.view = 'logs';
    };

    $scope.viewDetails = function() {
      $scope.prevView = $scope.view;
      $scope.view = 'details';
    };

    // ------------------------------------------------------
    // Foundation modal's functions
    $scope.preventDelete = function() {
      var numDevices = 0;
      if ($scope.devices) {
        numDevices = Object.keys($scope.devices).length;
      }
      return (numDevices <= 1);
    };

    $scope.openModal = function(elmId) {

      // Do not allow the last device to be deleted.
      var numDevices = Object.keys($scope.devices ).length;
      if (elmId == "dpDeleteDeviceModal" && numDevices <= 1) {
        return;
      }

      // reset temp input
      $scope.tempInput = "";

      // stop all loaders at start, just in case a prev loader was running
      stopLoader('dpDeleteDeviceModal');
      stopLoader('dpHotswapDeviceModel');

      // using Jquery and Foundation reveal function for modal's
      $('#'+elmId).foundation('reveal', 'open');

    };

    $scope.closeModal = function(elmId) {
      // reset temp input
      $scope.tempInput = "";
      // using Jquery and Foundation reveal function for modal's
      $('#'+elmId).foundation('reveal', 'close');
    };
    // ------------------------------------------------------

    $scope.hotswapDeviceSerial = function(newSerialId) {

      if($rootScope.queue.disableEdit === false) {

        // need to enter some new serial
        if(!newSerialId || !newSerialId.length) {
          return;
        }

        //console.log('dpHotswapDevice device:', $scope.device, ", newSerialId:", newSerialId);
        return serverDevices.hotswapDevice($scope.device.id, newSerialId)
          .then(function(res){
            //console.log("dpHotswapDevice done:", res);

            $scope.device.serialId = newSerialId;

            if($scope.onHotswap) {
              $scope.onHotswap($scope.device);
            }

            return true;
          })
          .catch(function(response){
            $scope.device.error = response.error;

            // could be dup serial
            //console.error("Error:", response.error);
            return $q.reject(response.error);
          });
      }
    };

    $scope.openHotswapDeviceModal = function() {
      var hotswapDeviceModal = $modal.open({
          templateUrl : 'components/device-panel/hotswap-device.html',
          controller  : 'dpHotswapDeviceModelController',
          windowClass : 'medium',
          resolve: {
            isInvalidSerial: function(){
              return $scope.isInvalidSerial;
            },
            onHotswap: function(){
              return $scope.hotswapDeviceSerial;
            },
            supportedDeviceTypes: function(){
              return $scope.supportedDeviceTypes;
            }
          }
        }
      );
    };

    $scope.deleteDevice = function() {
      var deviceToDelete = $scope.device;

      // flag device for removal
      deviceToDelete._prevstate = deviceToDelete.state;
      deviceToDelete.state = "deleting";
      deviceToDelete.processing = true; // used to show loader
      startLoader('dpDeleteDeviceModal');
      serverDevices.deleteDevice(deviceToDelete.id)
        .then(function(data) {
          // deleted
          deviceToDelete.processing = false;

          if(data.status != "ok" || !data.status) {

            var options = {};
            if(data.message) {
              options.message = data.message;
            } else {
              options.key     = "ERRORS.UNKNOWN";
            }
            $scope.$emit('global:error', options);

            // revert state back
            deviceToDelete.state = deviceToDelete._prevstate;
            $scope.$apply();

          } else {
            if($scope.onDelete) {
              $scope.onDelete(deviceToDelete);
            }
          }

          stopLoader('dpDeleteDeviceModal');
          $scope.closeModal('dpDeleteDeviceModal');
        })
        .catch(function(err){
          stopLoader('dpDeleteDeviceModal');

          // could be dup serial
          console.error("Error:", err);
        });

      // device current selected device because it's being deleted
      //$scope.deselectDevice();
    };

    $scope.formatTime = function(dateTime) {
      return moment(dateTime).format('MMM D, YYYY h:mma');
    };

    $scope.viewEditLocation = function() {
      $scope.prevView = $scope.view;
      $scope.view = 'edit-location';
    };


    $scope.configErrors = {};
    $scope.allowSave = function() {
        return (
            $scope.device && $scope.device._configs &&
            !(_.keys($scope.configErrors) && _.isEqual($scope.device._configs, $scope.device.configs))
        )
    };


    // on config change validate
    $scope.$watch('device._configs.wanDownloadSpeed', function(){
      $scope.validateAdvConfig();
    });
    $scope.$watch('device._configs.wanUploadSpeed', function(){
      $scope.validateAdvConfig();
    });
    $scope.$watch('device._configs.subnetMaskBits', function(){
      $scope.validateAdvConfig();
    });
    $scope.$watch('device._configs.lanIpBlock', function(){
      $scope.validateAdvConfig();
    });

    $scope.form = {};
    $scope.setFormScope = function(obj) {
      $scope.form = obj;
    };

    function formValidateNumber(name, errName) {
      if(!errName) errName = name;

      if($scope.form.advConfigForm &&
        $scope.form.advConfigForm[name] &&
        $scope.form.advConfigForm[name].$invalid) {
        //console.error('advConfigForm '+name+' error:', $scope.form.advConfigForm[name].$error);

        if($scope.form.advConfigForm &&
          $scope.form.advConfigForm[name] &&
          $scope.form.advConfigForm[name].$error &&
          $scope.form.advConfigForm[name].$error.required) {
          $scope.configErrors[errName] = $translate.instant('ERRORS.CONFIG.REQUIRED');
        }
        else if($scope.form.advConfigForm &&
          $scope.form.advConfigForm[name] &&
          $scope.form.advConfigForm[name].$error &&
          $scope.form.advConfigForm[name].$error.number) {
          $scope.configErrors[errName] = $translate.instant('ERRORS.CONFIG.NUMBER_TYPE');
        }
        else if($scope.form.advConfigForm &&
          $scope.form.advConfigForm[name] &&
          $scope.form.advConfigForm[name].$error &&
          ($scope.form.advConfigForm[name].$error.min ||
          $scope.form.advConfigForm[name].$error.max) ) {
          $scope.configErrors[errName] = $translate.instant('ERRORS.CONFIG.RANGE');
        }
      }

      // has error
      return !!($scope.configErrors[errName]);
    }

    $scope.resetToDefault = function() {
      // copy defaults to configs
      if(!$scope.device.configs.defaults) return;

      $scope.device._configs.wanDownloadSpeed = $scope.device.configs.defaults.wanDownloadSpeed;
      $scope.device._configs.wanUploadSpeed   = $scope.device.configs.defaults.wanUploadSpeed;
      $scope.device._configs.subnetMaskBits   = $scope.device.configs.defaults.subnetMaskBits;
      $scope.device._configs.lanIpBlock       = $scope.device.configs.defaults.lanIpBlock;
    };

    // Algo based on this: http://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing#IPv4_CIDR_blocks
    var showDebugging = false;
    function checkCIDR(ip, subnetMask) {
      if(subnetMask == 32) {
        // any valid IP works
        return true;
      }

      var addr     = ipaddr.parse(ip).octets;
      var block    = Math.floor(subnetMask / 8);
      var subRange = 8 - (subnetMask - (8 * block));
      var blockInc = 1 << subRange;
      var blockIps = addr[block] || 0; // if block outside of array then default to zero
      var blockSubRange = blockIps % blockInc;

      // if zero then all blocks must be zero
      if(subnetMask == 0) {
        block = -1;
      }

      if(showDebugging) {
        console.log('addr:', addr,
          ', block:', block,
          ", subRange:", subRange,
          ", blockInc:", blockInc,
          ", blockIps:", blockIps,
          ", blockSubRange:", blockSubRange);
      }

      for(var i = block+1; i < 4; i++) {
        if(addr[i] != 0) {
          // these should be zero
          //console.log('checkCIDR should be zero addr:', addr);
          return false;
        }
      }

      if(blockSubRange != 0) {
        //console.log('checkCIDR blockSubRange:', blockSubRange);
        return false;
      }

      return true;
    }

    $scope.validIpAdd = function(id) {
      var ip = $scope.device._configs.lanIpBlock;
      var subnetMask = $scope.device._configs.subnetMaskBits;
      // clear out old errors
      delete $scope.configErrors['lanIpBlock'];
      //console.log('ip:', ip, ", subnetMask:", subnetMask, ', id:', id);

      // validate IP
      try {
        var validIp = ipaddr.isValid(ip);
        //console.log("validateAdvConfig ip:", ip, ", isValid:", validIp);

        if(validIp) {
          //var ipMask = ip+'/'+$scope.device._configs.subnetMaskBits;
          validIp = checkCIDR(ip, subnetMask);
          //console.log("validateAdvConfig ip:", ip, ", checkCIDR:", validIp);
        }
      } catch(e) {
        validIp = false;
        //console.log("validateAdvConfig ip:", ip, ", catch e:", e);
      }

      //console.log("validateAdvConfig ip:", ip, ", validIp:", validIp);
      if(!validIp) {
        $scope.configErrors['lanIpBlock'] = $translate.instant('ERRORS.CONFIG.IPADDRESS');
      }

      return validIp;
    };

    $scope.validateAdvConfig = function() {
      $scope.configErrors = {};
      if(!$scope.device || !$scope.device._configs) return;

      //console.log('validateAdvConfig configs:', $scope.device._configs);
      // validate inputs
      formValidateNumber('wanDownloadSpeed');
      formValidateNumber('wanUploadSpeed');
      //formValidateNumber('subnetMaskBits', 'lanIpBlock');
      //formValidateNumber('lanIpBlock');
    };

    $scope.saveAdvConfig = function() {
      $scope.validateAdvConfig();

      if($scope.allowSave()) {
        // start loader
        startLoader('dpAdvConfigSave');

        //console.log("saveAdvConfig:", $scope.device._configs);
        serverDevices.setAdvancedDeviceConfig($scope.device.id, $scope.device._configs)
          .then(function(results){
            // stop loader
            stopLoader('dpAdvConfigSave');

            //console.log('saveAdvConfig results:', results);
            // store changes
            $scope.device.configs = _.cloneDeep($scope.device._configs);
            //console.log('saveAdvConfig config:', $scope.device.configs);

            // done, change to viewDetails
            $scope.viewDetails();
          })
          .catch(function(err) {
            stopLoader('dpAdvConfigSave');

            if(!_.isString(err.error) &&
                _.isObject(err.error) &&
                err.error.message
            ) {
              $scope.configErrors["lanIpBlock"] = err.error.message;
            } else {
              $scope.configErrors["lanIpBlock"] = err.error;
            }

            //console.log('saveAdvConfig error:', $scope.configErrors["lanIpBlock"]);
          });
      }
    };

    function startLoader(type){
      type = $.camelCase(type);
      //console.log("startLoader type:", type);

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
      //console.log("stopLoader type:", type);

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

  }])
  .directive('cvDeviceDetailsPanel', function () {
    return {
      restrict: 'AE',
      replace: true,
      templateUrl: '/components/device-panel/device-panel.html',
      scope: {
        device: '=',
        devices: "=",
        numDevices: '=',
        supportedDeviceTypes: '=',
        onDelete:  '=',
        onHotswap: '=',
        onBack:    '=',
        onNameEdit: '=',
        isInvalidSerial: '=',
        detailsReadOnly: '='
        //allowEdit: '=' // optional (processed with attrs
      },
      controller: "DeviceDetailsPanelController",
      link: function (scope, element, attrs) {
        scope.allowEdit = false;
        scope.view = 'details';

        if(attrs.allowEdit) {
          scope.allowEdit = scope.$eval(attrs.allowEdit); // eval lets you process variables
        }
      }
    }
  })
  .directive('cvDeviceDetailsPanelDetails', function () {
    return {
      restrict: 'AE',
      replace: true,
      templateUrl: '/components/device-panel/device-panel-details.html'
    }
  })
  .directive('cvDeviceDetailsPanelLogs', function () {
    return {
      restrict: 'AE',
      replace: true,
      templateUrl: '/components/device-panel/device-panel-logs.html'
    }
  })
  .directive('cvDeviceDetailsPanelEditLocation', function () {
    return {
      restrict: 'AE',
      replace: true,
      templateUrl: '/components/device-panel/device-panel-edit-location.html'
    }
  })
  .directive('cvDeviceDetailsAdvConfig', function () {
    return {
      restrict: 'AE',
      replace: true,
      templateUrl: '/components/device-panel/device-details-adv-config.html'
    }
  })
;
