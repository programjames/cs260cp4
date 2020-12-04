<template>
<div v-if="deleted">
  The post has successfully been deleted.
</div>
<div v-else>
  <div v-if="post.isnull">
    Whoops! Looks like the post you were looking for doesn't exist.
  </div>
  <div v-else class="main">
    <div class="post">
      <h3>{{post.title}}
        <button class="delete" @click="deletePost" v-if="post.username != '' && post.username == this.$root.$data.username"><i class="fa fa-trash" aria-hidden="true"></i></button>
      </h3>
      <p>{{post.username?post.username:"Anonymous"}}</p>
      <img :src="post.image" class="post-image">
      <br>
      <em>{{formatDate(post.date)}}</em>
      <p class="description">{{post.text.length > 100? post.text.substring(0, 97) + "...":post.text}}</p>
    </div>
    <div class="comments">
      <div class="comment" v-for="comment in post.comments" :key="comment._id">
        <p class="comment-text">{{comment.text}}</p>
        <p class="comment-info"><em class="comment-username">-{{comment.username?comment.username:"Anonymous"}}</em>
          <span class="comment-date">{{formatDate(comment.date)}}</span>
        </p>
      </div>
    </div>
    <div class="reply">
      <textarea v-model="reply" placeholder="Comment" class="reply-text"></textarea>
      <br>
      <button @click="replyPost" class="reply-button"><i class="fa fa-reply" aria-hidden="true"></i> Reply</button>
    </div>
    <div class="comments">
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
export default {
  name: 'Post',
  data() {
    return {
      post: {
        isnull: true,
        comments: [],
      },
      deleted: false,
      reply: "",
    }
  },
  mounted() {
    this.getPost();

  },
  methods: {
    async getPost() {
      let r = await axios.get('/api/posts/' + this.$route.params.id);
      this.post = r.data;
      console.log(r.data);
    },

    formatDate(date) {
      return moment(date).format('MM/DD/YYYY h:mm a');
    },

    async deletePost() {
      let r = await axios.delete('/api/posts/' + this.post._id);
      if (r.status == 204) {
        this.deleted = true;
      }
    },

    async replyPost() {
      let data = {
        username: this.$root.$data.username,
        text: this.reply,
        id: this.post._id,
      }
      await axios.post('/api/comment', data);
      this.getPost();
      this.reply = "";
    }
  }
}
</script>
<style scoped>
.post {
  margin: 50px;
}

p,
h3 {
  margin: 5px;
}

h3 {
  font-size: 16pt;
  text-decoration: underline;
}

.post-image {
  height: 500px;
}

.delete {
  color: blue;
  border: none;
  background: none;
  padding: 0;
  font-size: 16pt;
  margin-left: 10px;
}

.delete:focus {
  outline: none;
}

.reply-text {
  width: 100%;
  height: 50px;
}

.reply-button {
  float: left;
  margin-bottom: 10px;
}

.comments {
  display: flex;
  flex-direction: column;
  align-items: start;
}

.comment {
  display: flex;
  flex-direction: column;
  align-items: start;
}

.comment-text {
  font-size: 14pt;
}

.comment-info {
  padding-left: 20px
}

.comment-date {
  font-size: 10pt;
  padding-left: 5px;
}
</style>
