encapsulatedScript(function($localPath) {
   function log() {
      console.log.apply(console,arguments);
   }

   log("Script: vsl.velocity.ui.copyright",$localPath);

   var transitionTime = 1;

   var css=angular.css("vsl.velocity.ui.copyright");

   var module=angular.module("vsl.velocity.ui.copyright",[
      "angular.css",
      "vsl.core",
      "vsl.velocity.app.services",
      "vsl.velocity.app.directives",
      "vsl.velocity.views.common.privacyPolicy",
      "vsl.velocity.views.common.termsOfUse",
      "oc.lazyLoad"
   ]).run(function() {
      log("Module: vsl.velocity.ui.copyright");
   });

   module.controller("copyrightController",copyrightController);

   copyrightController.$inject=['$scope', '$timeout', '$modal', '$location', '$injector', '$ocLazyLoad', 'copyrightService', 'termsOfUseService', 'temporaryStorage'];

   function copyrightController($scope, $timeout, $modal, $location, $injector, $ocLazyLoad, copyrightService, termsOfUseService, temporaryStorage) {
      log("Controller: vsl.velocity.ui.copyright");

      /* -----vvvvv----- DETERMINE AVAILABILITY ----- */
      $scope.allowCheat=function(){
         if (window.location.host.indexOf("dev.")>-1 || window.location.host.indexOf("qa.")>-1 || window.location.hostname.toLowerCase()=="localhost") {
            return true;
         } else {
            return (window.globals.useType=="DEV" || window.globals.useType=="QA");
         }
      };
      /* -----^^^^^----- DETERMINE AVAILABILITY ----- */

      /* -----vvvvv----- SETTING UP ALTERNATE ACCESS SHORTCUTS ----- */
      var parser = new UAParser();
      var os = parser.getOS();
      if (os.name=="iOS" || os.name=="Android" || os.name=="Chromium OS") {
         if ($scope.allowCheat()) {
            $scope.alternateAccessEnabled=true;
         }
      }
      /* -----^^^^^----- SETTING UP ALTERNATE ACCESS SHORTCUTS ----- */

      $scope.serverInfoVisible = false;

      $timeout(function(){
         $scope.copyrightYear = new Date().getFullYear();
      },0);

      $scope.keyDownOccurred=function(event){
         if (event.which==67) $scope.cKeyPressed=true;
         if (event.which==68) $scope.dKeyPressed=true;
         if (event.which==83) $scope.sKeyPressed=true;
         if ($scope.dKeyPressed)
            $("."+css.expand("-symbol")).attr("tablet",true);
      };

      $scope.keyUpOccurred=function(event){
         if (event.which==67) $scope.cKeyPressed=false;
         if (event.which==68) $scope.dKeyPressed=false;
         if (event.which==83) $scope.sKeyPressed=false;
         if (!$scope.dKeyPressed)
            $("."+css.expand("-symbol")).removeAttr("tablet");
      };

      $scope.alternateAccessClicked = function(accessItem){
         if ($scope.allowCheat()) {
            switch (accessItem) {
               case "C": accessCheatModal(); break;                  //show cheat modal window
               case "D": /* SEE JSP CODE */  break;                  //show debug modal window
               case "S": toggleServerInfo(); break;                  //show server information
            }
         } else {
            console.error("Access Denied...");
         }
      };

      $scope.symbolClicked = function() {
         if ($scope.allowCheat()) {
            switch (true) {
               case $scope.cKeyPressed: accessCheatModal(); break;   //show cheat modal window
               case $scope.dKeyPressed: /* SEE JSP CODE */  break;   //show debug modal window
               case $scope.sKeyPressed: toggleServerInfo(); break;   //show server information
            }
         } else {
            console.error("Access Denied...");
         }
      };

      function accessCheatModal(){
         try {
            openStudentModal();
         } catch(e) {
            try {
               $("#modal").modal("show");
            } catch(e) {}
         }
      }

      function toggleServerInfo(){
         $scope.serverInfoVisible= !$scope.serverInfoVisible;
         if (!$scope.serverInfoVisible) {
            //Do nothing...
         } else {
            $timeout(function(){
               copyrightService.getServerInfo().then(function(serverInfo){
                  log("\tserverInfo: ",serverInfo);
                  var details="";
                  if (serverInfo) {
                     if (serverInfo.success) {
                        //TODO:
                     } else {
                        details=serverInfo.messages[0].message;
                     }
                  } else {
                     var details="Unexpected error occurred";
                  }
                  var element=angular.element(document.querySelector("."+css.expand("-serverDetails")));
                  element.text(details);
               },function(){
                  var details="Functionality not yet implemented.";
                  var element=angular.element(document.querySelector("."+css.expand("-serverDetails")));
                  element.text(details);
               });

            },0);
         }
      }

      $scope.privacyClicked = function(){
         log("FUNC --> privacyClicked()");
         $modal.open({
            templateUrl:$localPath.combineUrls("../../views/common/privacyPolicy/privacyPolicy.html"),
            controller:"privacyPolicyController",
            scope:$scope
         }).result.then(function(reason){
            if (reason=='accept') {
               $scope.$broadcast("vsl.velocity.ui.copyright.privacyPolicy-accept");
            } else {
               $scope.$broadcast("vsl.velocity.ui.copyright.privacyPolicy-reject");
            }
         },function(reason){
            $scope.$broadcast("vsl.velocity.ui.copyright.privacyPolicy-close");
         });
      };
      
      $scope.emailClicked = function(){
         log("FUNC --> emailClicked()");
         document.location.href="mailto:support@voyagersopris.com";
      };

      $scope.chatClicked = function(){
         log("FUNC --> chatClicked()");

      };

      $scope.termsClicked = function(){
         log("FUNC --> termsClicked()");
         if (!$scope.userSignedIn) {
            if (typeof(windows)=="undefined" || !windows || !windows.globals) {
               $scope.userSignedIn=false;
            } else {
               $scope.userSignedIn=(window.globals.userUuid?true:false);
            }
         }

         temporaryStorage.get('userHasAcceptedTermsOfUse').then(function(value){
            $scope.userHasAcceptedTermsOfUse = value || false;
            log("\tuserSignedIn: ",$scope.userSignedIn);
            log("\tuserHasAcceptedTermsOfUse: ",$scope.userHasAcceptedTermsOfUse);

            if (!$scope.userSignedIn || $scope.userHasAcceptedTermsOfUse) {
               showTermsOfUse();
            } else {
               copyrightService.getTermsOfUseStatus().then(function(termsOfUseStatus){
                  log("\tRESPONSE termsOfUseStatus: ",termsOfUseStatus);
                  if (termsOfUseStatus) {
                     if (termsOfUseStatus.success) {
                        $scope.userHasAcceptedTermsOfUse=(termsOfUseStatus.property!=null);
                     } else {
                        $scope.userHasAcceptedTermsOfUse=false;
                     }
                  } else {
                     $scope.userHasAcceptedTermsOfUse=false;
                  }
                  temporaryStorage.set('userHasAcceptedTermsOfUse',$scope.userHasAcceptedTermsOfUse);
                  showTermsOfUse();
               });
            }
         });

      };

      function showTermsOfUse(){
         log("FUNC --> showTermsOfUse()");

         $scope.settings={
            title:"Terms Of Use",
            subtitle:"Voyager Sopris Learning, Inc.",
            action:"termsOfUse",
            width:900,
            isBlue:true
         };

         if (!$scope.userSignedIn || $scope.userHasAcceptedTermsOfUse) {
            $scope.settings.keepOpenOnAccept=false;
            $scope.settings.hasClose=true;
         } else {
            $scope.settings.keepOpenOnAccept=true;
            $scope.settings.showProcessing=true;
            $scope.settings.buttons={
               accept:"OK",
               reject:"Cancel"
            };
            $scope.settings.default="reject";
            $scope.settings.disabled=true;
            $scope.settings.splitButtons=true;
         }

         $modal.open({
            templateUrl:$localPath.combineUrls("../../views/common/termsOfUse/termsOfUse.html"),
            controller:"termsOfUseController",
            scope: $scope
         }).result.then(function(reason){
            if (reason=='accept') {
               $scope.$broadcast("vsl.velocity.ui.copyright.termsOfUse-accept");
            } else {
               $scope.$broadcast("vsl.velocity.ui.copyright.termsOfUse-reject");
            }
         },function(reason){
            $scope.$broadcast("vsl.velocity.ui.copyright.termsOfUse-close");
         });
      }

      /* -----vvvvv----- HANDLE IMAGE CREDITS ------- */
      $scope.$on('broadcastCredits', function() {
         var creditService = $injector.get('vsl.core.creditService');
         $scope.credits = creditService.credits;
      });

      $scope.creditsClicked = function(){
         $ocLazyLoad.load({
            name: "vsl.velocity.views.common.photoCredits",
            files: [ $localPath.combineUrls("../../views/common/photoCredits/photoCredits.js") ]
         }).then(function(){
            var service = $injector.get('photoCreditsService');
            service.openModal($scope.credits);
         });
         return;
      };
      /* -----^^^^^----- HANDLE IMAGE CREDITS ------- */

      return;
   }

   module.service("copyrightService",copyrightService);
   
   copyrightService.$inject=['$q', 'vsl.core.propertyService'];

   function copyrightService($q, propertyService){
      log("Service: vsl.velocity.ui.copyright");

      var service={};

      service.getServerInfo = function() {
         log("SRVC --> getServerInfo()");

         var deferred = $q.defer();
         /*
         $http({
            method: "GET",
            url: "/services/serverInfo"
         }).success(function(data, status, header, config){
            deferred.resolve(data.result);
         }).error(function(){
            deferred.reject();
         });
         */
         deferred.reject();
         return deferred.promise;
      };


      service.getTermsOfUseStatus = function() {
         log("SRVC --> getTermsOfUseStatus()");
         var deferred = $q.defer();
         propertyService.getPrincipalProperty({
               "property": {
                  "applicationUuid":window.globals.appUuid,
                  "principalUuid":window.globals.userUuid,
                  "key":"TermsOfUseAccepted"
               }
         }).success(function(data,status,header,config){
            deferred.resolve(data.result);
         }).error(
            deferred.reject
         );
         return deferred.promise;
      };

      return service;
   }

   module.directive("copyright",copyright);

   copyright.$inject=['$q', '$compile'];

   function copyright($q, $compile) {
      log("Directive: vsl.velocity.ui.copyright");

      var cssDeferred = $q.defer();

      css.load([
         $localPath.combineUrls("copyright.css"),
         $localPath.combineUrls("../../resources/fonts/fonts.css"),
         $localPath.combineUrls("../../resources/images/icons.css")
      ],transitionTime).then(cssDeferred.resolve);

      return {
         restrict: "E",
         replace: true,
         templateUrl: $localPath.combineUrls("copyright.html"),
         controller: copyrightController,
         link: link,
         css: css
      };

      function link($scope, element, attributes) {
         log("Instance: vsl.velocity.ui.copyright");
         
         cssDeferred.promise.then(function() {
            $scope.copyrightUIReady = true;
            $scope.access=element.attr("access");
            $scope.noTermsOfUse=(element.attr("no-terms-of-use")=="" || element.attr("no-terms-of-use")?true:false);
         });

         if (typeof(attributes.autoOpenTermsOfUse)!="undefined" && attributes.autoOpenTermsOfUse!=="false") {
            $scope.userSignedIn=true;
            $scope.userHasAcceptedTermsOfUse=false;
            $scope.termsClicked();
         }
      }

   }

});
