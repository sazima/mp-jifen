<template>
  <div class="container">

    <div class="main">
      <van-nav-bar
          title="商品列表"
          right-text="添加"
          @click-right="add"
      />
      <van-list
          class="list"
          v-if="list.length > 0"
      >
        <van-swipe-cell v-for="item in list" :key="item.id" style="margin-top: 20px">

          <van-card
              :price="item.score"
              currency="积分"
              :tag="statusToText[item.status]"
              :title="item.productName"
              :thumb="item.image"
              @click="edit(item)"
          >
            <template #price>
              积分： {{ item.score }}
            </template>
          </van-card>
          <template #right>
            <van-button square text="删除" type="danger" class="delete-button"
                        style="top: 50%; transform: translate(0, -90%)" @click="del(item.id)"/>
          </template>
        </van-swipe-cell>
      </van-list>
      <!--      修改内容-->
      <van-empty v-else class="empty" :description="listEmptyText"></van-empty>
    </div>


    <!--      修改内容-->
    <van-action-sheet v-model:if="showEditTable" :title="tableTitle" style="height: 100%">

      <van-form ref="form">
        <van-cell-group inset>
          <van-field
              v-model="form.productName"
              name="名称"
              label="名称"
              placeholder="名称"
              :rules="[{ required: true, message: '请输入名称' }]"
          />
          <van-field
              v-model="form.desc"
              name="描述"
              label="描述"
              placeholder="描述"
              :rules="[{ required: true, message: '请输入描述' }]"
          />
          <van-field
              v-model="form.score"
              type="digit"
              name="积分"
              label="积分"
              placeholder="积分"
              :rules="[{ required: true, message: '请输入积分' }]"
          />
          <van-field
              v-model="form.num"
              type="digit"
              name="数量"
              label="数量"
              placeholder="数量"
              :rules="[{ required: true, message: '请输入数量' }]"
          />
          <van-field name="图片" label="图片" @click="chooseWxImageShop">
            <template #input >
              <van-uploader v-model="form.image" preview-size="5rem" max-count="1" :preview-full-image="false"/>
            </template>
          </van-field>

          <van-field name="status" label="上架状态">
            <template #input>
              <van-radio-group v-model="form.status" direction="horizontal">
                <van-radio :name="0">启用</van-radio>
                <van-radio :name="1">禁用</van-radio>
              </van-radio-group>
            </template>
          </van-field>

          <van-field name="其他限制" label="其他限制" v-if="false">
            <template #input>
              <van-switch v-model="form.checked"/>
            </template>
          </van-field>
          <van-field v-if="form.checked"
                     v-model="form.expireDays"
                     type="digit"
                     name="过期天数"
                     label="天数"
                     placeholder="兑换后卡券在指定天数内使用"
                     :rules="[{ required: true, message: '请输入天数' }]"
          />

        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit" @click="submit">
            提交
          </van-button>
        </div>
        <div style="margin: 16px;">
          <van-button round block type="danger" native-type="submit" @click="del(form.id)" >
            删除
          </van-button>
        </div>
      </van-form>
    </van-action-sheet>
    <Tabbar/>

  </div>
</template>

<script>
import Tabbar from '@/page/tabbar/Index.vue'
import API_PRODUCT from '@/apis/product'
import API_USER from '@/apis/user'
import { Dialog, Toast } from 'vant'
import {getUserInfo, setToken, cleanToken} from '../../../utils/authUtils'

