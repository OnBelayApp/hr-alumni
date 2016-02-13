angular.module('myApp', [
  'ui.router',
  'ngAnimate',
  'myApp.board',
  'myApp.post',
  'myApp.reply',
  'board.services',
  'post.services',
  'reply.services',
  'angularMoment',
  'ui.bootstrap'
  ])

.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');
  $stateProvider
    .state('home', {
      url:'/home',
      templateUrl: 'app/views/home.html'
    })
    .state('profiles', {
      url: '/profiles',
      templateUrl: 'app/views/profiles.html'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'app/views/login.html'
    })
    .state('profiles.profile', {
      url: '',
      templateUrl: 'app/views/profile.html'
    })
    .state('updateProfile', {
      url: '/updateProfile/:githubName',
      templateUrl: 'app/views/updateProfile.html'
    })
    .state('board', {
      url: '/board',
      templateUrl: 'app/views/board.html',
      controller: 'BoardCtrl'
    });
}])

.controller('homeCtrl', ['$scope','$state', function ($scope, $state) {

  $state.transitionTo('profiles.profile');

}])

.controller('profilesCtrl', ['$scope', '$http', 'HttpRequest', 'Profile', function ($scope, $http, HttpRequest, Profile) {

  HttpRequest.getProfiles()
    .then(function (res) {
      $scope.profiles= res.data;
      $scope.setProfile= function (profile) {
        $scope.currentProfile= Profile.setProfile(profile);
      };
    });

    // used for showing the modal in profiles.html
    $scope.modalDetails = function(profile){
      $scope.profile = profile;
      $('#modalDetails').openModal();
    };

}])

.controller('updateProfileCtrl', ['$scope', '$stateParams','HttpRequest', function ($scope, $stateParams, HttpRequest){
  $scope.submitProfile = function (isValid, formData) {
        HttpRequest.submitProfile(isValid, formData);
  };

  //prepopulation of data
  HttpRequest.getProfile($stateParams.githubName)
    .then(function (res) {
      $scope.data= res.data;
    });

}])

.controller('loginCtrl', ['$scope', 'HttpRequest', function ($scope, HttpRequest) {
  $scope.login= function (){
    HttpRequest.login()
      .then(
        function (res) {
          console.log('res to login', res);
        },
        function (err) {
          console.log('there was an error');
        }
      );
  };
}])

.factory('HttpRequest', ['$http', '$q', function ($http, $q){
  var deferred= $q.defer();
  var submitProfile = function (isValid, data) {
    if (isValid) {
        return $http({
            method: 'POST',
            url: '/api/updateProfile',
            data: data
        });
    } else {

    }
  };

  var getProfiles= function () {
    return $http({
      method: 'GET',
      url: '/api/profiles'
    }).success(function(result){
      deferred.resolve(result);
    }).error(function (result){
      deferred.reject(result);
    });
  };

  var getProfile= function (githubName){
    return $http({
      method: 'GET',
      url: '/api/profile/'+githubName
    }).success(function(result){
      deferred.resolve(result);
    }).error(function (result){
      deferred.reject(result);
    });
  };

  return {
    submitProfile: submitProfile,
    getProfiles: getProfiles,
    getProfile: getProfile
  };
}])

.factory('Profile', function (){
  var storedProfile;
  var setProfile= function (profile) {
    storedProfile= profile;
    return storedProfile;
  };
  var getProfile= function (){
    return storedProfile;
  };
  return {
    setProfile: setProfile,
    getProfile: getProfile
  };

});
