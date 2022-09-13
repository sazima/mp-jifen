<template>
  <div class="container">

    <van-nav-bar
      title="兑换列表"
    />
    <div>
<!--      <van-tabs type="card">-->
<!--        <van-tab title="标签 1">内容 1</van-tab>-->
<!--        <van-tab title="标签 2">内容 2</van-tab>-->
<!--        <van-tab title="标签 3">内容 3</van-tab>-->
<!--      </van-tabs>-->
      <van-tabs v-model="active" @click="onTabClicked"  animated :line-height="0">
        <van-tab v-for="(item, index) in tabList"  :title="item.name"/>
      </van-tabs>

    </div>
    <van-list
      class="exchange-list"
      :immediate-check="false"
    >
      <div v-for="(item, index) in list" :key="item.id" class="exchange-list-item">
        <div class="exchange-list-item-header van-hairline--bottom">
          <div class="exchange-list-item-header-hd">
            <span class="title">时间：{{ item.time }}</span>
          </div>
<!--          <div :class="['list-item-header-state', item.status !== -1 ? 'text-brand-color' : '']">-->
          <div class="text-brand-color : '#fff'">
            <span v-if="item.statusCount.agreeCount > 0 ">已使用: {{item.statusCount.agreeCount}}</span>
            <span v-if="item.statusCount.applyingCount > 0 ">申请中: {{item.statusCount.applyingCount}}</span>
          </div>
        </div>
        <div class="exchange-list-item-body" >
          <div  class="exchange-good-card">
            <van-image fit="contain" class="exchange-good-card-pic" :src="item.productImage" />
            <div class="exchange-good-card-content">
              <div class="exchange-good-card-content-hd">
                <div class="exchange-good-card-title">{{ item.productName }}</div>
                <div v-if="item.desc" class="exchange-good-card-prop">{{ item.desc }}</div>
              </div>
              <div class="exchange-good-card-content-bd">
                <div class="exchange-good-card-price">积分: {{ item.score / item.num }}</div>
                <div class="exchange-good-card-number">x{{ item.num }}</div>
              </div>
            </div>
          </div>
          <div class="exchange-list-item-total van-hairline--top">
            <span class="exchange-list-item-total-number">共{{ item.num }}件商品</span>
            <div class="exchange-list-item-total-price">
              <span class="exchange-list-item-total-price-label"> {{ item.status === 0 ? '需付款：' : '实付款：' }}{{item.score}}</span>
<!--              <div :price="item.score" symbol="积分"/>-->
            </div>
          </div>
        </div>
        <!-- ▼ 操作按钮组（一行最好不要超过3个） -->
        <div class="exchange-list-item-footer van-hairline--top">

          <template v-if="item.status !== 0">
            <van-button class="exchange-list-item-action-btn" v-if="item.statusCount.freeCount > 0" round plain type="primary" @click.stop="applyUse(item)">
              立即使用
            </van-button>
          </template>
        </div>
        <!-- ▲ 操作按钮组 -->
      </div>
      <template #finished>
        <span v-if="list.length">{{ listFinishedText }}</span>
        <van-empty v-else :description="listEmptyText" />
      </template>
    </van-list>
    <Tabbar></Tabbar>
  </div>


</template>

<script>

import Tabbar from '@/page/tabbar/Index.vue'
// import Price from '@/components/Price/index.vue';
import API_PRODUCT from '@/apis/product'
import API_APPLY from '@/apis/apply'
// import {applyUse} from "../../apis/my/apply";
import {Toast} from 'vant'

export default {
  components:{
    Tabbar
  },
  name: "exchange",
  mounted() {
    this.getList()
  },
  data() {
    return {
      exchangeList: [{
        time: '2022-03-03 00:12:00',
        name: '买教训',
        num: 2,
        total: 230,
        unitPrice: 15,
        image: "https://dcdn.it120.cc/2022/02/04/b5017470-29bb-43a3-b34c-56cdf6b0fb05.png",
      }],
      active: 0,
      list: [],
      tabList: [
        {
          name: '未使用',
          status: 1,
        },
        {name: '已使用', status: 3, },
      ],
    }
  },
  methods: {
    onClickLeft() {
      history.back();
    },
    onTabClicked() {
      console.log('onTabClicked--------')
      if (!this.listLoading) {
        this.getList();
      }
    },
    getList() {
      API_PRODUCT.exchangeList({
        status: this.tabList[this.active].status
      }).then(res => {
        this.list = res
      })
    },
    applyUse(item) {
      API_APPLY.applyUse({
        exchangeHistoryId: item.id,
        cardId: null,
        count: 1
      }).then(res => {
        Toast("申请成功")
        this.getList()
      })

    }
  }
}
</script>

<style lang="less" >
.exchange-list {
  &-item {
    .van-hairline--bottom::after {
      right: -44%;
      left: -44%;
    }

    margin: 10px;
    border-radius: 8px;
    background: #fff;
    padding-bottom: 10px;

    &-header {
      display: flex;
      padding: 10px 12px;
      align-items: center;
      font-size: 14px;
      //color: var(--gray-color-8);
      color: #323233;

      &-hd {
        flex: 1;
        margin-right: 10px;
      }

      &-state {
        text-align: right;
        //color: var(--gray-color-6);
        color: #969799;
      }
    }

    &-more {
      font-size: 14px;
      //color: var(--gray-color-6);
      color: #969799;
      padding: 5px;
      line-height: 28px;
      text-align: center;
    }

    &-total {
      height: 48px;
      padding: 0 12px;
      //color: var(--gray-color-8);
      color: #323233;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 12px;

      &-number {
        margin-right: 5px;
      }

      &-price {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 12px;
      }
    }

    &-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 10px 10px 0;
    }

    &-action-btn {
      height: 32px;
      padding: 0 8px;
      min-width: 80px;
      font-size: 14px;

      &:not(:last-child) {
        margin-right: 12px;
      }
    }
  }
}

.exchange-good-card {
  position: relative;
  box-sizing: border-box;
  padding: 12px 12px 10px;
  display: flex;

  &-pic {
    width: 72px;
    height: 72px;
    border-radius: 8px;
    margin-right: 8px;
    overflow: hidden;
  }

  &-content {
    flex: 1;
    display: flex;

    &-hd {
      flex: 1;
      margin-right: 12px;
    }
    &-bd {
      text-align: right;
    }
  }

  &-title {
    font-size: 14px;
    //color: var(--gray-color-8);
    color: #323233;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  &-prop {
    font-size: 12px;
    //color: var(--gray-color-6);
    color: #969799;
    line-height: 16px;
    margin-top: 8px;
  }

  &-price {
    //color: var(--gray-color-8);
    color: #323233;
    letter-spacing: 0;
    font-size: 14px;
  }

  &-number {
    //color: var(--gray-color-6);
    color: #969799;
    line-height: 16px;
    margin-top: 8px;
    font-size: 12px;
  }
}
</style>
