<template>
  <div class="container">
    <van-list >
      <van-cell v-for="item in list" :key="item" :title="item.title" @click="goPage(item.path)"/>
    </van-list>
    <tabbar></tabbar>
  </div>
</template>

<script>
import Tabbar from '@/page/tabbar/Index.vue'
export default {
  components: {
    Tabbar,
  },
  name: 'index',
  data() {
    return {
      list: [
        {
          'title': '建议',
          'path': '/admin/theme'
        },
        {
          'title': '关于',
          'path': '/admin/theme'
        },
        {
          'title': '捐赠',
          'path': '/admin/theme'
        }
        ],
    };
  },
  methods: {
    goPage(path, query) {
      this.$router.push({ path, query })
    },
  }
}
</script>

<style scoped>

</style>
