<template>
  <div>

    <div class="shop-swiper">
      <van-swipe :autoplay="5000" class="shop-swiper">
        <van-swipe-item
            v-for="item in brandList"
            :key="item.id"
            class="shop-swiper-item"
            @click=""
        >
          <van-image class="shop-swiper-item-img" fit="cover" :src="item.url" :alt="item.title" />
        </van-swipe-item>
      </van-swipe>
    </div>


    <div class="main">
      <Plate class="section-header" title="兑换列表"/>
      <van-list
          class="shop-list"
          :immediate-check="false"
      >
        <div v-for="item in productList" :key="item.id" class="shop-list-col">
          <div class="shop-list-item" @click="onGoodClicked(item.id)">
            <div v-if="item.recommendStatus" class="shop-list-item-badge">推荐</div>
            <van-image class="shop-list-item-photo" :src="item.image" :alt="item.productName"/>
            <div class="shop-list-item-info">
              <div class="shop-list-item-title">{{ item.productName }}</div>
              <div class="shop-list-item-price">
                <div class="shop-price">
                  <div class="shop-price-current">
                    <span class="shop-price-current-symbol">积分</span>
                    <span class="shop-price-current-integer">{{ item.score }}</span>
                  </div>
                  <div v-if="item.originalPrice > 0" class="price-origin">
                    <span class="shop-price-origin-integer">{{ item.score }}</span>
                  </div>
                </div>
                <van-button type="primary" plain class="buy-btn">兑换</van-button>
              </div>
            </div>
          </div>
        </div>
        <template #finished>
          <span v-if="list.length">{{ listFinishedText }}</span>
          <van-empty v-else :image="listEmptyImage" :description="listEmptyText"/>
        </template>
      </van-list>
    </div>


    <!-- 底部导航栏 -->
    <Tabbar/>
  </div>
</template>

<script>
import Tabbar from '@/page/tabbar/Index.vue'
import Plate from '@/page/Plate/index.vue'
import { getProductList, setProductList } from '../../utils/authUtils'
import API_PRODUCT from '../../apis/product/index'

export default {
  name: 'Index',
  components: { Tabbar ,  Plate},
  data() {
    return {
      productList: [],
      listFinishedText: '',
      listEmptyText: '暂无商品',
      brandList: [{
        id: 204167,
        linkUrl: '',
        url: 'https://i.imgtg.com/2022/10/05/pWHcx.png',
        type: 'image',
        title: 'b',
      }],
    }
  },
  beforeMount() {
    this.getListFromCache()
    this.getList()
  },
  methods: {
    getListFromCache() {
      this.productList = getProductList()
    },
    onGoodClicked(id) {
      this.$router.push({path: '/shopDetail', query: {id}});
    },
    getList() {
      API_PRODUCT.list()
          .then(res => {
            this.productList = res
            // if (this.productList.length > 20) {
              setProductList(this.productList.slice(0, 20))
            // } else {
            //   setProductList(this.productList)
            // }

          })
    }
  }
}
</script>


<style lang="less">
@import '/src/styles/variable.less';
.shop-swiper {
  width: 100%;
  height: 180px;
  margin-bottom: 10px;

  .shop-swiper-item,
  .shop-swiper-item {
    width: 100%;
    height: 100%;
  }
}
.shop-list {
  display: flex;
  flex-wrap: wrap;
  padding-left: 5px;
  padding-right: 5px;

  //:deep(.van-list__loading),
  //:deep(.van-list__finished-text),
  //:deep(.van-list__error-text) {
  //  width: 100%;
  //}

  &-col {
    width: 50%;
    box-sizing: border-box;
    padding-left: 5px;
    padding-right: 5px;
    margin-bottom: 10px;
  }

  &-item {
    position: relative;
    text-align: left;
    overflow: hidden;
    //background: var(--white);
    background: #fff;
    border-radius: 8px;
    // box-shadow: 0px 2px 4px 3px rgba(243, 243, 243, 0.5);

    &-badge {
      position: absolute;
      top: 15px;
      left: 0;
      z-index: 20;
      display: inline-block;
      padding: 2px 4px;
      //color: var(--white);
      color: #fff;
      //background-color: var(--red-color);
      background-color: #ee0a24;
      font-size: 10px;
      line-height: normal;
      border-radius: 0 8px 8px 0;
      padding-right: 6px;
    }

    &-photo {
      display: flex;
      width: 100%;
      height: 172px;
    }

    &-info {
      padding: 5px 10px;
    }

    &-title {
      font-size: 14px;
      //color: var(--gray-color-8);
      color: #323233;
      min-height: 36px;
      line-height: 18px;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    &-price {
      margin-top: 5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .buy-btn {
      height: 24px;
      padding: 0 8px;
      line-height: 24px;
      //border-color: var(--brand-color);
      //color: var(--brand-color);
      border-color: #ff5179;
      color: #ff5179;
    }

    .shop-price {
      display: flex;
      align-items: center;

      &-current {
        margin-right: 5px;
        color: #ff5179;

        &-symbol {
          font-size: 8px;
          margin-right: 2px;
        }

        &-integer {
          font-size: 18px;
          //font-family: @font-family-price-integer;
          font-family: Avenir-Heavy, PingFang SC, Helvetica Neue, Arial, sans-serif;
        }
      }

      &-origin {
        font-size: 12px;
        text-decoration: line-through;
        color: var(--gray-color-6);

        &-label {
          margin-right: 2px;
        }

        &-integer {
          text-decoration: line-through;
          font-family: @font-family-price-integer;
        }
      }
    }
  }
}
</style>
