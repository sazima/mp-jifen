<template>
  <div class="container">
    <van-swipe :autoplay="3000" class="detail-swiper">
      <van-swipe-item v-for="item in [product.image]"  class="detail-swiper-item">
        <van-image class="detail-swiper-item-img" fit="contain" :src="item" alt="" />
      </van-swipe-item>
    </van-swipe>
    <div class="detail-section">
      <div class="detail-price">
        <div class="detail-price-hd">
          <div class="detail-price-current">
            <span class="detail-price-current-integer">{{product.score}}</span>
            <span class="detail-price-current-symbol">积分</span>
            <div class="detail-stock-item">剩余 {{ product.num }}</div>

            <!--             <span class="price-tag">la</span>-->
          </div>
          <div v-if='true' class="detail-price-origin">
            <span class="detail-price-origin-label">价格</span>
            <span class="detail-price-origin-integer">{{product.score}}</span>
            <span class="detail-price-origin-symbol">积分</span>
          </div>
        </div>
      </div>
      <div class="detail-desc">
        <div class="detail-desc-hd">
          <div class="detail-desc-title van-multi-ellipsis--l2">{{product.productName}}</div>
          <div v-if="product.desc" class="detail-desc-brief">
            {{ product.desc }}
          </div>
        </div>
      </div>
    </div><!-- 商品导航栏 -->
<!--    <van-goods-action-icon icon="chat-o" text="客服" @click="onClickIcon" />-->
<!--    <van-goods-action-icon icon="cart-o" text="购物车" @click="onClickIcon" />-->
<!--    <van-goods-action-icon icon="shop-o" text="店铺" @click="onClickIcon" />-->
    <van-goods-action>
      <van-goods-action-icon icon="thumb-circle-o" text="首页" to="/shop" replace />
      <van-goods-action-button type="danger" text="兑换" @click="buy" style="color: #fff" />
    </van-goods-action>
<!--    <Sku v-model:show="skuShow" :sku="sku" :initial-sku="initialSku" @confirm="onSkuConfirm" />-->

<!--    <van-sku-->
<!--        v-model="skuShow"-->
<!--        stepper-title="我要买"-->
<!--        :sku="skuData.sku"-->
<!--        :goods="skuData.goods"-->
<!--        reset-stepper-on-hide-->
<!--        :initial-sku="skuData.initialSku"-->
<!--    >-->
<!--      &lt;!&ndash; 自定义 sku-header-price &ndash;&gt;-->
<!--      <template #sku-header-price="props">-->
<!--        <div class="van-sku__goods-price">-->
<!--      <span class="van-sku__price-symbol">积分</span-->
<!--      ><span class="van-sku__price-num">{{ props.price }}</span>-->
<!--        </div>-->
<!--      </template>-->

<!--      &lt;!&ndash; 自定义 sku actions &ndash;&gt;-->
<!--      <template #sku-actions="props">-->
<!--        <div class="van-sku-actions">-->
<!--          <van-button square size="large" type="warning" @click="onSkuConfirm">-->
<!--            积分兑换-->
<!--          </van-button>-->
<!--        </div>-->
<!--      </template>-->
<!--    </van-sku>-->


  </div>
</template>

<script>
import API_PRODUCT from '../../apis/product/index'
import { Dialog, Toast } from 'vant';

