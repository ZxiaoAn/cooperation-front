<template>
  <div class="hello">
  </div>
</template>

<script>
// import Axios from 'axios'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted () {
    let _self = this
    _self.loginId = location.href.split('draw/')[1]
    let id = _self.loginId
    _self.$router.push(`/draw/Lucking/${id}`)
  },
  methods: {
    clickToLuck () {
      this.$router.push({
        path: '/lucking'
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .home-top{
    width: 120px;
    height: 70px;
    border-radius: 5px;
    margin: 0 auto;
    background: bisque;
    text-align: center;
    line-height: 70px;
    size: 20px;
  }
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