export default {
  components: {
    Tabbar,
  },
  data() {
    return {
      listEmptyText: '暂无数据',
      listEmptyImage: '',
      tableTitle: '编辑',
      showEditTable: false,
      statusToText: {
        0: '正常',
        1: '已禁用',
      },
      form: {
        id: 0,
        status: 0,
        productName: '',
        score: 1,
        num: 1,
        image: [
          {
            id: 'image',
            name: '图片',
            url: '', //这个url请求后台获取二进制流文件，使图片可以回显出来
            file: ''
          }
        ],
        filePath: '',
      },
      list: [],
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    initform() {
      this.form = {
        id: 0,
        status: 0,
        productName: '',
        score: 1,
        num: 1,
        image: [
          {
            id: 'image',
            name: '图片',
            url: '', //这个url请求后台获取二进制流文件，使图片可以回显出来
            file: ''
          }
        ],
        filePath: '',
      }
    },
    edit(item) {
      const imageItem = {
        id: 'image',
        name: '图片',
        url: item.image, //这个url请求后台获取二进制流文件，使图片可以回显出来
        // file: new File([], item.productName, {}) //就是这个new File([], item.attachmentName, {}),有他就可以回显文件名称了
        file: '',
      }
      const hasExpireDays = !!item.expireDays
      this.showEditTable = true

      this.form = {
        id: item.id,
        status: item.status,
        checked: hasExpireDays,
        expireDays: item.expireDays,
        productName: item.productName,
        score: item.score,
        num: item.num,
        desc: item.desc,
        image: [imageItem],
      }
      console.log('form')
      console.log(this.form)
      this.tableTitle = '修改'
    },
    clickPreview() {
    },
    add() {
      API_USER.getPartnerDetail()
          .then(res => {
            console.log(res)
            const { hasPartner, nickName, image, score } = res
            if (hasPartner) {
              this.tableTitle = '添加的商品出现在对方积分兑换列表中'
            } else {

              this.tableTitle = '添加的商品出现在自己积分兑换列表中'
            }
          })
      this.form = {
        image: [
          {
            id: 'image',
            name: '图片',
            url: '', //这个url请求后台获取二进制流文件，使图片可以回显出来
            file: ''
          }]
      }
      this.form.status = 0
      this.showEditTable = true
    },
    del(id) {
      // let id = item.id
      Dialog.confirm({
        title: '确定删除吗？',
      })
          .then(() => {
            console.log('iu ')
            API_PRODUCT.del({
              id: id,
            })
                .then(res => {
                  Toast('删除成功')
                  this.showEditTable = false
                  this.getList()
                })
          })
    },
    submit() {
      this.$refs.form.validate().then(res=> {
        console.log('this.$refs.form.validate')
        console.log(res)
        const data = this.form
        const {token} = getUserInfo()
        const baseUrl = process.env.VUE_APP_BASE_URL
        console.log(data)
        if (data.image.length === 0) {
          Toast('无图片')
          return
        }
        if (!data.filePath && !data.image[0].url) {
          Toast('无图片')
          return
        }
        console.log('-------------------' + data.filePath)
        if (data.filePath) {
          const url = baseUrl + '/mp-api/admin/product/miniAppEditOrCreate?token=' + token
          console.log('upload url ' + url)
          wx.uploadFile({
            url: baseUrl + '/mp-api/admin/product/miniAppEditOrCreate?token=' + token, //上传地址
            filePath: data.filePath,//上传图片路径
            name: 'file',
            formData: data,
            success: res => {
              console.info(res);
              const resData = res.data
              const resJson = JSON.parse(resData)
              if (resJson.code !== 0) {
                Toast(resJson.msg)
                return
              }
              if (!this.form.id) {
                Toast('新增成功')
                this.showEditTable = false
                this.getList()
              } else {
                Toast('修改成功')
                this.showEditTable = false
                this.getList()
              }
            },
            fail: err => {
              console.log(err)
            }
          })
        } else {
          API_PRODUCT.editOrCreate(this.form, token).then(res => {
            console.log(res)
            if (!this.form.id) {
              Toast('新增成功')
              this.getList()
              this.showEditTable = false
            } else {
              Toast('修改成功')
              this.getList()
              this.showEditTable = false
            }
          })

        }

      }).catch(err => {
        console.log('this.$refs.form.validate.err')
        console.log(err)
      })
    },
    onClickLeft() {
      history.back()
    },
    getList() {
      API_PRODUCT.adminProductList()
          .then(res => {
            this.list = res
          })
    },
    //a：选择的类型  //album:相册   //camera拍照
    chooseWxImageShop() {
      console.log(this.form)
      const type = 'album'
      console.log('chooseWxImageShop' + type)
      const that = this
      // var e = this;
      wx.chooseImage({
        sizeType: ['original', 'compressed'],
        sourceType: [type],//类型
        count: 1,
        success(res) {
          if (res.tempFiles[0].size > 2097152) {
            wx.showModal({
              title: '提示',
              content: '选择的图片过大，请上传不超过2M的图片',
              showCancel: !1,
              success(a) {
                a.confirm
              },
            })
          } else {
            //把图片上传到服务器
            console.log(res.tempFiles[0])
            that.form.filePath = res.tempFiles[0].path
            that.form.image = [{
              id: 'image',
              name: '图片',
              url: res.tempFiles[0].path, //这个url请求后台获取二进制流文件，使图片可以回显出来
              file: ''
            }]
            that.$set(that.form.image[0], `url`, res.tempFiles[0].path)
            // that.form.image[0].url = res.tempFiles[0].path
            console.log(that.form.image)
          }
        },
      })
    },
  },
}
</script>

<style lang="less">

.van-card__thumb {
  width: 88px;
  height: 88px;
}
</style>