export default {
  name: 'detail',
  data() {
    return {
      product: {},
      skuShow: false,
      skuData: {
        sku: {
          // 所有sku规格类目与其值的从属关系，比如商品有颜色和尺码两大类规格，颜色下面又有红色和蓝色两个规格值。
          // 可以理解为一个商品可以有多个规格类目，一个规格类目下可以有多个规格值。
          tree: [
            // {
            //   k: '规格', // skuKeyName：规格类目名称
            //   k_s: 's1', // skuKeyStr：sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
            //   v: [
            //     {
            //       id: '1', // skuValueId：规格值 id
            //       name: 'xx', // skuValueName：规格值名称
            //       imgUrl: '', // 规格类目图片，只有第一个规格类目可以定义图片
            //       previewImgUrl: '', // 用于预览显示的规格类目图片
            //     },
            //   ],
            //   largeImageMode: false, //  是否展示大图模式
            // }
          ],
          // 所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
          list: [
            // {
            //   id: 2259, // skuId
            //   s1: '1', // 规格类目 k_s 为 s1 的对应规格值 id
            //   price: 100, // 价格（单位分）
            //   stock_num: 110 // 当前 sku 组合对应的库存
            // }
          ],
          price: '1.00', // 默认价格（单位元）
          stock_num: 227, // 商品总库存
          collection_id: 2261, // 无规格商品 skuId 取 collection_id，否则取所选 sku 组合对应的 id
          none_sku: true, // 是否无规格商品
          hide_stock: false // 是否隐藏剩余库存
        },
        initialSku: {
          // 初始选中数量
          selectedNum: 1,
        },
        goods: {
          // 默认商品 sku 缩略图
          picture: ''
        }
      }
    }
  },
  mounted() {
    this.getGoodsDetail()
  },
  watch: {
    '$route.query.id'(value) {
      const id = this.$route.query.id
      if (id) {
        this.getGoodsDetail()
      }
    }
  },
  methods: {
    getGoodsDetail() {
      console.log('getGoodsDetail')
      const id = this.$route.query.id
      API_PRODUCT.detail({
        productId: id
      }).then(res => {
        this.product = res
        console.log(res.productName)
        this.skuData.goods.picture = res.image
        this.skuData.initialSku.selectedNum = 1
        this.skuData.sku.price = res.score
        this.skuData.sku.stock_num = res.num
        console.log(this.skuData)
      })

    },

    buy() {
      Dialog.confirm({
        message: '是否花费' + this.skuData.sku.price + "积分兑换" + this.product.productName
      }).then(res => {
        const id = this.$route.query.id
        API_PRODUCT.exchange({
          productId: id,
          count: this.skuData.initialSku.selectedNum
        })
            .then(res => {
              Toast("兑换成功")
              this.skuShow = false
              this.getGoodsDetail()
            })

      })
    },
    // onSkuConfirm(item) {
    //   const id = this.$route.query.id
    //   console.log(this.skuData.initialSku.selectedNum);
    //   API_PRODUCT.exchange({
    //     productId: id,
    //     count: this.skuData.initialSku.selectedNum
    //   })
    //       .then(res => {
    //         Toast("兑换成功")
    //         this.skuShow = false
    //         this.getGoodsDetail()
    //       })
    // }
  }
}
</script>


<style lang="less">
@import '/src/styles/variable.less';
.detail-section {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 0 15px 10px;
  background: #fff;
}

.detail-swiper {
  width: 100%;
  height: 375px;

  &-item,
  &-item-img {
    width: 100%;
    height: 100%;
  }
}

.detail-price {
  margin-top: 10px;

  &-current {
    display: flex;
    align-items: flex-end;
    align-items: center;
    margin-right: 8px;
    font-size: 16px;
    color: #ff5179;

    &-symbol {
      font-size: 14px;
      margin-right: 2px;
    }

    &-integer {
      font-size: 22px;
      font-weight: bold;
      font-family: Avenir-Heavy, PingFang SC, Helvetica Neue, Arial, sans-serif;
    }
  }

  &-origin {
    display: flex;
    align-items: flex-end;
    align-items: center;
    margin-right: 8px;
    font-size: 12px;
    line-height: 18px;
    color: #969799;

    &-label {
      margin-right: 4px;
    }

    &-integer {
      text-decoration: line-through;
      font-family: Avenir-Heavy, PingFang SC, Helvetica Neue, Arial, sans-serif;
    }
  }

  &-tag {
    box-sizing: border-box;
    margin-left: 10px;
    display: inline-flex;
    font-size: 10px;
    padding: 2px 4px;
    border-radius: 4px;
    color: #f44;
    border: 1px solid #f44;
  }
}

.detail-desc {
  margin-top: 10px;

  &-title {
    font-size: 16px;
    line-height: 20px;
  }

  &-brief {
    margin-top: 4px;
    color: #969799;
    font-size: 12px;
    word-break: break-all;
  }
}

.detail-stock {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  background: #fff;
  margin-bottom: 10px;

  &-item {
    flex: 1;
    font-size: 12px;
    color: #969799;

    &:last-child {
      text-align: right;
    }
  }
}

.goods-content {
  box-sizing: border-box;
  background: #fff;
  padding: 0 10px;
  padding-top: 10px;
  overflow: hidden;
  color: #323233;
  font-size: 16px;
  line-height: 1.5;
  text-align: left;
  word-wrap: break-word;

  :deep(i)mg {
    display: block;
    max-width: 100% !important;
    height: auto !important;
  }

  :deep(p) {
    margin: 0;
    padding: 0;
  }
}

.mb10 {
  margin-bottom: 10px;
}

.mt10 {
  margin-top: 10px;
}

.cell-bar {
  display: flex;
  color: #323233;

  &-title {
    flex-shrink: 0;
    margin-right: 12px;
    color: #969799;
  }

  &-txt {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }
}

.action-bar-perch {
  height: calc(50px + constant(safe-area-inset-bottom));
  height: calc(50px + env(safe-area-inset-bottom));
}
</style>
