encapsulatedScript(function($localPath) {
   var css = angular.css(
                         "vsl.core.ui.postStartup",
                         $localPath.combineUrls("postStartup.css")
                        );
   angular.module('vsl.core.ui.postStartup',["vsl.velocity","ngAnimate","vsl.core.ui.spine","vsl.core.ui.iconButton","vsl.core.ui.nextButton", "vsl.core.ui.audioPlayer", "vsl.velocity.scenes"])
         .config(config)
         .directive('postStartup',function() {
      return {
         replace: true,
         restrict: 'E',
         controller: 'postStartupCtrl',
         templateUrl: $localPath.combineUrls('postStartup.html'),
         css: css,
         link: function link(scope,element,attr) {
                     scope.userName = attr.username ? attr.username : 'Velocity User';
                  }
      }
   })
         .controller('postStartupCtrl',["$scope","$sce","$http","$timeout","$q","vsl.velocity.problemService","vsl.core.ui.audioPlayer","vsl.velocity.scenes.service",function($scope, $sce,$http,$timeout,$q, problemService,audioPlayer, sceneService) {
      //function($scope,$sce,$http,$timeout,$q, vsl.core.ui.audioPlayer) {
      var characterDefer = $q.defer();
      var serviceDefer = $q.defer();
      var praiseTextDefer = $q.defer();

      $scope.data={};
      $scope.isUIReady = isUIReady;
      $scope.isUIError = isUIError;
      $scope.uiError = false;
      $scope.uiReady = false;
      $scope.characterAssets = { 
         name:"sloth",
              skeleton: "NormalBehaviorsSkeleton" 
      };
      //... Fetch skills from api...
      $q.all([
              callAPI(),
              characterDefer.promise
             ]).then(function() {
         $scope.uiReady = true;
         $scope.showNextBtn  = true;
         playCharacterAnimation();
      });
      //... Watch for when the character is ready...
      $scope.$watch('character.canvasReady',function(nv) {
         if(nv){
            characterDefer.resolve();
            $timeout(function() {


            },1000);
         }
      });

      $scope.gotoLessons = function(){
         window.location.href = '/lessons';
      };
      //: callAPI
      function callAPI() {
         $http.get($localPath.combineUrls('assets/audio/audio-data.json')).success(function(data) {
            //.. Picking Audio List..
            $scope.audioList = data;
            praiseTextDefer.resolve();
         });
         if (window.location.href.parseUrl().name === "test.html") {
            $timeout(function() {
               $http.get($localPath.combineUrls('assets/json/sample-data.json')).success(renderUI);
            },1000);
         }
         else {
            var mylocation = window.location.toString();
            var geturls = mylocation.split('?');
            if(!(geturls.length > 1)) {
               $scope.uiError = true;
            } else {
               var ids = geturls[1].split('&');
               var nodeuuid = ids[0].split('=')[1];
               var lpuuid = ids[1].split('=')[1];
               var lpid = ids[2].split('=')[1];
               if( typeof(nodeuuid) === 'undefined' || typeof(lpuuid) === 'undefined' ) {
                  $scope.uiError = true;
               } else {

                  problemService.getLearningPath({"learningPathUuid": lpid}).success(renderUI);

               }
            }
         }
         return serviceDefer.promise;
      }
      //#
      //: isUIReady
      function isUIReady() {
         return $scope.uiReady && $scope.character.canvasReady && !$scope.uiError;
      }
      //#
      //: isUIError
      function isUIError() {
         return $scope.uiError;
      }
      //#

      //#
      //: renderUI
      function renderUI(data) {
         if(data.error) {
            console.log(data.error.message);
            $scope.uiError = true;
            return;
         }
         if(data.result && data.result.skills) {
            $scope.ctx = {
               skills: []
            };
            //..For Skills..
            //$scope.ctx.skills = $sce.trustAsHtml(buildSkills(data.result.skills));
            //..For HintCount..
            $scope.ctx.hintCount = data.result.hintCount;
            $scope.ctx.velocityPoints = data.result.pointsEarnedForScene;
            //..For Number Of Points..
            $scope.pointsEarnedForLesson = data.result.pointsEarnedForLesson;
            $scope.ctx.pointsEarnedForScene = data.result.pointsEarnedForScene;
            //..For RandomAudio
            $scope.promptAudio = "";// $localPath.combineUrls(getRandomAudio(data.result.qualityScore));
            //...For TotalStudentPoints
            //..For Circle and Ellipse icon Management
            $scope.isCircle = true;
            if(data.result.totalStudentPoints.toString().length > 3){
               $scope.isCircle = false;
               $scope.totalStudentPoints = data.result.totalStudentPoints;
            }else{
               $scope.isCircle = true;
               $scope.totalStudentPoints = data.result.totalStudentPoints;
            }
         }
         serviceDefer.resolve();
      }
      //#

      //: playCharacterAnimation
      function playSoundAnimation(audio,animation){
         $scope.character.$$animating=false;
         $scope.i++;
         if($scope.adlist.length - 1 == $scope.i){
            $scope.adlist[$scope.i].audio.loop = true;
            $scope.adlist[$scope.i].audio.play();
            return;
         }
         if($scope.adlist[$scope.i].audio == ""){
            $timeout(function(){
               $scope.character.playAnimationSequence($scope.adlist[$scope.i].animation,false).then(function(){
                  $scope.character.$$animating=false;
                  $timeout(function(){
                     playSoundAnimation();
                  },1000)


               });
            },0)


         }else{
            $timeout(function(){
               $scope.adlist[$scope.i].audio.addEventListener("ended",function(){
                  $scope.character.$$animating=false;
                  $timeout(function(){
                     playSoundAnimation();
                  },20);
               });
               $scope.adlist[$scope.i].audio.play();
               $scope.character.playAnimationSequence($scope.adlist[$scope.i].animation,false);
            },0);
         }

      }
      function playCharacterAnimation() {
         if($scope.character && $scope.character.canvasReady) {
            audioPlayer.autoplay = false;
            $scope.adlist = [
                             {"audio":"",
                             "animation":[{"name":"l_danceclap","duration":1}]},
                             {"audio": new Audio($localPath.combineUrls("./assets/audio/sloth_afterPlacementTest1_b.mp3")),
            "animation":[{"name":"l_stand_talkingnogesticulate","duration":1}]},
                             {"audio":"",
            "animation":[{"name":"l_stand_waveawkward","duration":1}]},
                             {"audio":new Audio($localPath.combineUrls("./assets/audio/sloth_afterPlacementTest2.mp3")),
            "animation":[{"name":"l_stand_talkingnogesticulate","duration":1}]},
                             {"audio":new Audio($localPath.combineUrls("./assets/audio/sloth_afterPlacementTest3.mp3")),
            "animation":[ {"name":"l_talkingonearmhandonhip","duration":4}]},
                             {"audio":"",
            "animation":[{"name":"l_thumbsUp","duration":0.1}]},
                             {"audio":new Audio($localPath.combineUrls("./assets/audio/sloth_afterPlacementTest4.mp3")),
            "animation":[{"name":"l_talkingonearmhandonhip","duration":4}]},
                             {"audio":"",
            "animation":[{"name":"l_jump_big","duration":0.01}]},
                             {"audio":new Audio($localPath.combineUrls("./assets/audio/sloth_afterPlacementTest5.mp3")),
            "animation":[{"name":"l_talkingonearmhandonhip","duration":3}]},
                             {"audio":new Audio($localPath.combineUrls("./assets/audio/sloth_afterPlacementTest6.mp3")),
            "animation":[{"name":"l_talkingonearmhandonhip","duration":1}]},
                             {"audio":"",
            "animation":[{"name":"l_danceclap","iterations":-1}]},
                             {"audio":new Audio($localPath.combineUrls("./assets/audio/velocity-cloud-snow-p3.mp3")),
            "animation":[]}
            ];
            $scope.i = -1;

            playSoundAnimation();
         }
      }
   }]);
   //: config
   function config($sceDelegateProvider) {
      $sceDelegateProvider.resourceUrlWhitelist(["**"]);
      return;
      $sceDelegateProvider.resourceUrlWhitelist([
         "self",
         "*",
         /https?:\/\/[\w\.]+.voyagersopris.com\/.*/
]);
};
//#
});
