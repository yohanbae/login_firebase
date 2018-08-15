var myApp = angular.module('myApp', ['ui.router','ui.router.state.events', 'firebase']);

myApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('login',{
			url:'/',
			templateUrl:'login.html',
			controller: 'loginCtrl'
		})
		.state('registration',{
			url:'/register',
			templateUrl:'register.html',
			controller: 'regCtrl'
		})		
		.state('main',{
			url:'/main',
			templateUrl:'main.html',
			controller: 'mainCtrl'			
		});
		$urlRouterProvider.otherwise('/');
}]);

myApp.controller('loginCtrl', ['$scope', '$location', 'myService', '$firebaseAuth','$firebaseArray', function($scope, $location, myService,$firebaseAuth, $firebaseArray){
	//SETUP//
	// DB EMP Data

/* MOCK USER DATA WITHOUT FIREBASE
	$scope.userInfo = [
		{ 'email': 'gentlebae@gmail.com', 'password':'123'},
		{ 'email': 'hannah@gmail.com', 'password':'123'},
		{ 'email': 'kass@gmail.com', 'password':'123'}
	];
*/
	$scope.username = myService.getUser();
	if($scope.username){
		$location.path('/main');
	}


/*/////////// VERY IMPORTANT //// FIREBASE QUERY
	var ref = firebase.database().ref();
	var studRef = ref.child("students");
	$firebaseArray(studRef);
	$scope.thename = 'babo';
	studRef.orderByChild('name').equalTo($scope.thename).on("child_added", function(snapshot){
		console.log(snapshot.val().email);
		$scope.thename = snapshot.val().email;
	});
//////////// VERY IMPORTANT //// FIREBASE QUERY DONE*/


//////////////////

	$scope.handleLogin = function(){
		var username = $scope.user.email;
		var password = $scope.user.password;
		var auth = $firebaseAuth();

		auth.$signInWithEmailAndPassword(username, password)
		.then(function(user){
			console.log('success');
			myService.setUser(username);
			$location.path('/main');
		})
		.catch(function(error){
			console.log(error);			
		});

/* OLD WAY of LOGIN without FIREBASE
		if(username && password){
			console.log('login processing');
			var obj = $scope.userInfo.find(function (obj) { return obj.email === username; });
			if(obj){
				if(obj.password == password){
					console.log('login success!');
					myService.setUser(username);
					$location.path('/main');
				}else{
					console.log('wrong password');
				}
			}else{
				console.log('no such username');
			}
		}else{
			alert('validation problem');
		}*/

	};

}]);

myApp.controller('mainCtrl', ['$scope','$location', 'myService', '$firebaseArray', function($scope, $location, myService, $firebaseArray){
	//SETUP//
	// DB EMP Data
	$scope.username = myService.getUser();
	if($scope.username){
		//do nothing
	}else{
		$location.path('/login');
	}

	//GET USER INFO
	//////////// VERY IMPORTANT //// FIREBASE QUERY
		var ref = firebase.database().ref();
		var studRef = ref.child("users");
		$firebaseArray(studRef);
		var username = myService.getUser();
		studRef.orderByChild('email').equalTo(username).on("child_added", function(snapshot){
			console.log(snapshot.val().email);
			console.log(snapshot.val().phone);
			console.log(snapshot.val().username);
		});
	//////////// VERY IMPORTANT //// FIREBASE QUERY DONE/

	$scope.logout = function(){
		myService.logoutUser();
	}

}]);


myApp.controller('regCtrl', ['$scope','$location', 'myService', '$firebaseAuth', '$firebaseArray' , function($scope, $location, myService, $firebaseAuth, $firebaseArray){
	//SETUP//
	// DB EMP Data
	$scope.username = myService.getUser();
	if($scope.username){
		//do nothing
	}else{
		//$location.path('/login');
	}



	$scope.handleReg = function(){
		var username = $scope.user.email;
		var password = $scope.user.password;
		var auth = $firebaseAuth();
		auth.$createUserWithEmailAndPassword(username, password)
		.then(function(user){
			var thename = $scope.user.username;
			var phone = $scope.user.phone;
			var ref = firebase.database().ref("users");
			$firebaseArray(ref).$add($scope.user);
		})
		.catch(function(error){
			console.log(error);
		});
	}


/*
//FIREBASE ADD
	$scope.addUser = function(){
		console.log('pushed');
		var ref = firebase.database().ref("users");
		$firebaseArray(ref).$add($scope.user)
		.then(
				function(ref){
					console.log("worked");
				},
				function(error){
					console.log(error);
				}
			)
	}
*/

}]);




myApp.service('myService', ['$location', function($location){
	var user='';
	return{
		getUser:function(){
			if(user == ''){
				user = localStorage.getItem('userinfo');
			}
			return user;
		},
		setUser:function(value){
			localStorage.setItem('userinfo', value);
			user = value;
		},
		logoutUser:function(){
			user ='';
			localStorage.removeItem('userinfo');			
			$location.path('/login');
		}
	}

}]);