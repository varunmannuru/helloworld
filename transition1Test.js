(function($localPath){
    if (window.location.search.length>1)
       angular.element(document.body).addClass("vslapp_skin-"+window.location.search.substr(1));
  angular.module("app",["vsl.core.ui.postStartup"])
  .directive('guide',function() {
    return {
      restrict: 'EA',
      link: function(scope,element,attr) {
        scope.$watch('showGuides',function(nv) {
          if(nv) {
            angular.element(element[0]).addClass('guide');
          } else {
            angular.element(element[0]).removeClass('guide');
          }
        })
      }
    }
  })
})(window.location.href);
