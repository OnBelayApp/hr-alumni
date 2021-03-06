angular.module('myApp.board', [])

.controller('BoardCtrl', ['$scope', '$state', 'Board', function($scope, $state, Board) {
  $scope.posts = [];
  $scope.newPost = {
    title: '',
    content: ''
  };
  $scope.plusButton = 'plus-start';
  $scope.searchText = '';
  $scope.activePost = {};
  $scope.heartsOnly = false;
  $scope.showNewPostForm = false;
  $scope.catIcons = {
    events: 'calendar',
    jobs: 'briefcase',
    help: 'question',
    announcements: 'bullhorn',
    miscellaneous: 'info'
  };

  $scope.getAllPosts = function() {
    Board.getPosts()
      .then(function(res) {
        $scope.posts = res;
      })
      .catch(function(err) {
        console.error(err);
        $state.go('login');
      });
  };

  $scope.heartUp = function(post) {
    Board.upvotePost(post.id).then(function(resp) {
      post.hearts += 1;
    });
  };

  $scope.getHearts = function() {
    if (!$scope.heartsOnly) {
      Board.getHearts().then(function(resp) {
        $scope.posts = resp;
        $scope.heartsOnly = true;
        $scope.activePost = {};
        $scope.activePost.showReplies = false;
      }).catch(function(err) {
        console.log(err);
      });
    } else {
      $scope.heartsOnly = false;
      $scope.getAllPosts();
      $scope.activePost = {};
      $scope.activePost.showReplies = false;
    }
  };

  $scope.viewPost = function(post) {
    $scope.activePost.content = '';
    $scope.activePost.replies = [];
    $scope.activePost.showReplies = false;

    if (post.id !== $scope.activePost.id) {
      Board.getPostContent(post.id).then(function(resp) {
        angular.extend(post, resp);
        $scope.activePost = post;
        //$scope.activePost.showReplies = false;
      });
    } else {
      $scope.activePost = {};
      //$scope.activePost.showReplies = false;
    }
  };

  $scope.viewNewPostForm = function(){
    $scope.showNewPostForm = !$scope.showNewPostForm;
    if ($scope.plusButton === 'plus-start') {
      $scope.plusButton = 'plus-rotate';
    } else {
      $scope.plusButton = 'plus-start';
    }
  };

  $scope.addPost = function() {
    if (!$scope.newPost.title || !$scope.newPost.category || !$scope.newPost.content) {
      $scope.formError = true;
      return;
    }
    $scope.formError = false;
    Board.createPost($scope.newPost)
      .then(function(res) {
        $scope.getAllPosts();
        $scope.newPost = {
          title: '',
          content: ''
        };
        $scope.plusButton = 'plus-start';
        $scope.showNewPostForm = false;
      });
  };

  $scope.getAllPosts();
}]);
