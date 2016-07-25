encapsulatedScript(function($localPath) {
   function log() {
      console.log.apply(console,arguments);
   }

   log("Script: vsl.velocity.views.common.signin",$localPath);

   var transitionTime = 1;

   var css=angular.css("vsl.velocity.views.common.signin");

   var module=angular.module("vsl.velocity.views.common.signin",[
      "ngAnimate",
      "angular.css",
      "vsl.velocity.ui.popupModal",
      "vsl.velocity.views.common.privacyPolicy",
      "vsl.velocity.ui.copyright"
   ]).run(function() {
      log("Module: vsl.velocity.views.common.signin");
   });

   module.controller("signinController",signinController);

   signinController.$inject=['$scope', '$location'];

   function signinController($scope, $location) {
      log("Controller: vsl.velocity.views.common.signin");

      $scope.loginError = $location.$$absUrl.indexOf("error")>-1;

      return;
   }

   module.service("signinService",signinService);

   signinService.$inject=['$q', 'temporaryStorage'];

   function signinService($q, temporaryStorage){
      log("Service: vsl.velocity.views.common.signin");

      return;
   }

   module.directive("signin",signin);

   signin.$inject=['$q'];

   function signin($q) {
      log("Directive: vsl.velocity.views.common.signin");

      var cssDeferred = $q.defer();

      css.load($localPath.combineUrls("signin.css")).then(cssDeferred.resolve);

      return {
         restrict: "E",
         templateUrl: $localPath.combineUrls("signin.html"),
         controller: signinController,
         link: link,
         css: css
      };

      function link($scope, element, attributes) {
         cssDeferred.promise.then(function() {
            $scope.uiReady = true;
         })
      }

   }

});
