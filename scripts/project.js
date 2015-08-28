/**
 * Created by Chao on 2015/8/24.
 */

angular.module('myApp',['ui.bootstrap','ngAnimate'])
    .controller('index',function($scope){
    })
    .controller("practiceController", function($scope, $http) {
        var localData= [];
        $scope.showAnswer = false;
        $scope.showExp = false;
        $scope.hideAccordion=true;
        $scope.htmlTitle = "Java";
        $http.get('Java.json').success(function (data) {
            localData=data;
            var i = Math.floor((Math.random() * data.length));
            getData(i);
        });
        var getData = function(i) {
            if(localData.length==0){
                alert("no questions left");
                return;
            }
            $scope.question = localData[i].question;
            $scope.choiceA = localData[i].choice[0];
            $scope.choiceB = localData[i].choice[1];
            $scope.choiceC = localData[i].choice[2];
            $scope.choiceD = localData[i].choice[3];
            $scope.answer = localData[i].answer;
            $scope.explanation = localData[i].explanation;
            localData.splice(i,1);
        };
        $scope.changeJson = function(str){
            $scope.htmlTitle = str;
            $http.get(str.toLowerCase()+'.json').success(function (data) {
                localData=data;
                var i = Math.floor((Math.random() * data.length));
                getData(i);
            });
        };
        $scope.next = function(){
            $scope.userAnswer="";
            $scope.showAnswer = false;
            $scope.showExp = false;
            getData(Math.floor((Math.random() * localData.length)));
        };
        $scope.show = function(){
            $scope.rightAnswer = $scope.answer==$scope.userAnswer ? "You are right!": "right answer:"+ $scope.answer;
            $scope.showAnswer = true;
        }
    })
    .controller("testController", function($scope, $http, $modal){
        var localData= [];
        $scope.i = 0;
        $scope.scores = [];
        var latest = 0;
        var userAnswers = [];
        $scope.hideAccordion=true;
        $scope.htmlTitle = "Java";
        $scope.submitted = false;
        $scope.answerIsRight = true;
        $scope.finalScore=0;
        $scope.stacked = [];

        var display = document.querySelector('#time'),
            duration = 180;
        var timer = new CountDownTimer(duration);

        timer.onTick(format).onTick(restart).onTick(urgent).start();

        function urgent(){
            if((timer.startDate+duration*1000-Date.now())/1000 < 30){
                var ele = document.getElementById('time');
                if(ele.style.color=="red")
                    ele.style.color="black";
                else
                    ele.style.color="red";
            }
        }
        function restart() {
            if (this.expired()) {

                setTimeout(function() { $scope.getScore(); }, 1000);
            }
        }

        function format(minutes, seconds) {
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            display.textContent = minutes + ':' + seconds;
        }

        $http.get('java.json').success(function (data) {
            localData=data;
            $scope.length = localData.length;
            getData($scope.i);
        });
        $scope.changeJson = function(str){
            $scope.htmlTitle = str;
            $http.get(str.toLowerCase()+'.json').success(function (data) {
                localData=data;
                $scope.i = 0;
                $scope.scores = [];
                latest = 0;
                userAnswers = [];
                $scope.submitted = false;
                $scope.answerIsRight = true;
                $scope.finalScore=0;
                $scope.stacked = [];
                getData($scope.i);
            });
        };
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
                if($scope.userAnswer==null||$scope.userAnswer==undefined||$scope.userAnswer==""){
                    $scope.stacked.push({
                        value: 5,
                        type: 'danger'
                    });
                    userAnswers.push("");
                }
                else{
                    $scope.stacked.push({
                        value: 5,
                        type: 'success'
                    });
                    userAnswers.push($scope.userAnswer);
                }

                $scope.userAnswer="";
            }else{
                if($scope.userAnswer!=""){
                    $scope.stacked[$scope.i]={
                        value: 5,
                        type: 'success'
                    }
                }
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
            $scope.bigCurrentPage = $scope.i+1;
        };
        $scope.prev = function(){
            userAnswers[$scope.i]=$scope.userAnswer;
            $scope.i--;
            $scope.userAnswer=userAnswers[$scope.i];
            getData($scope.i);
            if($scope.submitted){
                $scope.answerIsRight = $scope.answer==$scope.userAnswer;
                $scope.wrongAnswer = "Your answer is wrong! The right answer should be "+$scope.answer;
            }
            $scope.bigCurrentPage = $scope.i+1;
        };
        $scope.getScore = function(){
            if($scope.submitted)
                return;
            $scope.next();
            $scope.userAnswer = userAnswers[0];
            $scope.answerIsRight = localData[0].answer==userAnswers[0];
            $scope.wrongAnswer = "Your answer is wrong! The right answer should be "+localData[0].answer;
            $scope.submitted = true;
            $scope.finalScore=0;
            angular.forEach($scope.scores,function(value){
                $scope.finalScore += value;
            });
            $scope.finalScore*=5;
            $scope.open();
            $scope.i = 0;
            getData($scope.i);
        };
        $scope.open = function () {
            $modal.open({
                animation: true,
                templateUrl: 'score.html',
                controller: 'ModalInstanceCtrl',
                resolve: {
                    items: function () {
                        return $scope.finalScore;
                    }
                }
            });
        };
        $scope.changePage = function(event){

            var wholeWidth = document.getElementById("progressBarDiv").clientWidth;
            console.log(wholeWidth+" "+latest);
            var pageTo = Math.floor(event.layerX/(wholeWidth/20));

            if(pageTo<=latest+1){
                $scope.i = pageTo;
            }
            $scope.userAnswer = userAnswers[$scope.i];
            getData($scope.i);
        }
    })
.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

    $scope.finalScore = items;
    $scope.ok = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.cancel = function () {
        document.location.href="index.html";
    };
});