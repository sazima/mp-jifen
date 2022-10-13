<template>
  <div >
    <div class="action-messages">
      <van-list
          :finished="true"
          :finished-text="finished_text"
      >
        <div v-for="item in messages" :key="item.sn" class="action-message-item">
          <div class="action-message-item-box">
            <div class="action-user">
              <div :id="item.sn" class="action-identicon">
                <img :src="item.headerImage" alt="">
              </div>
            </div>
            <div class="action-msg-container">
              <div class="action-name">{{ item.nickName || '空昵称' }}</div>
              <div class="action-content">
                <div class="action-texts">{{ item.description }}</div>
                <div class="action-imgs" v-if="item.image && item.image.length">
                  <template v-for="(img, index) in item.image">
                    <img
                        :key="index"
                        :src="img"
                        alt=""
                        srcset=""
                        @click="showImg(item.image, { startPosition: index })"
                    />
                  </template>
                </div>
              </div>
              <div class="action-desc">
                <div>
                  {{ item.time }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </div>
    <!-- 底部导航栏 -->
    <Tabbar/>
  </div>
</template>
<script>
import { ImagePreview } from 'vant'
import { getActionList, setActionList } from '../../utils/authUtils'

import API_ACTION from '@/apis/action_history'

import Tabbar from '@/page/tabbar/Index.vue'

export default {
  components: { Tabbar },
  data() {
    return {
      finished_text: '仅展示近3个月的数据',
      messages: [],
    }
  },
  mounted() {
    this.getListFromCache()
    this.getList()
    window.addEventListener('wxshow', this.getList)
  },
  destroyed() {
    window.removeEventListener('wxshow', this.getList)
  },
  methods: {
    getListFromCache(){
      this.messages = getActionList()
    },
    getList() {
      API_ACTION.get_list()
          .then(res => {
            if (res.length === 0) {
              this.finished_text = '暂无数据'
            }
            this.messages = res
            setActionList(this.messages.slice(0, 21))
            // if (res.length >= 20) {
            //   this.messages = res.slice(0, 21)
            //   setActionList(this.messages)
            //   setTimeout(() => {
            //     this.messages = res
            //     console.log(this.messages)
            //   }, 200)
            // } else {
            //   this.messages = res
            //   setActionList(this.messages)
            // }
          })
    },
    getBeforeNowCount(item_time) {
      return item_time
    },
    showImg(imgs, option) {
      ImagePreview({
        images: imgs,
        startPosition: option ? option.startPosition || 0 : 0,
      })
    },
    toStar() {
      return ''
    },
    toComment() {

    },

  },
}

</script>
<style lang="less">

.action-messages {
  .action-message-item {
    width: 100%;
    position: relative;
    box-sizing: border-box;
    padding: 12px 16px;
    word-break: break-word;

    .action-message-item-box {
      display: flex;

      .action-user {
        flex: 0 0 40px;

        img {
          height: 35px;
          width: 35px;
          border-radius: 6px;
        }
      }

      .action-msg-container {
        flex: 1;
        padding-left: 4px;

        .action-name {
          color: #003a8c;
        }

        .action-content {
          padding: 10px 0;

          .action-texts {
            line-height: 1.4;
          }

          .action-imgs {
            padding-top: 14px;

            img {
              margin-right: 4px;
              margin-top: 2px;
              width: 80px;
              height: 80px;
            }
          }
        }

        .action-desc {
          color: #bfbfbf;
          font-size: 14px;
          display: flex;
          justify-content: space-between;

          .action-support {
            background: #f5f5f5;
            color: #003a8c;
            padding: 0 6px;
            font-weight: 700;
          }

          .action-popover {
            background: #000000;
            color: #ffffff;
          }
        }

        .action-stars {
          background: #f5f5f5;
          color: #003a8c;
          margin-top: 12px;
          border-radius: 2px;
          padding: 4px 8px;
          display: flex;

          .action-star-icon {
            margin-right: 8px;
          }
        }

        .action-comments {
          background: #f5f5f5;
          border-radius: 2px;
          padding: 4px 8px;
          position: relative;
          font-size: 14px;

          .action-comment-user {
            color: #003a8c;
          }

          //&::after {
          //.hairline-top(@border-color);
          //}
        }
      }
    }
  }

  .action-message-item + .action-message-item {
    //&::after {
    //  .hairline-top(@border-color);
    //}
  }
}
</style>
