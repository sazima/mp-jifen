<template>
  <div class="container" @click="clientMain">
    <div class="detail-header">
      <div class="detail-header-inner">
        <div v-if="false" class="detail-header-tag" @click="switchUser">切换</div>
        <van-image class="detail-header-avatar" :src="detailData.image || detailData.defaultImage"  @click="getWechatName" alt="" />
        <div class="detail-header-info">
          <div class="detail-header-nick van-ellipsis detail-mb10">
            {{ detailData.nickname || `还没有昵称` }}
          </div>
          <div class="detail-header-sub">
          </div>
        </div>
      </div>
      <div class="detail-header-bg">
        <div class="detail-header-bg-wave">
          <!--          <MineSvgWaveBg/>-->
        </div>
      </div>
    </div>
    <div class="main">
      <div class="detail-group"></div>
      <div class="detail-group">
        <div class="detail-count-list">

          <div class="detail-count-list-item" @click="goPage('/integral', {type: 'total'})">
            <div class="detail-count-list-item-value">{{ detailData.score }}</div>
            <div class="detail-count-list-item-label">积分</div>
          </div>

          <div class="detail-count-list-item" @click="goPage('/integral?',  {type: 'signIn'})">
            <div class="detail-count-list-item-value">{{ detailData.signIn }}</div>
            <div class="detail-count-list-item-label">签到</div>
          </div>

          <div class="detail-count-list-item" @click="goPage('/exchange')">
            <div class="detail-count-list-item-value">{{ detailData.exchange }}</div>
            <div class="detail-count-list-item-label">兑换</div>
          </div>
          <div class="detail-count-list-item" @click="showPartnerButton">
            <div class="detail-count-list-item-value">{{ detailData.partner }}</div>
            <div class="detail-count-list-item-label">{{detailData.partner == 0 ? '点击绑定对象': '对象'}}</div>

          </div>
        </div>
      </div>
      <!-- 常用功能 -->
      <div class="detail-group">
        <div class="detail-group-header van-hairline--bottom">
          <div class="detail-group-header-hd">管理</div>
        </div>
        <div class="detail-tool-list">
          <div v-for="(item, index) in toolList" :key="index" class="detail-tool-list-item" @click="goPage(item.path)">
            <van-icon class="detail-tool-list-item-icon" :name="item.icon" :badge="item.count"/>
            <div class="detail-tool-list-item-title">{{ item.title }}</div>
          </div>
        </div>
      </div>

<!--      对象详情-->
      <van-dialog
          use-slot
          title="对象详情"
          v-model:show="showPartner"
          show-cancel-button
      >
        <van-card
            :price="partnerInfo.score"
            currency="积分"
            :title="partnerInfo.nickName"
            :thumb="partnerInfo.image"
        >
          <template #price>
            积分： {{ partnerInfo.score }}
          </template>
        </van-card>
      </van-dialog>

      <van-dialog
          use-slot
          title="绑定"
          v-model:show="showShareCode"
          confirm-button-text="绑定"
          show-cancel-button
          @confirm="submitBind"
      >
        <van-cell-group>
          <van-field
              class="mine-share-code"
              :value="partnerInfo.shareCode"
              label="您的专属码"
              disabled
              :border= "false"
          />
          <van-field
              required
              type="digit"
              v-model:value="targetShareCode"
              clearable
              label="对方专属码"
              placeholder="您对象的邀请码"
          />
        </van-cell-group>
      </van-dialog>
    </div>
    <Tabbar/>
  </div>
</template>

<script>
import Tabbar from '@/page/tabbar/Index.vue'
import Plate from '@/page/Plate/index.vue'
import { getUserInfo, setToken, cleanToken } from '../../utils/authUtils'
import API_USER from '@/apis/user'
import Clipboard from 'clipboard';
import { Toast, Dialog } from 'vant';

