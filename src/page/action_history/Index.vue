<template>
  <div>
    <div class="action-messages">
      <van-list
          :finished=finished
          :finished-text="finished_text"
      >
        <div v-for="(item, messageIndex) in messages" :key="messageIndex" class="action-message-item">
          <div class="action-message-item-box">
            <div class="action-user">
              <div :id="item.sn" class="action-identicon">
                <img :src="item.headerImage" alt="">
              </div>
            </div>
            <div class="action-msg-container">
              <div class="action-name">{{ item.nickName }}</div>
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
              <div class="action-desc" style="margin-top: 10px">
                <div style="height: 10px; line-height: 10px">
                  {{ item.time }}
                </div>
                <div style="height: 10px; position: relative" v-show="false">
                  <div class="action-popover-action" v-show="showIndex === messageIndex" style="display: inline-block; height: 10px; position: absolute; right: 10px; width: 142px; bottom: 4px">
                    <div class="action-star" @click="toStar" style="display: inline-block">
                      <van-icon name="like-o"/>&nbsp;赞
                    </div>
                    <div class="action-line" style="display: inline">&nbsp;&nbsp;|&nbsp;&nbsp;</div>
                    <div class="action-comment" @click="toComment" style="display: inline-block">
                      <van-icon
                          name="smile-comment-o"
                          size="16px"
                      />&nbsp;评论
                    </div>
                  </div>
                  <div class="action-support" @click="clickSupport(messageIndex)" style="display: inline-block; height: 10px; position: absolute; right: 10px; width: 20px; bottom: 0px" v-show="false">
                    <span>·&nbsp;·</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-list>
      <van-button style="display: block;margin: 0 auto; width: 50%" v-show="!finished" @click="clickMore">点击查看更多</van-button>
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
      finished_text: '小程序端暂时仅展示近3个月的数据',
      finished: true,
      page: 1,
      pageSize: 40,
      messages: [],
      allMessages: [],
      showIndex: -1,
      loading: false
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
    getListFromCache() {
      this.messages = getActionList()
    },
    clickSupport(index) {
      if (this.showIndex !== index) {
        this.showIndex = index
      } else {
        this.showIndex = -1
      }
    },
    getList() {
      API_ACTION.get_list()
          .then(res => {
            if (res.length === 0) {
              this.finished_text = '暂无数据'
            }
            this.page = 1
            this.messages = res.slice(0, this.pageSize)
            setActionList(this.messages.slice(0, 20))
            this.allMessages = res
            if (this.messages.length === this.allMessages.length) {
              this.finished = true
            } else {
              this.finished = false

            }
          })
    },
    clickMore() {
      this.page += 1
      const start = (this.page - 1) * this.pageSize
      this.messages = this.allMessages.slice(0, start + this.pageSize)
      if (this.messages.length === this.allMessages.length) {
        this.finished = true
      }
    },
    getBeforeNowCount(item_time) {
      return item_time
    },
    onLoad () {
      console.log('on load ')
      setTimeout(() => {
        this.loading = true
      }, 500)
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
