<template>
  <div class="container">
    <div class="sigin-swiper">
      <van-swipe :autoplay="5000" class="sigin-swiper">
        <van-swipe-item
            v-for="item in brandList"
            :key="item.id"
            class="sigin-swiper-item"
            @click=""
        >
          <van-image class="sigin-swiper-item-img" fit="cover" :src="item.url" :alt="item.title" />
        </van-swipe-item>
      </van-swipe>
    </div>

    <div class="main">
      <Plate class="sigin-section-header" title="任务列表"/>
      <div v-if="signInList" class="sigin-list">
        <div v-for="item in signInList" :key="item.id" class="sigin-list-item">
          <div class="sigin-list-item-bd">
            <div class="sigin-list-item-bd-inner">
              <div class="sigin-list-item-bd-title van-ellipsis">{{ item.name }}</div>
              <div class="sigin-list-item-bd-txt">积分 +{{ item.score }}</div>
            </div>
            <div v-if="item.canSignIn" class="sigin-list-item-bd-action" @click="sigin(item)">
              签到
            </div>
            <div v-else class="sigin-list-item-bd-disable">
              已签到
            </div>
          </div>

        </div>

      </div>
      <van-empty v-else class="empty" :description="listEmptyText">
      </van-empty>
      <!--      </SpainList>-->
    </div>
    <!-- 底部导航栏 -->
    <Tabbar/>
  </div>
</template>

<script>
import Tabbar from '@/page/tabbar/Index.vue'
import Plate from '@/page/Plate/index.vue'
import { Dialog, Toast } from 'vant'
import API_TASK from '@/apis/task'

export default {
  name: 'Index',
  components: { Tabbar, Plate },
  data() {
    return {
      listLoading: false,
      listEmptyText: 'no ',
      signInList: [],
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
    this.getTaskList()
    this.requestSubscribeMessage()
  },
  methods: {
    getTaskList() {
      API_TASK.list()
          .then(res => {
            console.log(res)
            this.signInList = res
          })
    },
    sigin(item) {
      const id = item.id
      API_TASK.sigin({
        taskId: id,
      })
          .then(res => {
            Toast('签到成功，积分 +' + res.score)
            this.getTaskList()
          })
    },
    requestSubscribeMessage() {
      wx.requestSubscribeMessage({
        tmplIds: ['yttNwZWULn5E1xDDY8cZJ16eExEQ_gdAe3ywBfPh8Bs'],
        success (res) { }
      })
    }
  },

}
</script>

<style lang="less">
@import '/src/styles/variable.less';

.sigin-swiper {
  width: 100%;
  height: 180px;
  margin-bottom: 10px;

  .sigin-swiper-item,
  .sigin-swiper-item {
    width: 100%;
    height: 100%;
  }
}


.sigin-list {
  box-sizing: border-box;
  padding-top: 5px;

  .sigin-list-item {
    box-sizing: border-box;
    height: 100px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 10px;
    margin-left: 15px;
    margin-right: 15px;
    background: #fff;
    box-shadow: 0px 2px 4px 2px rgba(228, 228, 228, 0.5);

    //.sigin-list-item-bd {
    //  box-sizing: border-box;
    //  width: 34%;
    //  text-align: center;
    //  height: 100%;
    //  padding: 20px 0;
    //  font-size: 12px;
    //  color: var(--white);
    //}

    .sigin-list-item-bd {
      //flex: 1;
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 20px 0;
      margin-left: 15vw;

      .sigin-list-item-bd-title {
        font-size: 16px;
        color: #323233;
      }

      .sigin-list-item-bd-txt {
        font-size: 12px;
        color: #969799;
      }

      .sigin-list-item-bd-action {
        font-size: 10px;
        color: var(--red-color);
        border: 1px solid #ee0a24;
        border-radius: 15px;
        padding: 5px 10px;
        position: absolute;
        right: 10vw;
      }

      .sigin-list-item-bd-disable {
        font-size: 10px;
        //color: var(--red-color);
        //border: 1px solid var(--red-color);
        border-radius: 15px;
        padding: 5px 10px;
        position: absolute;
        right: 10vw;
      }
    }
  }
}
</style>
