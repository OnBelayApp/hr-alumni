var User = require('../../models').User,
    Post = require('../../models').Post,
    Reply = require('../../models').Reply;

module.exports = {

  getReplies: function(req, res) {
    var postId = req.params.id;

    Reply.where({ post_id: postId }).fetchAll({
        withRelated: ['user']
      })
      .then(function(replies) {
        console.log(replies);
        var replyResponse = replies.map(function(reply) {
          return {
            id: reply.get('id'),
            content: reply.get('content'),
            user: reply.related('user').get('full_name'),
            thumbs: reply.get('thumbs'),
            created_at: reply.get('created_at')
          };
        });
        res.json(replyResponse);
      });
  },

  postReply: function(req, res) {
    var postId = req.params.id;
    var userId = req.user.user_id;

    Post.forge({ id: postId })
      .fetch()
      .then(function(post) {
        var count = post.get('replies');
        post.set('replies', count+1);
        post.save();
      });

    Reply.forge({
      content: req.body.content,
      post_id: postId,
      user_id: userId,
      thumbs: 0
    })
    .save()
    .then(function(reply) {
      console.log(reply);
      res.json(reply);
    });
  },

  thumbUpReply: function(req, res) {
    var replyId = req.params.id;
    Reply.where({
      id: replyId
    }).fetch().then(function(reply) {
      if (reply) {
        var count = reply.get('thumbs');
        reply.set('thumbs', count+1);
        reply.save();
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    })
    .catch(function(err) {
      console.error(err);
      res.sendStatus(400);
    });
  }
};
