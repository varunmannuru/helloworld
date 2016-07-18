encapsulatedScript(function($localPath) {
   function log() {
      console.log.apply(console,arguments);
   }
   function debug() {
      //console.log.apply(console,arguments);
   }

   log("Script: vsl.core.ui.audioPlayer   ",$localPath);

   angular.module("vsl.core.ui.audioPlayer",[
      "vsl.core"
   ]).run(function() {
      log("Module: vsl.core.ui.audioPlayer");
   });

   angular.module("vsl.core.ui.audioPlayer").service( "vsl.core.ui.audioPlayer",audioPlayerService);

   audioPlayerService.$inject=["$q", "$timeout", "$rootScope", "vsl.core.uriService", "vsl.core.logService"];

   function audioPlayerService($q, $timeout, $rootScope, uriService, logService) {
      log("Service: vsl.core.ui.audioPlayer");

      var player=document.createElement("audio");
      var sfxAudio = new Audio();
      player.autobuffer=true;
      var playList=null;
      var paused=false;
      var loadedSrc=null;
      var current=null;
      var defer;
      var playFailedDefer=null;
      var STATE={PLAYING:"PLAYING",PAUSED:"PAUSED",STARTING:"STARTING",UPDATE:"UPDATE",FINISHING:"FINISHING",COMPLETED:"COMPLETED",ABORTED:"ABORTED"};
      player.addEventListener("ended",playNext);
      player.addEventListener("timeupdate",timeUpdate);
      return {
         queue : queue,
         play : play,
         playSFX: playSFX,
         pause: pause,
         resume: resume,
         abort : abort,
         stopAll:abort,
         STATE: STATE
      };

      function notify(state,d,reason) {
         if (!d)
            d=defer;
         if (d)
            d.notify({state:state,audio:current,reason:reason,promise:d});
      }

      function pause() {
         if (defer && !paused) {
            notify(STATE.PAUSED);
            paused=true;
            console.log(current);
            if (current && (typeof(current)==="string" || typeof(current) === 'object'))
               player.pause();
         }
      }

      function resume() {
         if (playList && paused) {
            paused=false;
            notify(STATE.PLAYING);
            if (typeof(current)==="string" || typeof(current) === 'object')
               player.play();
            else
               playNext();
         }
      }

      function abort(reason) {
         player.pause();
         //player.currentTime=0;
         var d=defer;
         defer=null;
         playList=null;
         paused=false;
         current=null;
         if (d) {
            notify(STATE.ABORTED,d,reason);
            d.reject(reason||STATE.ABORTED);
         }
      }

      function queue() {
         play.apply(this,arguments);
      }

      function verifyPlayList(playList) {
         var bad=[];
         var src;
         for (var i=0;i<playList.length;i++)
            if (typeof(src=getSrc(playList[i]))==="string" &&
                (src.indexOf("CORE_URL")>=0 ||
                 src.indexOf("CONTENT_DNS")>=0)) {
               bad.push(playList[i]);
               playList[i]=0;
            }
         if (bad.length>0) {
            try {
               var data={
                  urls:bad,
                  stack:(""+(new Error()).stack).replace(/\r\n/g,"\n").split("\n")
               };
               console.warn("TOKENS_IN_AUDIO_URLS",data);
               logService.transient("TOKENS_IN_AUDIO_URLS",data);
            }
            catch(e) {
               console.warn("TOKENS_IN_AUDIO_URLS",e);
            }
         }
      }
      function play() {
         //log("SRVC: FUNC --> play() -- ENTER");
         abort();
         playList=Array.fromCollection(arguments).flatten();
         verifyPlayList(playList);
         var d=defer=$q.defer();
         while (playList.length>0 && typeof(playList[0])==="function") {
            d.promise.finally(null,playList.shift());
         }
         notify(STATE.PLAYING,d);
         playNext();
         //log("SRVC: FUNC --> play() -- LEAVE");
         return d.promise;
      }

      function playSFX(sfx) {
         verifyPlayList(Array.fromCollection(arguments).flatten());
         if(sfx && sfx.length>0) {
            sfxAudio.src = getSrc(sfx);
            sfxAudio.play();
         }
      }

      function getSrc(item) {
         if (typeof(item)==="number" || typeof(item)==="string")
            return item;
         if (typeof(item.src)==="string")
            return item.src;
         if (typeof(item.src)==="object")
            return uriService.resolve(item.src);
         return uriService.resolve(item);
      }

      function getLoop(item) {
         if (typeof(item)==="object" && typeof(item.loop)==="boolean")
            return item.loop;
         return false;
      }

      function loadNextSrc() {
         var src;
         for (var i=0;i<playList.length;i++) {
            if (typeof(src=getSrc(playList[i]))==="string")
            {
               player.loop=getLoop(playList[i]);
               if (loadedSrc!==src) {
                  player.src=loadedSrc=src;
                  player.load();
               }
               return;
            }
         }
      }

      function timeUpdate(event) {
         notify(STATE.UPDATE,null,{currentTime:event.target.currentTime,duration:event.target.duration});
      }

      function playNext() {
         if (!playList || paused)
            return;
         if (current!=null)
            notify(STATE.FINISHING);
         if (playList.length==0) {
            var d=defer;
            playList=null;
            paused=false;
            current=null;
            notify(STATE.COMPLETED,d);
            d.resolve(STATE.COMPLETED);
            return;
         }
         //log("SRVC: FUNC --> playNext() -- ENTER");
         loadNextSrc();
         current=playList.shift();
         notify(STATE.STARTING);
         //log("SRVC: FUNC --> playNext()","src:"+current.src);
         if (typeof(current)==="number") {
            $timeout(playNext,current);
         } else {
            if (!paused) {
               playAudio();
            }
         }
         //log("SRVC: FUNC --> playNext() -- LEAVE");
      }

      function playAudio(){
         //log("SRVC: FUNC --> playAudio() -- ENTER");
         if (playFailedDefer) {
            var d=playFailedDefer;
            playFailedDefer=null;
            d.reject();
         }
         var played = player.play();
         var paused = player.paused;
         //log("\tplayed",played);
         //log("\tpaused",paused);
         if (played) {
            //log("\tsuccess");
         } else if (!played && paused) {
            //log("\tfailure");
            //log("\trootScope:",$rootScope);
            playFailedDefer = $q.defer();
            $rootScope.$broadcast("vsl.core.ui.audioPlayer:failedPlay",{
               resolve:playFailedDefer.resolve,
               reject:playFailedDefer.reject,
               then:function(){
                  return playFailedDefer.promise.then.apply(playFailedDefer.promise,arguments);
               }
            });
            playFailedDefer.promise.then(function(){
               playAudio();
            },function(reason){
               abort(reason);
            });
         }
         //log("SRVC: FUNC --> playAudio() -- LEAVE");
      }

   }

   angular.module("vsl.core.ui.audioPlayer").directive("audioPlayer",audioPlayerDirective);

   audioPlayerDirective.$inject=["$q", "vsl.core.ui.audioPlayer"];

   function audioPlayerDirective($q, audioPlayer) {
      log("Directive: vsl.core.ui.audioPlayer");

      return {
         restrict:"A",
         scope:{
            audio:"=audioPlayer",
            autoplay:"=",
            interface:"=scope",
            cycle:"=",
            playOn:"="
        },
        link:link
      };

      function link(scope, element, attrs) {
         log("Instance: vsl.core.ui.audioPlayer");

         var state="";
         var audioIndex=0;
         element.bind("click",toggle);
         var pauseClass=scope.$parent.$eval("$css.expand('-pause')");

         scope.$watch("interface",function(newVal,oldVal) {
            if (!newVal) {
               if (attrs.scope)
                  scope.interface = scope.interface || {};
               return;
            }
            newVal.toggle=toggle;
            newVal.play=play;
            newVal.stop=stop;
            newVal.stopAll=stopAll;
            newVal.pause=pause;
            newVal.resume=resume;
            newVal.state=state;
            newVal.STATE=audioPlayer.STATE;
            if (newVal.ready)
               newVal.ready();
            if (newVal.autoplay)
               play();
         });

         scope.$watch("playOn",function(newVal,oldVal) {
            if (newVal!==oldVal && newVal)
               play().then(typeof(newVal)==="function"?newVal:typeof(newVal.resolve)==="function"?newVal.resolve:null,typeof(newVal.reject)==="function"?newVal.reject:null);
         });

         if (scope.$eval("audio && (autoplay || playOn)")) {
            play();
         }

         function toggle() {
            pause() || resume() || play();
         }

         function pause() {
            if (state!=audioPlayer.STATE.PLAYING)
               return false;
            audioPlayer.pause();
            return true;

         }

         function resume() {
            if (state!==audioPlayer.STATE.PAUSED)
               return false;
            audioPlayer.resume();
            return true;
         }

         function stop() {
            if (state==audioPlayer.STATE.PLAYING || state==audioPlayer.STATE.PAUSED)
               audioPlayer.abort();
         }

         function stopAll() {
            audioPlayer.abort();
         }

         function play(callback) {
            var src=scope.$eval("audio||interface.src");
            if (typeof(src)==="function")
               src=src();
            if (!src) {
               var d = $q.defer();
               d.reject();
               return d.promise;
            }
            return audioPlayer.play(playUpdate,src).then(callback);
         }

         function playUpdate(data) {
            if (data.state === audioPlayer.STATE.ABORTED) {
               updateProgress(0);
            }
            if (data.state!==audioPlayer.STATE.STARTING && data.state!==audioPlayer.STATE.FINISHING)
               if (data.state===audioPlayer.STATE.UPDATE) {
                  updateProgress(data.reason.currentTime/data.reason.duration);
               } else {
                  state=data.state;
                  if (pauseClass)
                     element[state===audioPlayer.STATE.PLAYING ? "addClass" : "removeClass"](pauseClass);
                  if (state===audioPlayer.STATE.COMPLETED)
                     updateProgress(-1);
                  if (scope.interface) {
                     scope.interface.state=state;
                     if (state===audioPlayer.STATE.COMPLETED) {
                        scope.interface.completed=true;
                        if (typeof(scope.playOn)==="boolean")
                           scope.playOn=false;
                        else if (typeof(scope.playOn)==="function")
                           scope.playOn(state);

                        if (angular.isArray(scope.cycle)) {
                           if (scope.cycle[audioIndex+1]) {
                              scope.interface.src = scope.cycle[++audioIndex].src;
                              scope.interface.title = scope.cycle[audioIndex].title;
                           } else {
                              scope.interface.src = null;
                           }
                        }
                     }
                  }
               }
            if (scope.interface && scope.interface.update)
               scope.interface.update(data);
         }

         function updateProgress(progress) {
            attrs.$set("progressBar",progress);
         }
      }
   }
});
