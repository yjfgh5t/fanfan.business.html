<template>
  <div class="back">{{ msg }}</div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App 哈哈'
    }
  }
}
</script>

<style scoped>

  .back{
    background-color: rebeccapurple;
  }

</style>
