<%@ include file="../common/_taglibs.jsp"%>
<!DOCTYPE html>
<html  ng-app="app">
<head>
    <title>Error page</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    
    
   <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro">
    <link href="../../../resources/css/error.css" rel="stylesheet" media="screen" />
    <link rel="stylesheet" type="text/css" href="../../../resources/css/k5i.css?${versionNumber}" media="screen" />
    <script src="${appClientRoot}/vsl/velocity/ui/copyright/copyright.js?${versionNumber}"></script>
   <script src="../../../resources/js/jquery-2.1.1.js"></script>
   <script src="../../../resources/js/angular/angular.js"></script>
   <script type="text/javascript">
   
            angular.module("app",[
            
            "vsl.velocity.ui.copyright"
            
         ]);
angular.module("app").controller('ErrorController',['$scope', function
         ($scope){

          $scope.gotoHome = function(){
          window.location.href = '/home';
        };
         }]);
    </script>

</head>
 
<body  ng-controller="ErrorController">
<!-- <div class="container">
    <div>${statusCode}</div>
    <div>An unexpected error has occured:</div>
    <div>
      <jsp:include page="../fragments/alert.jsp">
        <jsp:param name="message" value="${errorMessage}" />
      </jsp:include>
    </div>
    <div>${exceptionName}</div>
    <div>${requestId}</div> 
</div> -->
 <div class="popupbg">
      <div class="error-title"><span class="velocityError"></span></div>
     
      <div  class="modal-body"  style=" -webkit-user-select:all ;">
         
         <table border='0' style="height:100%; width: 800px;
            margin: auto;">
            <tr>
               <td width="50%" style="text-align: -webkit-right;">
                  <div class="errorSloth"></div>
               </td>
               <td>
                  <div class="popup-right-container">
                     <div class="title">
                        Oops!
                     </div>
                     <div class="message">
                       The page you are looking for does not exist.
                     </div>
                     <div>
                        <button class="btn btn-default return-button btn-close" ng-click="gotoHome()"><span>RETURN</span><span class="icon"></span></button>
                     </div>
                     <div class="errorMsg">
                      ERROR 404: PAGE NOT FOUND
                     </div>
                  </div>
               </td>
            </tr>
         </table>
      </div>
   </div>
<copyright style="z-index:89;" access="S" no-terms-of-use></copyright>
</body>
</html>
