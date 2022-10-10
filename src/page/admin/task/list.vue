<template>
  <div class="container">
    <van-nav-bar
        title="签到列表"
        right-text="添加"
        @click-right="onClickRight"
    />

    <van-swipe-cell v-for="(item, index) in list" :key="item.id">
      <div class="admin-task-list-item van-hairline--bottom">
        <div class="admin-task-list-item-hd" @click="edit(item)">
          <div class="admin-task-list-item-title">{{ item.name }}</div>
          <van-tag type="danger">{{ statusToText[item.status] }}</van-tag>
        </div>
        <div :class="['admin-task-list-item-bd', item.behavior ? 'admin-task-c-red' : 'admin-task-c-green']">
          <span>{{ item.behavior ? '' : '+' }}</span>
          <span>{{ item.score }}</span>
        </div>
      </div>
      <template #right>
        <van-button square type="danger" text="删除" style="height: 100%" @click="del(item.id)"/>
        <!--        <van-button square type="primary" text="收藏" style="height: 100%"/>-->
      </template>
    </van-swipe-cell>
    <!--      修改内容-->
    <van-action-sheet v-model:show="showEditTable" :title="tableTitle" style="height: 100%">

      <van-form>
        <van-cell-group inset>
          <van-field
              v-model="form.name"
              name="名称"
              label="名称"
              placeholder="名称"
              :rules="[{ required: true, message: '请输入名称' }]"
          />

          <van-field
              v-model="form.score"
              type="digit"
              name="积分"
              label="积分"
              placeholder="积分"
              :rules="[{ required: true, message: '请输入积分' }]"
          />
          <van-field name="status" label="状态">
            <template #input>
              <van-radio-group v-model="form.status" direction="horizontal">
                <van-radio :name="0">启用</van-radio>
                <van-radio :name="1">禁用</van-radio>
              </van-radio-group>
            </template>
          </van-field>


        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit" @click="submit">
            提交
          </van-button>
        </div>
        <div style="margin: 16px;">
          <van-button round block type="danger" native-type="submit" @click="del(form.id)">
            删除
          </van-button>
        </div>
      </van-form>

    </van-action-sheet>


    <tabbar></tabbar>
  </div>

</template>

<script>
import Tabbar from '@/page/tabbar/Index.vue'
import { Dialog } from 'vant'
import { Toast } from 'vant'
import API_TASK from '@/apis/task'
import API_USER from '@/apis/user'

export default {
  name: 'list',
  components: {
    Tabbar,
  },
  data() {
    return {
      list: [],
      showEditTable: false,
      statusToText: {
        0: '正常',
        1: '已禁用',
      },
      typeToText: {
        0: '每日任务',
        1: '限制次数',
        2: '限制日期',
      },
      form: {},
      tableTitle: '修改',
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    onClickLeft() {
      history.back()
    },
    onClickRight() {
      // Toast('按钮');
      this.add()
    },
    getList() {
      // cordova.plugins.notification.local.schedule({title:"标题",text:"内容",foreground:true});
      API_TASK.adminTaskList()
          .then(res => {
            const data = res
            this.list = data
          })
    },
    edit(item) {
      this.form = {
        id: item.id,
        status: item.status,
        name: item.name,
        score: item.score,
      }
      this.tableTitle = '修改'
      this.showEditTable = true
    },
    add() {
      API_USER.getPartnerDetail()
          .then(res => {
            const { hasPartner, nickName, image, score } = res
            if (hasPartner) {
              this.tableTitle = '添加的任务出现在对方赚积分列表中'
            } else {
              this.tableTitle = '添加的任务出现在自己赚积分列表中'
            }
          })
      this.form = {}
      this.form.status = 0
      this.showEditTable = true
    },
    del(id) {
      Dialog.confirm({
        title: '确定删除吗？',
      })
          .then(() => {
            API_TASK.del({
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
      if (!this.form.id) {
        // add
        API_TASK.add(this.form)
            .then(res => {
              Toast('新增成功')
              this.getList()
              this.showEditTable = false
            })
      } else {
        // edit
        API_TASK.edit(this.form)
            .then(res => {
              Toast('修改成功')
              this.getList()
              this.showEditTable = false
            })
      }
    },
  },
}
</script>

<style lang="less">

.admin-task-list-item {
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 15px;
  background: var(--white);

  &-hd {
    flex: 1;
  }

  &-bd {
    // flex:1;
  }

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

.admin-task-c-red {
  color: var(--red-color);
}

.admin-task-c-green {
  color: var(--green-color);

}
</style>
