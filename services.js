'use strict';

angular.module("cv.server", [
  'cv.server.account',
  'cv.server.devices',
  'cv.server.logs',
  'cv.server.admin',
  'cv.server.ordering',
  'cv.server.services',
  'cv.server.users'
])
.factory('server', [
    'serverAccount',
    'serverDashboard',
    'serverDevices',
    'serverLogs',
    'serverAdmin',
    'serverOrdering',
    'serverServices',
    'serverUsers',
    function (
      serverAccount,
      serverDevices,
      serverLogs,
      serverAdmin,
      serverOrdering,
      serverServices,
      serverUsers
    ) {
      return {
        account:   serverAccount,
        devices:   serverDevices,
        logs:      serverLogs,
        admin:     serverAdmin,
        ordering:  serverOrdering,
        services:  serverServices,
        users:     serverUsers
      }
    }
]);
