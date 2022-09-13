<template>
  <div class="container">
    <van-nav-bar
        title="明细"
    />
    <div class="integral-header">
      <div class="integral-header-count">
        <span class="integral-header-count-value">{{ type == 'total' ? detailData.totalScore: detailData.totalSignCount }}</span>
        <span class="integral-header-count-label">{{type == 'total'? '可用积分' : '签到次数'}}</span>
      </div>
    </div>
    <van-list
        class="list"
    >
      <van-index-bar :index-list="[]">
        <template v-for="(dayItem, i1) in detailData.dayItems" :index="dayItem.day">
          <van-index-anchor :index="dayItem.day"/>
          <div v-for="item in dayItem.scoreItems"
               class="integral-list-item van-hairline--bottom">
            <div class="integral-list-item-hd">
              <div class="integral-list-item-title">{{ item.name }}</div>
              <div class="integral-list-item-txt">{{ item.datetime }}</div>
            </div>
            <div :class="['integral-list-item-bd', item.score > 0 ? 'integral-c-red' : 'integral-c-green']">
              <span>{{item.score > 0 ? '+' : ''}}</span>
              <span>{{ item.score }}</span>
            </div>
          </div>
        </template>
      </van-index-bar>
      <template #finished>
        <span v-if="list.length">{{ listFinishedText }}</span>
        <van-empty v-else :image="listEmptyImage" :description="listEmptyText"/>
      </template>
    </van-list>
    <Tabbar></Tabbar>
  </div>
</template>


<script>
import Tabbar from '@/page/tabbar/Index.vue'
import API_SCORE from '@/apis/score/index'

export default {
  components: {
    Tabbar
  },
  data() {
    return {
      detailData: {
        dayItems: [],
        type: 'total'
      }
    }
  },
  mounted() {
    this.type = this.$route.query.type
    this.getDetail()
  },
  methods: {
    onClickLeft() {
      history.back();
    },
    getDetail() {
      let params;
      if (this.type === 'total') {  // 所有
        params = {
          exchange: true,
          signIn: true
        }
      } else if(this.type === 'signIn') {  // 签到列表
        params = {
          exchange: false,
          signIn: true
        }
      }
      API_SCORE.scoreDetail(params).then(res => {
        this.detailData = res
      })
    }
  }

}


</script>
<style lang="less" >
.integral-header {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  width: 100%;
  height: 80px;
  background-image: linear-gradient(90deg, #6b6c85, #3a4053);
  color: #fff;
  font-size: 12px;
  overflow: hidden;
  margin-bottom: 10px;

  &-count {
    display: flex;
    align-items: center;

    &-value {
      font-size: 24px;
      font-weight: 500;
    }

    &-label {
      margin-left: 8px;
      font-size: 12px;
    }
  }

  &-tag {
    width: 64px;
    height: 24px;
    line-height: 24px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    font-size: 12px;
    color: #fff;
    box-sizing: border-box;
    text-align: center;
  }
}


.integral-list-item {
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 15px;
  background: #fff;

  &-hd {
    flex: 1;
  }

  &-bd {
    // flex:1;
  }

  &-title {
    margin-bottom: 5px;
    font-size: 16px;
    //color: var(--gray-color-8);
    color: #323233;
  }

  &-txt {
    font-size: 14px;
    //color: var(--gray-color-6);
    color: #969799;
  }
}

.integral-c-red {
  color: #ee0a24;
}

.integral-c-green {
  color: #07c160;
}
</style>
