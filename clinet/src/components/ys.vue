<template>
  <div>
    <div style="border:1px solid #f00;padding:20px;"> {{weather.yesterday}}</div>
   
  </div>
</template>


<script>
export default {
  data() {
    return {
      msg: "ys"
    }
  },
 
  asyncData({store}) {
    return store.dispatch('GET_WEATHER') // 返回promise
  },
  
  mounted (){
    console.log(this.$store.state.route)
  },
   computed: {
    weather () {
      return this.$store.state.weather
    }
  },
}
</script>
