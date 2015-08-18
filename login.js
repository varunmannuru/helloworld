'use strict';
angular.module('cv.server.admin', ['cv.server.core'])
  .factory('serverAdmin', ['serverCore', function (serverCore) {
      return {
          /*
           {
           "id": "adminLogin",
           "payload": {
           "username": "Bender21@gmail.com",
           "password": "K1llAll_humans"
           }
           }
           */
          login:           function (username, password) {
              var req = {
                  "username": username,
                  "password": password
              };
              return serverCore.postLogin("adminLogin", req);
          },

          /*
           {
           "id": "adminPasswordReset",
           "payload": {
           "username": "Bender21@gmail.com"
           }
           }
           */
          resetPassword:   function (username) {
              var req = {
                  "username": username
              };
              return serverCore.postUnprotected("adminPasswordReset", req);
          },

          /*
           {
           "id": "adminPasswordUpdate",
           "payload": {
           "resetId":    "3410a0721f8a8c000L",
           "newPassword": "qwerty"
           }
           }
           */
          adminPasswordUpdate:  function (resetId, password) {
            //console.log("Updating admin password");
              var req = {
                  "newPassword": password,
                  "resetId":     resetId
              };
              return serverCore.postUnprotected("adminPasswordUpdate", req, false);
          },

          /*
           {
           "id": "userPasswordUpdate",
           "payload": {
           "resetId":    "3410a0721f8a8c000L",
           "newPassword": "qwerty"
           }
           }
           */
          userPasswordUpdate:  function (resetId, password) {
             //console.log("Updating user password");
              var req = {
                  "newPassword": password,
                  "resetId":     resetId
              };
              return serverCore.postUnprotected("userPasswordUpdate", req, false);
          },

          getTenants: function () {
              return serverCore.post("getTenants", undefined, undefined, true).then(function (tenantList) {

                  var returnTenantList = [];
                  // Sever side adds this extra parent(remove it)
                  tenantList = tenantList.response;
                  if(!_.isArray(tenantList)) {
                    tenantList = [];
                  }

                  for (var i = 0; i < tenantList.length; i++) {
                      // TODO: in the future, if the backend provide tenant name, we may need to change this
                      var tenantObj = {"id": tenantList[i].tenantId, "name": tenantList[i].tenantId};
                      returnTenantList.push(tenantObj);
                  }
                  return returnTenantList;
              });
          },

/*          getServiceIdsForTenant: function () {
              // Backend decides to reuse this function even we just want to get the service list only
              // Therefore, we still call getAccountInfo API
              return serverCore.post("getAccountInfo", undefined, undefined, true)
                .then(function (info) {
                    //console.log('getServiceIdsForTenant getAccountInfo info:', info);
                    if(!info.serviceId && info.service)
                    {
                      info.serviceId = info.service;
                    }
                    return info;
                })
          },*/

          createTenant: function (tenantId) {
              return serverCore.postNoError('createTenant', {"tenantId": tenantId});
          },

          selectTenant: function(tenantId) {
              return serverCore.postSession('setSessionInfo', {"tenantId": tenantId});
          }
      };
  }]);
