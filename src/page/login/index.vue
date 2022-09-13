<template>
  <div class="container">
    <div class="main">
      <div v-if="!isMiniprogram()">
        <div class="h2">{{ loginProvider.h2 }}</div>
        <div class="safe-tips">为了你的帐号安全，请用手机号登录</div>
        <div class="form">
          <div class="form-item">
            <div class="form-item-country">中国 +86</div>
            <van-field
                v-model="mobile"
                class="form-field"
                :border="false"
                type="tel"
                placeholder="请输入手机号"
                clearable
            />
          </div>
          <div class="form-item">
            <van-field
                v-model="pwd"
                class="form-field"
                :border="false"
                type="password"
                placeholder="请输入密码"
                clearable
            />
          </div>
          <van-button
              class="form-submit"
              block
              :loading="submitLoading"
              loading-text="登录中..."
              type="primary"
              @click="onSubmit"
          >登录</van-button
          >
        </div>

      </div>
      <div v-else>
        <van-button
            class="form-submit"
            block
            :loading="submitLoading"
            loading-text="登录中..."
            type="primary"
            @click="loginWechat"
        >登录</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import USER, { login } from '../../apis/user'
import { Dialog, Toast } from 'vant';
import {getUserInfo, setToken, cleanToken} from '../../utils/authUtils'
export default {
  name: 'index',
  computed: {
    // isMiniprogram() {
    //   return process.env.NODE_ENV!=='development'
    // },
  },
  data() {
    return {
      loginProvider: {
        h2: '帐号密码登录'
      },
      submitLoading: false,
      mobile: '',
      pwd: ''
    }
  },
  mounted() {
    if (this.isMiniprogram()) {
      this.loginWechat()
    }
  },
  methods: {
    isMiniprogram() {
      return process.env.NODE_ENV!=='development'
    },
    isMobile(val) {
      const value = val.replace(/[^-|\d]/g, '');
      return /^((\+86)|(86))?(1)\d{10}$/.test(value) || /^0[0-9-]{10,13}$/.test(value);
    },
    onSubmit() {
      console.log('on submit')
      if (!this.isMobile(this.mobile)) {
        Toast('手机号格式错误');
        return;
      }
      USER.login({
        phone: this.mobile,
        password: this.pwd,
      }).then(res => {
        console.log(res)
        this.loginSuccess(res)
      })
    },
    loginWechat() {
      wx.login({
        success: (res) => {
          console.log('get code')
          USER.loginMiniApp({
            'code': res.code
          }).then(loginvo => {
            console.log('get login vo ')
            this.loginSuccess(loginvo)
          })
        },
      })
    },

    loginSuccess(loginvo) {
      console.log('start replace push')
      const token = loginvo.token
      const nickname = loginvo.nickname
      setToken(token, nickname);
      this.$router.replace({path:'/signin'})
    }
  }
}
</script>

<style lang="less" scoped>
@import '/src/styles/variable.less';
.container {
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 30px;
}

.h2 {
  margin-top: 40px;
  font-size: 24px;
  font-weight: bold;
  color: var(--gray-color-8);
  line-height: 24px;
}

.safe-tips {
  font-size: 14px;
  color: var(--gray-color-6);
  margin-top: 20px;
  line-height: 14px;
}

.main {
  flex: 1;
  min-height: 420px;
}

.form {
  &-item {
    padding: 20px 0 10px;
    border-bottom: 1px solid @border-color;
    display: flex;
    align-items: center;
    font-size: 14px;

    &-country {
      padding-right: 10px;
      margin-right: 10px;
      color: var(--gray-color-8);
      position: relative;

      &::after {
        display: block;
        content: ' ';
        width: 1px;
        height: 14px;
        background: @border-color;
        position: absolute;
        top: 50%;
        margin-top: -7px;
        right: 0;
      }
    }
  }

  &-field {
    flex: 1;
    background: none;
    padding: 0;
  }

  &-submit {
    margin-top: 30px;
    font-size: 16px;
  }
}

.sms-btn {
  color: #38f;
  font-size: 14px;
  margin-left: 10px;

  &.countdown {
    font-size: 12px;
    color: var(--gray-color-6);
  }
}

.check-type {
  box-sizing: border-box;
  padding: 20px 0;
  font-size: 12px;
  color: #38f;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &-separate {
    display: inline-flex;
    color: @border-color;
    margin: 0 5px 0 5px;
  }
}

.footer {
  margin-bottom: 30px;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);

  &-agreement {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: var(--gray-color-6);

    .van-checkbox {
      margin-right: 6px;
    }

    a {
      color: #38f;
    }
  }
}
</style>
