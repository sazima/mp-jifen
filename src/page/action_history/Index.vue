<template>
  <div :appbar="false">
    <div class="action-header">
<!--      <img src="https://i.imgtg.com/2022/10/05/pT8o1.jpg" alt="" srcset="" />-->
<!--      <div class="action fl" >-->
<!--        <van-icon name="arrow-left" size="20" />-->
<!--      </div>-->
<!--      <div class="action fr" @click="toSendMessage">-->
<!--        <i class="iconfont iconcamera" style="font-size:20px"></i>-->
<!--      </div>-->
<!--      <div class="info">-->
<!--        <div class="info-box">-->
<!--          <img src="https://i.imgtg.com/2022/10/05/pT8o1.jpg"" alt="" srcset="" />-->
<!--          <div class="name">zhanzhan.wei</div>-->
<!--        </div>-->
<!--      </div>-->
    </div>
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
                        :key="img"
                        v-if="img"
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
                  {{
                         getBeforeNowCount(item.time)
                  }}
                </div>
                <!-- 弹出层 操作 点赞 评论 -->
                <div>
                  <van-popover  placement="left">
                    <div class="action-popover-action">
                      <div class="action-star" @click="toStar">
                        <van-icon name="like-o" />&nbsp;赞
                      </div>
                      <div class="action-line">|</div>
                      <div class="action-comment" @click="toComment">
                        <van-icon
                            name="smile-comment-o"
                            size="16px"
                        />&nbsp;评论
                      </div>
                    </div>
<!--                    <template #reference>-->
<!--                      <div class="support">-->
<!--                        <span>·&nbsp;·</span>-->
<!--                      </div>-->
<!--                    </template>-->
                  </van-popover>
                </div>
              </div>
<!--              <div class="stars" v-if="item.name === 'zhanzhan.wei'">-->
<!--                <span class="star-icon"-->
<!--                ><van-icon name="like-o" size="12"-->
<!--                /></span>-->
<!--                <div class="star-item">-->
<!--                  zhanzhan.wei-->
<!--                </div>-->
<!--              </div>-->
<!--              <div class="comments" v-if="item.name === 'zhanzhan.wei'">-->
<!--                <div class="comment-item">-->
<!--                  <span class="comment-user">zhanzhan.wei:</span>-->
<!--                  欢迎大家,有想法和建议随时找我联系，可留言可加V-->
<!--                </div>-->
<!--              </div>-->
            </div>
          </div>
        </div>
      </van-list>
    </div>
    <!-- 底部导航栏 -->
    <Tabbar/>
  </div>
</template>
<script >
import { ImagePreview } from 'vant'
import API_ACTION from '@/apis/action_history'

import Tabbar from '@/page/tabbar/Index.vue'
export default {
  components: { Tabbar },
  data() {
    return {
      finished_text: '仅展示近3个月的数据',
      messages: [ ]
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      API_ACTION.get_list().then(res => {
        if (res.length === 0) {
          this.finished_text = '暂无数据'
        }
        this.messages = res
      })
    },
    getBeforeNowCount(item_time) {
      return item_time
    },
    showImg(imgs, option) {
        ImagePreview({
          images: imgs,
          startPosition: option ? option.startPosition || 0 : 0
        });
    },
    toStar() {
      return ""
    },
    toComment() {

    },

  }
}

</script>
<style lang="less" >
.action-header {
  position: relative;
  padding-bottom: 50px;
  .action-action {
    position: absolute;
    color: #ffffff;
    top: 12px;
    &.fl {
      left: 12px;
    }
    &.fr {
      right: 12px;
    }
  }
  img {
    width: 100%;
  }
  .action-info {
    position: absolute;
    width: 100%;
    height: 80px;
    bottom: 0;
    z-index: 1;
    .action-info-box {
      position: relative;
      width: 100%;
      height: 100%;
      img {
        position: absolute;
        height: 70px;
        width: 70px;
        right: 12px;
        bottom: 30px;
        border-radius: 10px;
      }
      .action-name {
        position: absolute;
        right: 92px;
        bottom: 60px;
        color: #ffffff;
        font-weight: bold;
      }
    }
  }
}
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
