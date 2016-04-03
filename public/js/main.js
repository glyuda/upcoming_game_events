//initialize upcomingEventsApp
angular.module('upcomingEventsApp', [])
//initialize upcomingEventsCtrl
.controller('upcomingEventsCtrl', function($scope, $http) {
    //get only actual events
    function filterEvents(data, start_date) {
        var filteredEvents = data.filter(function(item) {
            return start_date <= moment(item.date_start).format('YYYY MM DD');
        });
        return filteredEvents;
    };
    //add new calculated fields for records
    function addInfo(data) {
        var processedEvents = data;
        var eventWeek;

        angular.forEach(processedEvents, function(item) {
            item.localTime = moment().format('hh:mm A');
            item.startIn = moment(item.date_start).fromNow();

            //highlight events of this week with eventWeek=true
            eventWeek = moment(item.date_start).week();
            item.thisWeek = (eventWeek = moment().week()) ? false : true;
        })

        return processedEvents;
    };

    $http.get('https://events.sportwrench.com/api/esw/events').
    success(function (data, status, headers, config) {
        $scope.upcomingEvents = addInfo(filterEvents(data, moment().format('YYYY MM DD')));
        $scope.sortType = 'date_start'; //parameter for sorting
        $scope.sortReverse = false; //from now to future
    }).
    error(function (data, status, headers, config) {
        // log error
    })
});