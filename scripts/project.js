/**
 * Created by Chao on 2015/8/24.
 */

angular.module('myApp',['ui.bootstrap'])
    .controller('index',function($scope){
    })
    .controller("practiceController", function($scope, $http) {
        var localData= [];
        $scope.showAnswer = false;
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
            $scope.userAnswer="";
            $scope.showAnswer = false;
            getData(Math.floor((Math.random() * 20)));
        };
        $scope.show = function(){
            $scope.showAnswer = true;
        }
    })
    .controller("testController", function($scope, $http){
        var localData= [];
        $scope.i = 0;
        $scope.score = 0;
        var latest = 0;
        var userAnswers = [];
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
            if(latest<$scope.i || latest==0){
                latest=$scope.i;
                if($scope.userAnswer==null||$scope.userAnswer==undefined)
                    userAnswers.push("");
                else
                    userAnswers.push($scope.userAnswer);
                $scope.userAnswer="";
            }else{
                userAnswers[$scope.i]=$scope.userAnswer;
                $scope.userAnswer=userAnswers[$scope.i+1];
            }
            $scope.i++;
            getData($scope.i);
            console.log(userAnswers);
        };
        $scope.prev = function(){
            if($scope.i==0)
                return;
            $scope.i--;
            $scope.userAnswer=userAnswers[$scope.i];
            getData($scope.i);
        };
    })
;