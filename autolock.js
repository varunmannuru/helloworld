/*!
 * Copyright (c) 2015 Cisco and/or its affiliates.
 *
 * PROPRIETARY AND CONFIDENTIAL -ALL USE MUST BE LICENSED
 *
 * The code, technical concepts, all information contained herein and related
 * documentation are the property of, proprietary to and are vested in Cisco
 * Technology, Inc. and/or its affiliated entities, ("Cisco") under various
 * laws including copyright, international treaties, patent, trade secret
 * and/or contract. Any copying, dissemination, reverse engineering, disclosure
 * or other use of the material contained herein without an express license
 * from Cisco is prohibited and, among other legal consequences, constitutes an
 * infringement of the intellectual property and the proprietary rights of
 * Cisco. All use of the material herein must be in strict accordance with the
 * terms of the license you have entered into with Cisco.
 *
 */
'use strict';

angular.module('cv.autoLockTop', [])

.directive('cvAutoLockTop', function () {
  return {
    restrict: 'AE',
    replace: true,
    transclude: true,
    templateUrl: "components/auto-lock-top/auto-lock-top.html",
    scope: {
      scrollableAreaSelector: '@',
      hideOverlay:            '='
    },
    link: function (scope, element) {
      var placeholder = element.find('.cv-auto-lock-placeholder');
      var body = element.find('.cv-auto-lock-body');
      var scrollableArea = $('body').find(scope.scrollableAreaSelector);
      var scrollableAreaTop;
      var placeholderTop;

      scope.$watch('hideOverlay', function(hide){
        //console.log('scrollableArea hideOverlay:', scope.hideOverlay);
        if(hide){
          body.fadeOut();
        } else {
          body.fadeIn();
        }
      });

      function updateBodyPos(){
        //console.log('scrollableArea hideOverlay:', scope.hideOverlay);
        //console.log('scrollableArea scrollTop:', scrollableArea.scrollTop());
        //console.log('scrollableArea top:', scrollableAreaTop);

        placeholderTop = placeholder.offset().top;
        var offset = placeholderTop - scrollableAreaTop;
        //console.log('placeholder offset:', offset);

        // outside of view need to shift back to zero
        if(offset < 0){
          body.offset({top: scrollableAreaTop})
        } else {
          body.offset({top: placeholderTop})
        }
      }

      function updateScrollableAreaTop(){
        if(scrollableArea.offset()) {
          scrollableAreaTop = scrollableArea.offset().top;
        }
      }

      function init(){
        updateScrollableAreaTop();

        // make placeholder same size as body
        placeholder.width(body.width());
        placeholder.height(body.height());
      }


      // event handler
      // if the user scrolls the area
      scrollableArea.scroll(updateBodyPos);

      // event handler
      // if the scrollableArea is resized then have to update scrollableAreaTop and update body pos
      scrollableArea.resize(function(){
        updateScrollableAreaTop();
        updateBodyPos();
      });

      // setup everything up
      init();
    }
  }
});
