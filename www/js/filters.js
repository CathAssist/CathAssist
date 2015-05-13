angular.module('cathassist.filters', [])

.filter('to_trusted', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}])
.filter('to_time', function () {
    return function (input) {
        input = input || 0;

        var t = parseInt(input, 10);

        var addLeadingZero = function (n) {
            return (n < 10) ? '0' + n : n;
        };
        return addLeadingZero(Math.floor(t / 60)) + ':' + addLeadingZero(t % 60);
    };
});