<template>
<div class="home">
  <div v-if="this.$root.$data.username == ''">
    <!-- <h1>Login</h1> -->
    <input v-model="user.username" placeholder="Username">
    <button @click="login">Login</button>
    <p>We don't worry about authentication here. Just type in your username.</p>
  </div>
  <div v-else class="main">
    <div class="profile">
      <h1>Profile</h1>
      <h3>{{user.username}}</h3>
      <h4>id: {{user._id}}</h4>
      <img :src="user.profile" class="profile-picture">
      <br>
      <input type="file" name="profile" @change="uploadProfile">
      <br>
      <br>
      <textarea v-model="user.bio" placeholder="Bio"></textarea>
      <br>
      <button @click="uploadBio" class="save-bio">Save Bio</button>
    </div>
    <div class="postcomments">
      <h2>Recent Posts</h2>
      <div v-if="posts.length === 0">
        Looks like there are no recent posts!
      </div>
      <div v-else class="postlist">
        <div v-for="post in recentPosts" :key="post._id" class="post">
          <h3 class="post-title">{{post.title}}</h3>
          <img :src="post.image" class="post-image">
          <br>
          <em>{{formatDate(post.date)}}</em>
          <p class="description">{{post.text.length > 100? post.text.substring(0, 97) + "...":post.text}}</p>
        </div>
      </div>
      <h2>Recent Comments</h2>
      <div v-if="comments.length === 0">
        Looks like there are no recent comments!
      </div>
      <div v-else>
        <div v-for="comment in recentComments" :key="comment._id">
          <p class="comment-description">{{comment.text.length > 100? comment.text.substring(0, 97) + "...":comment.text}} <em>{{formatDate(comment.date)}}</em>
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
export default {
  name: 'Login',
  data() {
    return {
      user: {
        username: "",
        profile: "/resources/blankprofile.png",
        bio: "",
        _id: ""
      },
      comments: [],
      posts: [],
    }
  },
  methods: {
    formatDate(date) {
      return moment(date).format('MM/DD/YYYY h:mm a');
    },
    async login() {
      this.$root.$data.username = this.user.username;
      let r = await axios.post('/api/profiles', this.user);
      this.user = r.data;
      this.getComments();
      this.getPosts();
    },

    async uploadProfile(event) {
      try {
        let file = event.target.files[0];
        const formData = new FormData();
        formData.append('photo', file, file.name);
        let r = await axios.post('/api/profilepic', formData);
        this.user.profile = r.data.path;
        this.save();
      } catch (error) {
        console.log(error);
      }
    },

    async uploadBio() {
      this.save();
    },

    async save() {
      try {
        let r = await axios.put('/api/profiles/' + this.user._id, this.user);
        this.user = r.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getComments() {
      try {
        let r = await axios.get('/api/user/comments/' + this.user._id);
        this.comments = r.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getPosts() {
      try {
        let r = await axios.get('/api/user/posts/' + this.user._id);
        this.posts = r.data;
      } catch (error) {
        console.log(error);
      }
    }
  },
  computed: {
    recentComments() {
      return this.comments.slice(this.comments.length - 4, this.comments.length);
      //return this.comments.concat().sort((a, b) => moment(a.date) < moment(b.date)).slice(0, 4);
    },
    recentPosts() {
      return this.posts.slice(this.posts.length - 3, this.posts.length);
      //return this.posts.concat().sort((a, b) => moment(a.date).isBefore(b.date)).slice(0, 3);
    }
  },
  async mounted() {
    if (this.$root.$data.username != "") {
      this.user.username = this.$root.$data.username;
      let r = await axios.post('/api/profiles', this.user);
      this.user = r.data;
      this.getComments();
      this.getPosts();
    }
  }
}
</script>

<style scoped>
.main {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 30px;
  flex: 0.3;
}

.postcomments {
  flex: 0.7;
}

.postlist {
  display: flex;
  justify-content: space-around;
}

.post-image {
  height: 150px;
}

.description {
  text-align: left;
  max-width: 200px;
  font-size: 11pt;
}

.comment-description {
  text-align: left;
  font-size: 11pt;
}

textarea,
.save-bio {
  width: 300px;
}

textarea {
  height: 100px;
}

.profile-picture {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}
</style>
