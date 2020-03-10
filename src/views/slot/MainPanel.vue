<template>
  <div class="MainPanel">
    <slot name="header">
      <header></header>
    </slot>
    <main>
      <slot></slot>
    </main>
    <slot name="footer">
      <footer></footer>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'MainPanel',
  components: {

  },
  data () {
    return {

    }
  },
  computed: {

  },
  watch: {

  },
  created () {

  },
  mouted () {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.MainPanel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  header {
    width: 100%;
    height: 46px;
    background: cyan;
  }
  main {
    flex: 1;
    width: 100%;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }
  footer {
    width: 100%;
    height: 40px;
    background: deeppink;
  }
}
</style>
