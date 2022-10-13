<template>
  <div class="tabbar-wrap">
    <van-tabbar v-model="active" class="tabbar" fixed>
      <van-tabbar-item v-for="(item, index) in this.list" :key="index" :name="item.pagePath" @click="onTabClicked(index)">
        <template #icon>
          <van-icon :name="item.icon" />
        </template>
        {{ item.text }}
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      active: '/signin',
      list: [
        {
          text: '赚积分',
          pagePath: '/signin',
          icon: 'gold-coin-o',
        },
        {
          text: '积分兑换',
          pagePath: '/shop',
          icon: 'home-o',
        },
        {
          text: '发现',
          pagePath: '/action',
          icon: 'star-o'
        },
        {
          text: '我的',
          pagePath: '/mine',
          icon: 'contact'
        },
      ]
    }
  },
  methods: {
    onTabClicked(index) {
      console.log(index)
      // this.active = index
      this.$router.push({path: this.list[index].pagePath})
    }

  },
  mounted() {
    console.log('this.$route.path', this.$route.path);
    this.active = this.$route.path === '/' ? '/signin' : this.$route.path
  },
  watch: {
    "$route.path"(value) {
      console.log(value)
      this.active = value
    }
  }
}
</script>

<style lang="less" >
@import '/src/styles/variable.less';
.tabbar-wrap {
  height: calc(50px + constant(safe-area-inset-bottom));
  height: calc(50px + env(safe-area-inset-bottom));
}

.tabbar {
  :deep(.van-tabbar-item--active) {
    color: var(--brand-color);
    color: var(--brand-color);
  }
}
</style>
