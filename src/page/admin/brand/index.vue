<template>
  <div class="container">

    <div class="main">
      <van-nav-bar
          title="轮播列表"
          right-text="添加"
          @click-right="add"
      />
      <van-list
          class="admin-brand-list"
          v-if="list.length > 0"
      >
        <van-swipe-cell v-for="item in list" :key="item.id" style="margin-top: 20px">

          <van-card
              currency=""
              :tag="statusToText[item.status]"
              :title="item.name"
              @click="edit(item)"
              :thumb="item.url"
          >
            <template #price>
              <!--              积分： {{ item.score }}-->
            </template>

          </van-card>
          <template #right>
            <van-button square text="删除" type="danger" class="admin-brand-delete-button"
                        style="top: 50%; transform: translate(0, -90%)" @click="del(item)"/>
          </template>
        </van-swipe-cell>
      </van-list>
      <!--      修改内容-->
      <van-empty v-else class="empty" :description="listEmptyText"></van-empty>
    </div>


    <!--      修改内容-->
    <van-action-sheet v-model:show="showEditTable" :title="tableTitle" style="height: 100%" @close="onCloseSheet">

      <van-form >
        <van-cell-group inset>
          <van-field
              v-model="form.name"
              name="名称"
              label="名称"
              placeholder="名称"
              :rules="[{ required: true, message: '请输入名称' }]"
          />
          <van-field name="图片/视频" label="图片/视频" @click="chooseWxImageShop">
          <template #input>
              <van-uploader v-model="form.image" preview-size="5rem" max-count="1" accept="media"
                            :preview-full-image="false"
              />
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
        </van-cell-group>
        <div v-if="showvideoplay">
          <video
              controls
              preload="auto"
              style="width:100%;height:200px;object-fit: contain;"
              :src="videourl"
              v-if="videourl"
              muted
          ></video>
        </div>
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit" @click="submit" :disabled="buttonDisable">
            提交
          </van-button>
        </div>
      </van-form>

    </van-action-sheet>
    <Tabbar/>

  </div>
</template>

<script>
import Tabbar from '@/page/tabbar/Index.vue'
import API_BRAND from '@/apis/brand'
import { Dialog, Toast } from 'vant'
import { getUserInfo } from '../../../utils/authUtils'

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
      buttonDisable: false,
      showvideoplay: false,
      videourl: '',
      form: {
        id: 0,
        status: 0,
        name: '',
        score: 1,
        num: 1,
        image: [],
      },
      list: [],
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    editTable() {
      this.showvideoplay = false
      this.showEditTable = true
    },
    onCloseSheet() {
      this.showvideoplay = false
    },
    edit(item) {
      const imageItem = {
        id: item.image,
        name: item.url,
        //前面这几个的id、name、path、type有没有都无所谓，命名也无所谓
        //但是下面这两个必须是url和file
        url: item.url, //这个url请求后台获取二进制流文件，使图片可以回显出来
        // file: new File([], item.name, {}), //就是这个new File([], item.attachmentName, {}),有他就可以回显文件名称了
      }
      const hasExpireDays = !!item.expireDays

      this.form = {
        id: item.id,
        status: item.status,
        name: item.name,
        image: [imageItem],
      }
      console.log('form' + this.form.preview_cover)
      this.tableTitle = '修改'
      this.showEditTable = true
    },
    add() {
      this.form = {}
      this.form.status = 0
      this.tableTitle = '添加'
      this.showEditTable = true
      this.showvideoplay = false
    },
    del(item) {
      let id = item.id
      Dialog.confirm({
        title: '确定删除吗？',
      })
          .then(() => {
            console.log('iu ')
            API_BRAND.del({
              id: id,
            })
                .then(res => {
                  Toast('删除成功')
                  this.getList()
                })
          })
    },
    isVideoOrImage(file) {
      let name
      if (!file.name) {
        name = file.file.name.toLowerCase()
      } else {
        name = file.name.toLowerCase()
      }
      console.log(name)
      if (!name) return false
      const imgType = ['gif', 'jpeg', 'jpg', 'bmp', 'png']
      const videoType = ['avi', 'wmv', 'mkv', 'mp4', 'mov', 'rm', '3gp', 'flv', 'mpg', 'rmvb']
      if (RegExp('\.(' + imgType.join('|') + ')$', 'i')
          .test(name.toLowerCase())) {
        return 'image'
      } else if (RegExp('\.(' + videoType.join('|') + ')$', 'i')
          .test(name.toLowerCase())) {
        this.videourl = file.content
        return 'video'
      } else {
        return false
      }
    },
    handleBeforeRead(file) {
      const isVideoOrImage = this.isVideoOrImage(file)
      if (isVideoOrImage === 'video' || isVideoOrImage === 'image') {
        return true
      }
      return false
    },
    handleAfterRead(file) {
      console.log('after read')
      this.form.name = file.file.name
    },
    handleDelete() {
      console.log('handleDelete')
      this.showvideoplay = false
    },
    submit() {
      const data = this.form
      this.buttonDisable = true
      const {token} = getUserInfo()
      const baseUrl = process.env.VUE_APP_BASE_URL
      console.log(data)
      if (data.filePath) {
        wx.uploadFile({
          url: baseUrl + '/api/admin/brand/miniAppEditOrCreate?token=' + token, //上传地址
          filePath: data.filePath,//上传图片路径
          name: 'file',
          formData: data,
          success: res => {
            console.info(res)
            if (!this.form.id) {
              Toast('新增成功')
              this.getList()
              this.showEditTable = false
              this.buttonDisable = false
            } else {
              Toast('修改成功')
              this.form = {}
              this.getList()
              this.showEditTable = false
              this.buttonDisable = false
            }
          },
          fail: err => {
            console.log(err)
          },
        })
      } else {

        if (!this.form.id) {
          this.form.id = null
          // add
          API_BRAND.editOrCreate(this.form)
              .then(res => {
                Toast('新增成功')
                this.getList()
                this.showEditTable = false
                this.buttonDisable = false
              })
        } else {
          // edit
          API_BRAND.editOrCreate(this.form)
              .then(res => {
                Toast('修改成功')
                this.form = {}
                this.getList()
                this.showEditTable = false
                this.buttonDisable = false
              })
              .catch(err => {
                console.log(err)
              })
        }
      }
    },
    onClickLeft() {
      history.back()
    },
    getList() {
      API_BRAND.listAdmin()
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
              id: res.tempFiles[0].path,
              name: '图片',
              url: res.tempFiles[0].path, //这个url请求后台获取二进制流文件，使图片可以回显出来
            }]
          }
        },
      })
    },
  },
}
</script>

<style lang="less">
.admin-brand-list-item {
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 15px;
  background: var(--white);

  &-hd {
    flex: 1;
  }

  // &-bd {
  //   flex: 1;
  // }

  &-title {
    margin-bottom: 5px;
    font-size: 16px;
    color: var(--gray-color-8);
  }

  &-txt {
    font-size: 14px;
    color: var(--gray-color-6);
  }
}


//.editContent {
//  padding: 16px 16px 16px;
//}
</style>
