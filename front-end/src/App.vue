<template>
<div id="app">
  <div id="nav">
    <div class="left"></div>
    <div class="center">
      <router-link to="/">Home</router-link> |
      <router-link to="/create">Create</router-link>
    </div>
    <div class="right" v-if="this.$root.$data.username == ''">
      <router-link to="/login">Login</router-link>
    </div>
    <div class="right" v-else>
      <router-link to="/logout">Logout</router-link> | <router-link to="/login">{{this.$root.$data.username}}</router-link>
    </div>
  </div>
  <router-view />
  <a href="https://github.com/programjames/cs260cp4" class="footer"><br><br>Link to Github</a>
</div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.left,
.right {
  display: flex;
  flex: 1;
}

.right {
  flex-direction: row-reverse;
  justify-content: start;
}

.left {
  justify-content: start;
}


.center {
  display: flex;
  flex: 1;
  justify-content: center;
}

#nav div a {
  padding-left: 10px;
  padding-right: 10px;
  font-weight: bold;
  color: #2c3e50;
}

#nav div a.router-link-exact-active {
  color: #42b983;
}

.footer {
  position: relative;
  bottom: 0;
  width: 100%;
  color: green;
  font-weight: bold;
}
</style>
