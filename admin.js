'use strict';

/*
 Request/Response format: http://cto-github.cisco.com/CTAO/cloudUI/blob/master/portal/mods/webapp/web/docs/api.account.md
 */
angular.module('cv.server.account', ['cv.server.core'])
  .factory('serverAccount', ['$rootScope', 'serverCore', function ($rootScope, serverCore) {
      return {

          getQueueStatus: function() {
            return serverCore.post("qStatus");
          },

          getServerInfo: function() {
            return serverCore.get("serverInfo");
          },

          getAppSettings: function() {
            return serverCore.get("customization/settings.json");
          },

          getContactInfo: function() {
            return serverCore.get("customization/contact-info.json");
          },

          info: function () {

            function getAccountInfo (){
              //console.trace('serverAccount getAccountInfo providerId:', serverCore.getServerData('providerId'));

              return serverCore.postNoError("getAccountInfo", undefined, undefined, true)
                .then(function(info){
                  //console.log('getAccountInfo info:', info);
                  if(!info.serviceId && info.service)
                  {
                    info.serviceId = info.service;
                  }
                  return info;
                });
            }

            $rootScope.needsCookies = true;
            return serverCore.getNoError("session")
              .then(function(info) {
                try {
                  //console.log('serverAccount.info session:', info);
                  if(_.isString(info)) {
                    info = JSON.parse(info);
                  }

                  $rootScope.needsCookies = false;
                  //console.log('serverAccount.info needsCookies:', $rootScope.needsCookies);
                  //console.log("serverAccount.info Don't use cookies");

                  return info;
                } catch (err) {
                  //console.log('serverAccount.info Fallback to cookies');
                  return getAccountInfo();
                }
              })
              .catch(function(err) {
                //console.log('serverAccount.info Fallback to cookies');
                return getAccountInfo();
              })
          },

          setLanguage: function (languageKey) {
              var p = serverCore.post("setLang", {
                  lang: languageKey
              });

              if(!$rootScope.needsCookies) {
                // HACK: server setLang doesn't save the lang in the session, need to manually set the simulation
                p = p.then(function(){
                  return serverCore.postSession('setSessionInfo', {"lang": languageKey});
                });
              }

              return p;
          },

          getVersion: function () {
              var p = serverCore.get("portalVersion");

              // fallback to v1.0
              var version1 = { api: { major: 1, minor: 0} };
              var version2 = { api: { major: 2, minor: 0} };

              p = p.then(function(v){
                  // HACK: backend refuses to add more then just some text in there own format
                  //console.log('getVersion: v2.0');
                  $rootScope.apiVersion = version2.api.major;

                  return version2;
              })
              .catch(function(err){
                //console.log('getVersion: v1.0');
                // fallback to v1.0
                $rootScope.apiVersion = version1.api.major;

                return version1;
              });

              return p;
          }
      }
  }
  ])
;
