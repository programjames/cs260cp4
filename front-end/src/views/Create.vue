<template>
<div class="home">
  <div class="form">
    <input class="title" v-model="post.title" placeholder="Title">
    <img :src="post.image" class="picture">
    <br>
    <input type="file" name="image" @change="uploadImage">
    <br>
    <br>
    <textarea v-model="post.text" placeholder="Description" class="description"></textarea>
    <button @click="uploadPost" class="upload-post">Submit</button>
    <p v-if="postedYet">Successfully submitted! Click on "Home" to check out your post.</p>
  </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Create',
  data() {
    return {
      post: {
        username: "",
        title: "",
        image: "/resources/blankimage.jpg",
        text: "",
        date: null
      },
      postedYet: false,
    }
  },
  mounted() {
    this.post.username = this.$root.$data.username;
    if (this.post.username == "") {
      this.post.username = "Anonymous"
    }
  },
  methods: {
    async uploadImage(event) {
      try {
        let file = event.target.files[0];
        const formData = new FormData();
        formData.append('photo', file, file.name);
        let r = await axios.post('/api/image', formData);
        this.post.image = r.data.path;
      } catch (error) {
        console.log(error);
      }
    },
    async uploadPost() {
      if (!this.postedYet) {
        let r = await axios.post('/api/posts', this.post);
        this.post = r.data;
        console.log(r.data);
        this.postedYet = true;
      }
    }
  }
}
</script>
<style scoped>
.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.picture {
  height: 400px;
}

.title {
  border: none;
  border-width: 0px;
  font-size: 16pt;
  text-align: center;
  font-weight: bold;

}

.title:focus {
  outline: none;
}

.description {
  width: 600px;
  height: 75px;
}

.upload-post {
  width: 606px;
  padding: 10px;
  font-size: 12pt;
  background: #ddf;
  border: none;
}
</style>
