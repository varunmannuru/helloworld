encapsulatedScript(function($localPath) {

  var css = angular.css(
    "vsl.core.ui.vitalsPage",
    $localPath.combineUrls("vitalsPage.css")
  );

  angular.module('vsl.core.ui.vitalsPage',["ngIdle","ngAnimate","vsl.core.ui.spine","vsl.core.ui.iconButton","vsl.core.ui.nextButton", "vsl.core.ui.audioPlayer", "vsl.velocity.scenes"])
    .config(config).run(function(Idle){
      Idle.watch();
    })
    .directive('pointsCountup',function($timeout) {
      return {
        restrict: 'EA',
        link: function(scope,element,attr) {
          var cnt = 0;
          var pts;
         // var _el = angular.element(element[0]);

          scope.$watch('velocityPoints',function(nv) {
            if (nv && scope.velocityPoints) {
              pts = scope.velocityPoints;
              time = Math.floor(((40/pts)*50));
              $timeout(function() {
                countUp();
              },100);
            }
          })

          function countUp() {
            var _cnt = cnt;
            _cnt = _cnt+1;
            cnt++;
            scope.$apply(function(){
            $timeout(function(){
            scope.velocityPoints1 = _cnt;
            },0)
             
            });
            $timeout(function(){
            scope.velocityPoints2 = _cnt;
            },300);
           
           // _el.html(_cnt++);

            if(_cnt >= pts ) {
             // _el.html('+'+pts);
             // scope.pointCountReady = true;
             $timeout(function() {
             scope.showSparkleBar = false;
             scope.$apply();
           },2500);

            }
            else {
              $timeout(function() {
                countUp();
              },time)
            }

            
          }
        }
      }
    })
    .directive('pointsBar',function() {
      return {
        replace: true,
        restrict: 'E',
        templateUrl: $localPath.combineUrls('pointsBar.html'),
        link: function link(scope,element,attr) {}
      }
    })
    .directive('vitalsPage',function() {
      return {
        replace: true,
        restrict: 'E',
        controller: 'vitalsPageCtrl',
        templateUrl: $localPath.combineUrls('vitalsPage.html'),
        css: css,
        link: function link(scope,element,attr) {
          scope.userName = attr.username ? attr.username : 'Velocity User';
        }
      }
    })
    .controller('vitalsPageCtrl',["$scope","$sce","$http","$timeout","$q", '$interval',"$location","vsl.core.ui.audioPlayer","vsl.velocity.scenes.service",function($scope, $sce,$http,$timeout,$q, $interval, $location, audioPlayer, sceneService) {
      //function($scope,$sce,$http,$timeout,$q, vsl.core.ui.audioPlayer) {

      
      sceneService.getLastScene().then(function(response){
        $scope.dotsArray = new Array(response.journeyLength - 1);
      //alert(Math.floor(100/$scope.dotsArray.length));
      $scope.cnt =100/($scope.dotsArray.length + 1);
       
         console.log(response);
      });

      /* -----vvvvv----- Inactivity */
      
      $scope.events = [];
      $scope.$on("IdleStart", function() {
         //log("\tIdleStart");
         // the user appears to have gone idle
         $scope.settings={
            hideHeader: true,
            action: "inactivityDetected",
            width: 360
         };
         var parser = new UAParser();
         var os = parser.getOS();
         if (os.name=="iOS" || os.name=="Android" || os.name=="Chromium OS") {
            $scope.settings.buttons = {
               accept:"Yes"
            };
            $scope.settings.default = "accept";
         }
         // $scope.modalInstance = $modal.open({
         //    templateUrl:$localPath.combineUrls("../../../ui/inactivityModal/inactivityModal.html"),
         //    backdrop:'static',
         //    scope:$scope
         // });
      });
      $scope.$on("IdleWarn", function(e, countdown) {
         //log("\tIdleWarn",countdown);
         $scope.secondsLeft = countdown;
         // follows after the IdleStart event, but includes a countdown until the user is considered timed out
         // the countdown arg is the number of seconds remaining until then.
         // you can change the title or display a warning dialog from here.
         // you can let them resume their session by calling Idle.watch()
      });
      $scope.$on("IdleTimeout", function() {
         //log("\tIdleTimeout");
         window.location = $location.protocol()+"://"+$location.host()+":"+$location.port()+"/logout";
         // the user has timed out (meaning idleDuration + timeout has passed without any activity)
         // this is where you'd log them
      });
      $scope.$on("IdleEnd", function() {
         //log("\tIdleEnd");
         $scope.modalInstance.dismiss('cancel');
         // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog
      });
      $scope.$on("Keepalive", function() {
         //log("\tKeepalive");
         // do something to keep the user's session alive
      });
      /* -----^^^^^----- Inactivity */

      var characterDefer = $q.defer();
      var serviceDefer = $q.defer();
      var praiseTextDefer = $q.defer();
      $scope.isStampSummaryPage = false;
      $scope.showSkills = true;

      $scope.gotoLesson1 = function(){
        window.location.href = '/lessons';
      };
      $scope.gotoLessons = function(){
        if($scope.isStampSummary){
          $timeout(function() {     
           var seq = [{"name":"s_portal_dropin","duration":2}];
            
            $scope.character.playAnimationSequence(seq,false).then(function(){
              $timeout(function() { 
               $scope.gotoLesson1();
             },1000);
          });
          },0);
        }else{
       $scope.gotoLesson1();
      }
      };
              
      $scope.data={};
      $scope.isUIReady = isUIReady;
      $scope.isUIError = isUIError;
      $scope.uiError = false;
      $scope.uiReady = false;
      $scope.getPraiseMessage = getPraiseMessage;
      $scope.characterAssets = { 
        name:"sloth",
        skeleton: "ActivitySkeleton" 
      };
   
      //... Fetch skills from api...
      $q.all([
        callAPI(),
        characterDefer.promise
      ]).then(function() {
        $scope.uiReady = true;
        $scope.showPointsBox = true;
        $scope.showSparkleBar = true;
        $scope.velocityPoints = getVelocityPoints();
        $scope.showNextBtn  = false;
        $scope.showNextBtn1  = false;
        
      });

      //... Watch for when the character is ready...
      $scope.$watch('character.canvasReady',function(nv) {
        if(nv){

          $timeout(function() {
            $scope.showPointsEarned = true;
            //alert($scope.promptAudio);
       
           var seq = getRandomOnloadAnimation();
            $timeout(function() {     
            console.log(seq);
            var audioPath = $localPath.combineUrls("assets/audio/VLY_SFX_052.mp3");
             $timeout(function(){audioPlayer.playSFX(audioPath)},0);

            $scope.character.playAnimationSequence(seq,false).then(function(){
            $timeout(function(){  
            $scope.showNextBtn  = true;
             $timeout(function(){
              $scope.showNextBtn1  = true;
               $timeout(function(){
              $scope.showNextBtn1  = false;
            },2800)
            },3000);
            
           
            $scope.showSparkleBar = true;
            if($scope.isStampSummary){
              $scope.currentAnimationList = $scope.stampAnimation;
              playCharacterAnimation();
              $scope.finalStampAudio = $localPath.combineUrls("assets/audio/sloth_vitals_stamp.mp3");
            $timeout(function(){audioPlayer.playSFX($scope.stampAudio)},0);
                
            }else{
              playCharacterAnimation();
            $timeout(function(){audioPlayer.playSFX($scope.promptAudio)},1800);
            }
            
          },0);

            });
         
          },0);
        
          //  animateHintsSequence();
          },1000);
           characterDefer.resolve();
        }
         
      });
      $scope.$watch('pointCountReady',function(nv) {
        if(nv);
          
      });
      

      //: callAPI
      function callAPI() {
        $http.get($localPath.combineUrls('assets/audio/audio-data.json')).success(function(data) {
          //.. Picking Audio List..
          $scope.audioList = data;
          praiseTextDefer.resolve();
        });

        if (window.location.href.parseUrl().name === "test.html") {
          $scope.serviceApi = $localPath.combineUrls('assets/json/sample-data.json');
          $timeout(function() {
            $http.get($scope.serviceApi).success(renderUI);
          },1000);
        }
        else {
          $scope.serviceApi = 'ws/ProblemService.json';
          var mylocation = window.location.toString();
          var geturls = mylocation.split('?');

          if(!(geturls.length > 1)) {
            $scope.uiError = true;
          } else {
            var ids = geturls[1].split('&');
            var nodeuuid = ids[0].split('=')[1];
            var lpuuid = ids[1].split('=')[1];

            if( typeof(nodeuuid) === 'undefined' || typeof(lpuuid) === 'undefined' ) {
              $scope.uiError = true;
            } else {
              var credentials = {
                "jsonrpc": "2.0",
                "id": "123",
                "method": "getProblemSummary",
                "params": [{
                  "learningPathNodeUuid": lpuuid,
                  "nodeUuid": nodeuuid
                }]
              };

              $http.post($scope.serviceApi,credentials).success(renderUI);
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

      //: getPraiseMessage
      function getPraiseMessage() {
        if($scope.praiseTextWord)
          return $scope.praiseTextWord.split('^')[0] + ', ' + $scope.userName+$scope.praiseTextWord.split('^')[1];
      }
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
          $scope.ctx.skills = $sce.trustAsHtml(buildSkills(data.result.skills));
         
          //..For HintCount..
          $scope.ctx.hintCount = data.result.hintCount;

          $scope.ctx.velocityPoints = data.result.pointsEarnedForScene;

          //..For Number Of Points..
          $scope.pointsEarnedForLesson = data.result.pointsEarnedForLesson;
          $scope.ctx.pointsEarnedForScene = data.result.pointsEarnedForScene;
          
          //..For RandomAudio
          $scope.promptAudio = $localPath.combineUrls(getRandomAudio(data.result.qualityScore));
          sceneService.getLastJourneyStamp().then(function(stamp){
          $scope.stampPath = stamp.src["@url"];
          getStampAudio();
          $scope.isStampSummary = true;

         console.log(stamp.src["@url"], stamp.width,stamp.height);
      });
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


      //: animateHintsSequence
      function animateHintsSequence() {

        var seq = [

          function(next) {
            $scope.showHintsText = true;
           $scope.showPointsEarnedText = true;
                 
            next();
          },
          1000,
          function(next) {
            $scope.showBursts = true;
            $scope.showBurstsGreen = true;

            next();
          },
          function(next) {
            return 2000;
          },
          function(next) {
            $scope.hideBursts = true;
            $scope.hideHintsText = true;
            $scope.hideBurstsGreen = true;
            $scope.hidePointsEarnedText = true;
            $scope.showPointsEarnedText = false;
            
            next();
          }
        ];

        $q.sequence(seq);
      }
      //#

      //: buildSkills
      function buildSkills(skills) {
        var skillsStr = '';
        for(var i=0; i < skills.length; i++) {
          if( skills.length === 1) {
            skillsStr += skills[i].value;
          }
          else if( i < (skills.length-1)) {
            skillsStr += skills[i].value + ',&nbsp;';
          } else {
            skillsStr += 'and&nbsp;' + skills[i].value; 
          }
        }
        return skillsStr;
      }
      //#
      //:  getRandomOnloadAnimation
      function  getRandomOnloadAnimation(){
        var list = [{"name":"s_correct_backlip_confetti","duration":2},
        {"name":"s_correct_glowrise_confetti","duration":2},
        {"name":"s_confetti","duration":2}
        ];
        var randomAnimationList = [ {"name":"l_standingbreathingwithclosedsmile","iterations":-1}];
       randomAnimationList.unshift(list[Math.floor(Math.random()*list.length)]);

       return randomAnimationList;
      }

      //: getStampAnimation
      function getStampAudio(){
         
        var  stampAudioList = $scope.audioList.stampAudio;
        var selectedStampAudio = stampAudioList[Math.floor(Math.random()*stampAudioList.length)];
        $scope.stampAnimation = [{"name":"l_talkingbotharms","duration": selectedStampAudio.duration}];
        $scope.stampAnimation.push({"name":"l_standingbreathingwithclosedsmile","iterations":-1});
        var stapAudioPath = "assets/audio/stampAudio/" + selectedStampAudio.file + ".mp3";
        $scope.stampAudio = $localPath.combineUrls(stapAudioPath);
      }

      //: getRandomAudio
      function getRandomAudio(qualityScore) {
        $scope.currentAnimationList = [];
       
        var promptAudioList = [];
        var baseUrl="assets/audio";
         if(qualityScore >= 75){
            promptAudioList = $scope.audioList.positiveFeedBack;
            $scope.currentAnimationList =  [
                {"name":"l_standingbreathingwithclosedsmile","duration":1},
                {"name":"l_talkingonearmhandonhip","duration":$scope.selectedAudioDuration}
              ];

             var list1 = [{"name":"l_dancemonkey","duration":3},{"name":"l_danceclap","duration":3}];
             $scope.currentAnimationList.push(list1[Math.floor(Math.random()*list1.length)]);
             baseUrl=baseUrl+"/positiveFeedBack/";
           }else if (qualityScore >= 50) {
            promptAudioList = $scope.audioList.mediumEffortFeedBack;
            $scope.currentAnimationList = [
                {"name":"l_stand_waveawkward","duration":2},
                {"name":"l_talkingonearmhandonhip","duration":$scope.selectedAudioDuration}
               ];
               var list2 = [{"name":"l_dance_armworm","duration":3},{"name":"l_danceclap","duration":3}];
               $scope.currentAnimationList.push(list2[Math.floor(Math.random()*list2.length)]);
               baseUrl=baseUrl+"/mediumEffortFeedBack/";
            }else{
            promptAudioList = $scope.audioList.moreEffortFeedBack;
            $scope.currentAnimationList  = [
                {"name":"l_standing","duration":2},
                {"name":"l_talkingonearmhandonhip","duration":$scope.selectedAudioDuration}
              ];
            baseUrl=baseUrl+"/moreEffortFeedBack/";
           };
           $scope.currentAnimationList.push({"name":"l_standingbreathingwithclosedsmile","iterations":-1});
           var randomPos = Math.floor(Math.random()*promptAudioList.length);
           $scope.selectedAudioDuration =  promptAudioList[randomPos].duration;
           $scope.currentAnimationList[1].duration = $scope.selectedAudioDuration;
        return baseUrl + promptAudioList[randomPos].file + ".mp3";
      }
      //#

      //: getVelocityPoints
      function getVelocityPoints() {
        $scope.ctx.velocityPoints = ($scope.ctx.velocityPoints * $scope.dotsArray.length)/100;
       // var tempPoints = 90 * $scope.dotsArray.length;
        return $scope.ctx.velocityPoints >= 90 ? 100 : $scope.ctx.velocityPoints;
      }
      //#
    
      //: playCharacterAnimation
      function playCharacterAnimation() {

        if($scope.character && $scope.character.canvasReady) {

          $timeout(function() {     
           var seq = $scope.currentAnimationList;
            console.log(seq);
            $scope.character.playAnimationSequence(seq,false).then(function(){
              if ($scope.isStampSummary) {
                $timeout(function(){
                 /* $scope.showSkills = false;*/
                  seq[0].duration = 2;
                  displayStamp(seq);
        
            },1000);
               
          }
             });
         
          },0);
 
        }
        
      }
      //#
      //: toggleSidePanelVideo
    $scope.toggleSidePanelVideo = function(toggle){
      //audioPlayer.stopAll();

     $scope.videoPath = $localPath.combineUrls('assets/images/stamp_underwater_journey01.svg');
      $scope.showSidePanelVideo = toggle;
var m = 0;
  var intervel = $interval(function(){
    
    var path11 = 'assets/images/stamp_underwater_journey'+m+'.svg';
    $scope.videoPath = $localPath.combineUrls(path11);
    if(m==3){
      $interval.cancel(interval);
    ++m;
    }
  },3000,0);

      
    }
    //#

  //: displayStamp
      function displayStamp(seq) {
        //$scope.stampPath = $localPath.combineUrls('assets/images/stamp_fishing.svg');
        // $scope.isStampSummaryPage = true;
        $scope.isStampSummaryPage = true;
         if($scope.isStampSummary){
           $timeout(function() {   
           $timeout(function(){audioPlayer.playSFX($scope.finalStampAudio)},0);
           $scope.character.playAnimationSequence(seq,false).then(function(){
            
          });
          },1000);
           
        }
         /*sceneService.getLastJourneyStamp().then(function(stamp){
         $scope.stampPath = stamp.src["@url"];
         $scope.isStampSummaryPage = true;
         console.log(stamp.src["@url"], stamp.width,stamp.height);
      });*/

      }
      //#
    }]);

  //: config
  function config($sceDelegateProvider,IdleProvider,KeepaliveProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(["**"]);
    IdleProvider.idle(900);          // how long before the "inactivityModal" appears; in seconds [900 = 15 minutes]
    IdleProvider.timeout(119);       // how long before the "logout" occurs; in seconds [119 = 1 minute 59 seconds]
    KeepaliveProvider.interval(1);   // interval to poll to "keep session" alive; in seconds [1 second]
    return;
    $sceDelegateProvider.resourceUrlWhitelist([
       "self",
       "*",
       /https?:\/\/[\w\.]+.voyagersopris.com\/.*/
    ]);
  };
  //#

});

