<template>
  <div class="container">

    <van-nav-bar
      title="申请列表"
    />

    <div class="main">
      <div class="tab-list">
        <van-tabs v-model:active="active" @click="onTabClicked" animated :line-height="0">
          <van-tab v-for="(item, index) in tabList" :key="index" :title="item.name"/>
        </van-tabs>
      </div>
      <van-list
        class="apply-list"
        v-if="list.length > 0"
      >
        <van-swipe-cell v-for="item in list" :key="item.id" style="margin-top: 20px">

          <div class="apply-list-item-header van-hairline--bottom">
            <div class="apply-list-item-header-hd">
              <span class="title">时间：{{ item.time }}</span>
            </div>
            <!--          <div :class="['list-item-header-state', item.status !== -1 ? 'text-brand-color' : '']">-->
            <div class="text-brand-color : '#fff'">
            </div>
          </div>

          <van-card
            :title="item.name"
            :thumb="item.image"
          >

            <template #tag>
              <van-tag plain type="primary" v-if="item.status === 1">已同意</van-tag>
              <van-tag plain type="primary" v-if="item.status === 2">已拒绝</van-tag>
            </template>

            <template #desc>
              {{item.desc}}
            </template>

            <template #footer v-if="item.status === 0">
              <van-button size="small" type="danger" @click="check(item, false)">拒绝</van-button>
              <van-button size="small" type="success" @click="check(item, true)">同意</van-button>
            </template>
          </van-card>
        </van-swipe-cell>
      </van-list>
      <!--      修改内容-->
      <van-empty v-else class="empty" :description="listEmptyText"></van-empty>
    </div>

    <Tabbar/>

  </div>
</template>

<script>
import Tabbar from '@/page/tabbar/Index.vue'
// import {countPair} from '@/utils/format';
// import IMAGE_EMPTY_TRADE from '@/assets/images/empty/trade.png';
import API_APPLY from '@/apis/apply'
import {Dialog, Toast} from "vant";

export default {
  components: {
    Tabbar
  },
  data() {
    return {
      listEmptyText: '暂无数据',
      listEmptyImage: '',
      list: [],
      active: 0,
      tabList: [
        {
          name: '未处理',
          status: 0,
        },
        {name: '已处理', status: 3 },
      ],
    };
  },
  mounted() {
    this.getList()
  },
  methods: {
    check(item, agree) {
      API_APPLY.check({
        id: item.id,
        agree: agree
      }).then(res => {
        Toast("成功")
        this.getList()
      })
    },
    onTabClicked() {
      console.log('onTabClicked--------')
      if (!this.listLoading) {
        this.getList();
      }
    },
    onClickLeft() {
      history.back();
    },
    getList() {
      API_APPLY.listApply({
        status: this.tabList[this.active].status
      }).then(res => {
        this.list = res
      })
    }
  },
};
</script>



<style lang="less">
.apply-list {
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
      color: #323233;

      &-hd {
        flex: 1;
        margin-right: 10px;
      }

      &-state {
        text-align: right;
        color: #969799;
      }
    }

    &-more {
      font-size: 14px;
      color: #969799;
      padding: 5px;
      line-height: 28px;
      text-align: center;
    }

    &-total {
      height: 48px;
      padding: 0 12px;
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

.apply-c-red {
  color: #ee0a24;
}

.apply-c-green {
  color:  #07c160;

}
</style>
