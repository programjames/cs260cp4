<template>
<div class="home">
  <p>You've been logged out! Don't worry, if you log back in with the same
    username your personal details will still be rememebered.</p>
</div>
</template>

<script>
export default {
  name: 'Home',
  created() {
    this.$root.$data.username = "";
  }
}
</script>
