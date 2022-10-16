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
          <van-image class="sigin-swiper-item-img" fit="cover" :src="item.url" :alt="item.title"/>
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
import {Dialog, Toast} from 'vant'
import API_TASK from '@/apis/task'
import API_BRAND from '@/apis/brand'
import { getBannerList, getTaskList, setBannerList, setTaskList } from '../../utils/authUtils'
import { defaultBanner } from '../../utils/consant'

export default {
  name: 'Index',
  components: {Tabbar, Plate},
  data() {
    return {
      listLoading: false,
      listEmptyText: 'no ',
      onRequest: false,  // 是否正在请求列表中
      signInList: [],
      brandList: [],
    }
  },
  mounted() {
    this.getBanderListCache()
    this.getTaskFromCache()

    this.getTaskList()
    this.getBnnerList()
    this.requestSubscribeMessage()
    window.addEventListener('wxshow', this.getTaskList)
  },
  beforeDestroy() {
    window.removeEventListener('wxshow', this.getTaskList)
  },
  methods: {
    getBanderListCache() {
      const bannder = getBannerList()
      this.brandList = bannder
    },
    getBnnerList() {
      API_BRAND.list().then(res => {
        console.log('-----------', res)
        if (res.length > 0) {
          setBannerList(res)
          this.brandList = res
        }
      })
    },
    getTaskFromCache() {
      this.signInList = getTaskList()
    },
    getTaskList() {
      if (this.onRequest) {
        return
      }
      this.onRequest = true
      API_TASK.list()
          .then(res => {
            console.log(res)
            this.signInList = res
            setTaskList(this.signInList)
            this.onRequest = false
          }).catch(err => {
        this.onRequest = false
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
        success(res) {
        }
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
        color: #ee0a24; // var(--red-color);
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
