 <template>
  <div class="home">
  <h2>Recent Posts</h2>
  <div v-if="posts.length === 0">
    There aren't any posts yet. Please create one!
  </div>
  <div v-else class="postlist">
    <div v-for="post in posts" :key="post._id" class="post">
      <router-link :to="'/post/'+post._id" class="post-title">{{post.title}}</router-link>
      <p>{{post.username?post.username:"Anonymous"}}</p>
      <img :src="post.image" class="post-image">
      <br>
      <em>{{formatDate(post.date)}}</em>
      <p class="description">{{post.text.length > 100? post.text.substring(0, 97) + "...":post.text}}</p>
    </div>
  </div>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
export default {
  name: 'Home',
  data() {
    return {
      posts: [],
    }
  },
  mounted() {
    this.getPosts();

  },
  methods: {
    async getPosts() {
      let r = await axios.get('/api/posts');
      this.posts = r.data;
    },

    formatDate(date) {
      return moment(date).format('MM/DD/YYYY h:mm a');
    },
  }
}
</script>
<style scoped>
.post {
  margin: 50px;
}

p,
a {
  margin: 5px;
}

a {
  font-size: 16pt;
  font-weight: bold;
  color: black;
}

a:hover {
  color: inherit;
}

.post-image {
  height: 500px;
}
</style>
