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
            console.log($scope.answer+" "+$scope.userAnswer);
            $scope.rightAnswer = $scope.answer==$scope.userAnswer ? "You are right!": "right answer:"+ $scope.answer;
            $scope.showAnswer = true;
        }
    })
    .controller("testController", function($scope, $http){
        var localData= [];
        $scope.i = 0;
        $scope.scores = [];
        var latest = 0;
        var userAnswers = [];
        $scope.submitted = false;
        $scope.answerIsRight = true;
        $http.get('data.json').success(function (data) {
            localData=data;
            $scope.length = localData.length;
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
            $scope.scores[$scope.i] = $scope.userAnswer==$scope.answer? 1:0;
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
            if($scope.i<19)
                $scope.i++;
            getData($scope.i);
            if($scope.submitted){
                $scope.answerIsRight = $scope.answer==$scope.userAnswer;
                $scope.wrongAnswer = "Your answer is wrong! The right answer should be "+$scope.answer;
            }

        };
        $scope.prev = function(){
            if($scope.i==0)
                return;
            $scope.i--;
            $scope.userAnswer=userAnswers[$scope.i];
            getData($scope.i);
            if($scope.submitted){
                $scope.answerIsRight = $scope.answer==$scope.userAnswer;
                $scope.wrongAnswer = "Your answer is wrong! The right answer should be "+$scope.answer;
            }
        };
        $scope.getScore = function(){
            $scope.next();
            $scope.userAnswer = userAnswers[0];
            if($scope.submitted){
                $scope.answerIsRight = localData[0].answer==userAnswers[0];
                $scope.wrongAnswer = "Your answer is wrong! The right answer should be "+localData[0].answer;
            }
            $scope.submitted = true;
            $scope.finalScore=0;
            angular.forEach($scope.scores,function(value){
                $scope.finalScore += value;
            });
            $scope.finalScore*=5;
            $scope.i = 0;
            getData($scope.i);
        }
    })
;