export default {
  name: 'index',
  components: { Tabbar, Plate },
  data() {
    return {
      detailData: {},
      showPartner: false,
      showShareCode: false,
      targetShareCode: '',
      partnerInfo: {
        nickName: '',
        image: '',
        score: 0
      },
      toolList: [
        { icon: 'shop-o', title: '商品', path: '/admin/productList' },
        { icon: 'like-o', title: '积分任务', path: '/admin/taskList' },
        { icon: 'orders-o', title: '申请列表', path: '/admin/apply' },
        // { icon: 'newspaper-o', title: '海报', path: '/admin/brand' },
      ]
    }
  },
  beforeMount() {
    this.getDetail()
  },
  methods: {
    clientMain() {
      console.log('clientMain')
      if (!this.detailData.image) {
        wx.getUserProfile({
          desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          fail: (err) => {
            console.log(err)
          },
          success: (res) => {
            console.log(res)
            const avatarUrl = res.userInfo.avatarUrl
            const nickName = res.userInfo.nickName
            const formdata = {
              nickname: nickName,
              image: [{
                content: '',
                url: avatarUrl
              }]
            }
            API_USER.edit(formdata).then(res => {
              this.getDetail()
            })
          },
        })
      }
    },
    getDetail() {
      API_USER.detail()
          .then(res => {
            this.detailData = res
          })
    },
    showPartnerButton(e) {
      // 获取微信头像
      if (!this.detailData.image) {
        wx.getUserProfile({
          desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          fail: (err) => {
            console.log(err)
          },
          success: (res) => {
            console.log(res)
            const avatarUrl = res.userInfo.avatarUrl
            const nickName = res.userInfo.nickName
            const formdata = {
              nickname: nickName,
              image: [{
                content: '',
                url: avatarUrl
              }]
            }
            API_USER.edit(formdata).then(res => {
              this.getDetail()
            })
          },
        })
      }
      API_USER.getPartnerDetail().then(res => {
        console.log(res)
        const {hasPartner, nickName, image, score} = res;
        this.partnerInfo = res;
        if (hasPartner) {
          this.showPartner = true
        } else {
          Dialog.alert({
            title: '提示',
            message: '绑定对象后:\n' +
                '1.您添加的[商品]将只会出现在您对象[兑换]列表中\n' +
                '2.您添加的[任务]会只出现在您对象的[赚积分]列表中\n' +
                '3.[发现]页将展示您和您对象的动态\n' +
                '4.同时您对象添加的[商品]和[任务]也会出现在您的列表中'
          }).then(() => {
            this.showShareCode = true
          })
        }
      })
    },
    submitBind() {
      console.log('submitBind')
      API_USER.bind({
        shareCode: this.targetShareCode
      }).then(res => {
        this.getDetail()
      })
    },
    getWechatName(e) {
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        fail: (err) => {
          console.log(err)
        },
        success: (res) => {
          console.log(res)
          const avatarUrl = res.userInfo.avatarUrl
          const nickName = res.userInfo.nickName
          const formdata = {
            nickname: nickName,
            image: [{
              content: '',
              url: avatarUrl
            }]
          }
          console.log('edit user')
          console.log(formdata)
          API_USER.edit(formdata).then(res => {
            this.getDetail()
          })
        },
      })
    },
    goPage(path, query) {
      this.$router.push({ path, query })
    },
  },
}
</script>

<style lang="less">
@import '/src/styles/variable.less';

.style-box() {
  box-sizing: border-box;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.detail-header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 180px;
  color: #fff;
  //background-color: var(--brand-color);
  background-color: #ff5179;
  overflow: hidden;

  &-bg {
    box-sizing: border-box;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;

    &-wave {
      position: absolute;
      left: 0;
      bottom: -20px;
      width: 100%;
    }
  }

  &-inner {
    box-sizing: border-box;
    position: absolute;
    top: 30px;
    width: 100%;
    padding: 0 15px;
    display: flex;
    align-items: center;
    z-index: 20;
  }

  &-tag {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
    box-sizing: border-box;
    width: auto;
    padding: 2px 8px;
    color: #fff;
    font-size: 12px;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 10px 0 0 10px;
    z-index: 20;

    &-icon {
      margin-right: 5px;
    }
  }

  &-avatar {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 10px;

    &.active {
      transform: rotate(666turn);
      transition-delay: 1s;
      transition-property: all;
      transition-duration: 60s;
      transition-timing-function: cubic-bezier(0.34, 0, 0.84, 1);
    }
  }

  &-nick {
    font-size: 20px;
    max-width: 200px;
    height: 30px;
    line-height: 30px;
  }

  &-sub {
    font-size: 12px;
    line-height: 24px;
    color: #fff;
    display: flex;
    align-items: center;

    &-item {
      display: flex;
      align-items: center;

      &-separate {
        display: inline-flex;
        margin: 0 5px 0 5px;
      }

      &-icon {
        margin-right: 5px;
      }
    }
  }
}

.detail-mb10 {
  margin-bottom: 10px;
}

.detail-group {
  .style-box();
  margin: 0 15px 15px 15px;

  &-inner {
    padding: 10px 0;
  }
}

.detail-group {
  &-header {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    height: 48px;
    padding: 0 15px;

    &-hd {
      //color: var(--gray-color-8);
      color: #323233;
      text-align: left;
      font-size: 14px;
      font-weight: bold;
    }

    &-bd {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      font-size: 12px;
      color: #969799;
    }

    &-arrow {
      margin-left: 2px;
      font-size: 14px;
    }
  }
}

.detail-tool {
  &-list {
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    &-item {
      box-sizing: border-box;
      width: 25%;
      text-align: center;
      padding: 10px 0;

      .van-icon {
        font-size: 24px;
        margin-bottom: 5px;
      }

      &-title {
        color: var(--gray-color-8);
        font-size: 12px;
      }
    }
  }
}


.detail-count {
  &-list {
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;

    &-item {
      box-sizing: border-box;
      flex: 1;
      padding: 10px 0;
      text-align: center;

      &-value {
        font-size: 16px;
        font-weight: bold;
        color: #141414;
        margin-bottom: 10px;
      }

      &-label {
        font-size: 12px;
        color: var(--gray-color-7);
      }
    }
  }
}
</style>
