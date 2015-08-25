/**
 * Created by Chao on 2015/8/24.
 */

angular.module('myApp',['ui.bootstrap'])
    .controller('index',function($scope){
    })
    .controller("practiceController", function($scope, $http) {
        var localData= [];
        $http.get('data.json').success(function (data) {
            localData=data;
            var i = Math.floor((Math.random() * 20));
            getData(i);
        });
        var getData = function(i) {
            $scope.question = localData[i].question;
            $scope.choiceA = localData[i].choice[0];
            $scope.choiceB = localData[i].choice[1];
            $scope.choiceC = localData[i].choice[2];
            $scope.choiceD = localData[i].choice[3];
            $scope.answer = localData[i].answer;
            $scope.explanation = localData[i].explanation;
        };
        $scope.next = function(){
            getData(Math.floor((Math.random() * 20)));
        };
    })
    .controller("testController", function($scope, $http){
        var localData= [];
        $scope.i = 0;
        $scope.score = 0;
        $scope.answers = [];
        $http.get('data.json').success(function (data) {
            localData=data;
            getData($scope.i);
        });
        var getData = function(i) {
            $scope.question = localData[i].question;
            $scope.choiceA = localData[i].choice[0];
            $scope.choiceB = localData[i].choice[1];
            $scope.choiceC = localData[i].choice[2];
            $scope.choiceD = localData[i].choice[3];
            $scope.answer = localData[i].answer;
            $scope.explanation = localData[i].explanation;
        };
        $scope.next = function(){
            $scope.i++;
            getData($scope.i);
        };
    })
;