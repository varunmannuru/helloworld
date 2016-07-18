encapsulatedScript(function($localPath) {

   var css = angular.css(
      "vsl.core.ui.velocityLoading",
      $localPath.combineUrls("velocityLoading.css")
   );

   angular.module('vsl.core.ui.velocityLoading', ["ngAnimate", "angular.css"])
      .directive('velocityLoading', function($timeout) {
         return {
            replace: true,
            restrict: 'E',
            templateUrl: $localPath.combineUrls('velocityLoading.html'),
            css: css,
            link: function link(scope, element, attr) {

               scope.$on('vsl:core:lc:player-initialized', function(e, data) {
                  if ('problemType' in data) {
                     console.log('Loading...', data);
                     scope.clearLoading = true;
                  }
               })

               var imgcnt = 0;
               var bgImgs = [
                  $localPath.combineUrls("../../resources/images/velocity-loading-bg.svg"),
                  $localPath.combineUrls("../../resources/images/logos/velocity-loading-logo.svg")
               ];

               angular.forEach(bgImgs, function(img) {
                  var _img = new Image();
                  _img.src = img;
                  _img.onload = function() {
                     imgcnt++;

                     if (imgcnt >= bgImgs.length) {
                        scope.showBGs = true;
                     }

                     scope.$apply();

                  };
               });
            }
         }
      })
      .directive('countUp', function($timeout) {
         return {
            restrict: 'EA',
            link: function(scope, element, attr) {

               var _el = angular.element(element[0]);
               var watchBuffer;

               scope.$watch('showBGs', function(nv) {
                  if (nv) {
                     watchBuffer = setInterval(updateProgressBar, 250);
                  }
               })

               scope.$watch('clearLoading', function(nv) {
                  if (nv) {
                     clearProgress();
                  }
               })

               /**** ****/
               var upcnt = 0;
               var updateProgressBar = function() {
                  if (upcnt <= 98) {
                     upcnt++;
                     //              _el.html(upcnt++ + '%');
                     scope.progressNum = upcnt;
                  }
                  scope.$apply();
               };
               var clearProgress = function() {
                  upcnt = 100;
                  //          _el.html("100%");
                  scope.progressNum = upcnt;
                  clearInterval(watchBuffer);

                  $timeout(function() {
                     scope.hideLoading = true;
                  }, 500);
               };
               /**** ****/
            }
         }
      })
});
