<template>
  <div class="hello-wrap" ref="goodsList">
    <div class="hello-content" style="position: relative;top: 5%;">
      <div class="hello-title">
      </div>
      <div class="luck-magic">
      </div>
      <div class="luck-times">
        剩余抽奖次数{{this.times}}
      </div>
      <div class="luck-top-bac">
        <div class="luck-top">
          <div v-for="(item) of luckData" :key="item.id" class="luck-item-wrap">
            <div v-if="item.id === -1" class="luck-item" @click="!luckable ? drawAward() : ''" :class="item.imgSrc">
              {{item.name}}
            </div>
            <div v-else class="luck-item" :class="item.active">
              {{item.name}}
            </div>
          </div>
          <!--<img style="width:100%;height:auto;" src="../../assets/luckDraw.jpg">-->
        </div>
      </div>
      <div style="margin-top: 20px;">
        <div class="change-address" @click="!luckable ? changeAddress() : ''"></div>
        <div class="click-history" @click="!luckable ? clickHistory() : ''"></div>
      </div>
      <div class="address-model-bottom" v-if="showAddress"></div>
      <div class="address-model" :class="this.addressModel" v-if="showAddress">
        <div>
          填写收货地址
        </div>
        <div class="address-model-item">
          <label>姓名：</label><el-input v-model="personMessage.personName" placeholder="姓名"></el-input>
        </div>
        <div class="address-model-item">
          <label>电话：</label><el-input v-model="personMessage.personPhone" placeholder="电话"></el-input>
        </div>
        <div class="address-model-item">
          <label>&nbsp;&nbsp;&nbsp;省：</label>
          <el-input v-model="sheng" placeholder="地址" :disabled="true"></el-input>
        </div>
        <div class="address-model-item">
          <label>&nbsp;&nbsp;&nbsp;市：</label>
          <el-input v-model="shi" placeholder="地址" :disabled="true"></el-input>
        </div>
        <div class="address-model-item">
          <label>&nbsp;&nbsp;&nbsp;区：</label>
          <el-input v-model="qu" placeholder="地址" :disabled="true"></el-input>
        </div>
        <div class="address-model-item">
          <label>街道：</label>
          <el-input v-model="personMessage.personAddress" placeholder="地址"></el-input>
        </div>
          <!--<el-select v-model="value" placeholder="请选择">-->
            <!--<el-option-->
              <!--v-for="item in options"-->
              <!--:key="item.value"-->
              <!--:label="item.label"-->
              <!--:value="item.value">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <div class="address-model-item">
          <label>备注：</label><el-input v-model="personMessage.personRemark" placeholder="备注"></el-input>
        </div>
        <el-row>
          <el-button size="mini" @click="!luckable ? cancelAddress() : ''">取消</el-button>
          <el-button size="mini" @click="!luckable ? submitAddress() : ''">确定</el-button>
        </el-row>
      </div>
    </div>
    <div class="address-model" :class="this.addressModel" v-show="showHistory" id="historyModel">
      <div style="max-height: 324px;overflow-y: auto;" id="goodsList">
        <i class="el-icon-close" style="float: right;" @click="showHistory = false"></i>
        <el-table
          :data="tableData"
          style="width: 100%;">
          <el-table-column
            prop="order_num"
            label="单号"
            width="170">
          </el-table-column>
          <el-table-column
            prop="content"
            label="奖品"
            width="130">
          </el-table-column>
        </el-table>
        <!--<el-pagination-->
          <!--layout="prev, pager, next"-->
          <!--small-->
          <!--@current-change="currentChange"-->
          <!--:currentPage="currentPage"-->
          <!--:pageSize="pageSize"-->
          <!--:pagerCount="pagerCount"-->
          <!--:total="totalCount">-->
        <!--</el-pagination>-->
      </div>
    </div>
  </div>
</template>

<script>
import Axios from 'axios'
import { API } from './contain'
export default {
  name: 'Lucking',
  directive: {},
  data () {
    return {
      showAddress: false,
      haveAddress: false,
      showHistory: false,
      loginId: '',
      times: '',
      luckData: [
      ],
      luckDataId: [
      ],
      current: 2,
      currentId: 0,
      speed: 200, // 速度
      diff: 15, // 速度增加的值
      award: {}, // 抽中的奖品
      time: 0, // 记录开始抽奖时的时间
      addressModel: '',
      messageBox: '',
      sheng: '辽宁省',
      shi: '沈阳市',
      qu: '大东区',
      personMessage: {
        personName: '',
        personPhone: '',
        personAddress: '',
        personRemark: ''
      },
      tableData: [
      ],
      currentPage: 1,
      pageSize: 5,
      pagerCount: 3,
      totalCount: 0,
      isScroll: true,
      luckable: false
    }
  },
  watch: {
    showHistory: {
      handler (curVal, oldVal) {
        if (curVal) {
          let _dom = document.getElementById('goodsList')
          _dom.addEventListener('scroll', this.scrollFunction)
        } else {
          let _dom = document.getElementById('goodsList')
          _dom.removeEventListener('scroll', this.scrollFunction)
          this.currentPage = 1
          this.tableData = []
          this.isScroll = true
        }
      },
      deep: true
    }
  },
  mounted () {
    let _self = this
    if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
      // alert('手机端')
      _self.messageBox = 'message-box-phone'
      _self.addressModel = 'address-model-phone'
    } else {
      // alert('pc端')
      _self.messageBox = 'message-box-pc'
      _self.addressModel = 'address-model-pc'
    }
    _self.loginId = _self.$route.params.id
    // _self.loginId = '111'
    _self.getLuckTimes()
    _self.getAddress()
    _self.getGoods()
  },
  methods: {
    // 获取收货地址
    getAddress () {
      let _self = this
      Axios.get(`${API}/gz/get_days_activity_address`, {
        headers: {
          'Authorization': _self.loginId
        }
      }).then(function (resp) {
        if (resp.data.code !== 405) {
          _self.haveAddress = true
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    // 获取抽奖次数
    getLuckTimes () {
      let _self = this
      Axios.get(`${API}/gz/get_lucky_draw`, {
        headers: {
          'Authorization': _self.loginId
        }
      }).then(function (resp) {
        if (resp.data.code === 200) {
          _self.times = resp.data.data
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    // 奖品
    getGoods () {
      let _self = this
      Axios.get(`${API}/gz/get_days_activity_prize`, {
        headers: {
          Authorization: _self.loginId
        }
      }).then(function (resp) {
        if (resp.data.code === 200) {
          let _luckData = []
          let _item = {}
          _self.luckDataId = []
          resp.data.data.forEach((item, index) => {
            if (index === 3) {
              _item = {
                id: -1,
                name: '',
                active: '',
                imgSrc: 'click-me'
              }
              _luckData.push(item)
              _self.luckDataId.push(item.id)
              _luckData.push(_item)
              _self.luckDataId.push(_item.id)
            } else {
              _self.$set(item, 'active', '')
              _luckData.push(item)
              _self.luckDataId.push(item.id)
            }
          })
          _self.luckData = _luckData
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    drawAward () {
      let _self = this
      _self.luckable = true
      // 抽奖
      Axios.get(`${API}/gz/get_participate_activity_result`, {
        headers: {
          'Authorization': _self.loginId
        }
      }).then(function (resp) {
        if (resp.data.code === 200) {
          _self.haveAddress = true
          // _self.times = resp.data.data
          _self.award = resp.data.data.info
          if (_self.times > 0 && _self.award.id) {
            _self.times = resp.data.data.luck_count
            // 开始抽奖
            _self.time = Date.now()
            _self.speed = 200
            _self.diff = 15
            // _self.times -= 1
            _self.move()
          } else if (_self.times > 0) {
            _self.award = {
              id: 8,
              name: '再接再厉'
            }
            _self.times = resp.data.data.luck_count
            // 开始抽奖
            _self.time = Date.now()
            _self.speed = 200
            _self.diff = 15
            // _self.times -= 1
            _self.move()
          } else {
            alert('对不起，您的抽奖次数不足！')
          }
        } else if (resp.data.code === 406) {
          _self.$alert(resp.data.message, {
            confirmButtonText: '确定',
            center: _self,
            customClass: _self.messageBox
          })
          _self.luckable = false
        } else if (resp.data.code === 405) {
          _self.haveAddress = false
          _self.luckable = false
          _self.addAddress()
        } else {
          _self.$alert('网络请求超时', {
            confirmButtonText: '确定',
            center: _self,
            customClass: _self.messageBox
          })
          _self.luckable = false
        }
      }).catch(function (error) {
        console.log(error)
      })
      // 请求接口, 这里我就模拟请求后的数据(请求时间为2s)
      // setTimeout(() => {
      // }, 2000)
    },
    move () {
      window.timeout = setTimeout(() => {
        let _self = this
        if (_self.currentId >= _self.luckDataId.length) {
          _self.current = _self.luckDataId[0]
          _self.currentId = 1
        } else {
          _self.current = _self.luckDataId[_self.currentId]
          _self.currentId++
        }
        _self.luckData.forEach(item => {
          if (item.id === _self.current && item.id !== -1) {
            item.active = 'active'
          } else {
            item.active = ''
          }
        })

        // 若抽中的奖品id存在，则开始减速转动
        if (_self.award.id && (Date.now() - _self.time) / 1000 > 4) {
          _self.speed += _self.diff
          // 若转动时间超过8秒，并且奖品id等于小格子的奖品id，则停下来！
          if (_self.luckData[_self.currentId - 1].id) {
            if ((Date.now() - _self.time) / 1000 > 6 && _self.luckData[_self.currentId - 1].id && _self.award.id === _self.luckData[_self.currentId - 1].id) {
              clearTimeout(window.timeout)
              setTimeout(() => {
                // alert(_self.award.name)
                let _message = _self.award.name !== '再接再厉' ? `恭喜您抽中了${_self.award.name}` : `再接再厉`
                _self.$alert(_message, {
                  confirmButtonText: '确定',
                  center: true,
                  customClass: this.messageBox
                })
                _self.luckable = false
              }, 0)
              return
            }
          } else if ((Date.now() - _self.time) / 1000 > 6) {
            _self.luckData.forEach(item => {
              if (item.id === 8) {
                item.active = 'active'
              } else {
                item.active = ''
              }
            })
            _self.award = {
              id: 8,
              name: '再接再厉'
            }
            clearTimeout(window.timeout)
            setTimeout(() => {
              let _message = _self.award.name !== '再接再厉' ? `恭喜您抽中了${_self.award.name}` : `再接再厉`
              _self.$alert(_message, {
                confirmButtonText: '确定',
                center: true,
                customClass: this.messageBox
              })
              _self.luckable = false
            }, 0)
            return
          }

          // 若抽中的奖品不存在，则加速转动
        } else {
          _self.speed -= 8 // 转动加速
        }

        _self.move()
      }, this.speed)
    },
    addAddress () {
      this.$confirm('您还没有收货地址, 是否现在填写?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        customClass: this.messageBox
      }).then(() => {
        this.showAddress = true
      }).catch(() => {
      })
    },
    cancelAddress () {
      this.showAddress = false
      this.personMessage = {
        personName: '',
        personPhone: '',
        personAddress: '',
        personRemark: ''
      }
    },
    submitAddress () {
      let _self = this
      let _allFlag = _self.personMessage.personAddress.length > 0 && _self.personMessage.personName.length > 0 && _self.personMessage.personPhone.length > 0
      let _noneFlag = _self.personMessage.personName.length < 1 ? '姓名' : _self.personMessage.personPhone.length < 1 ? '电话' : _self.personMessage.personAddress.length < 1 ? '地址' : ''
      if (_allFlag) {
        _self.showAddress = false
        Axios.post(`${API}/gz/send_days_activity_address`, {
          user_name: _self.personMessage.personName,
          phone_num: _self.personMessage.personPhone,
          address: _self.personMessage.personAddress,
          remark: _self.personMessage.personRemark
        }, {
          headers: {
            'Authorization': _self.loginId,
            'Content-Type': 'application/json'
          }
        }).then(function (resp) {
          if (resp.data.code === 200) {
            _self.$message({
              message: '恭喜你，地址编辑成功！',
              type: 'success',
              center: true,
              customClass: _self.messageBox
            })
            _self.getLuckTimes()
            _self.getAddress()
            _self.personMessage = {
              personName: '',
              personPhone: '',
              personAddress: '',
              personRemark: ''
            }
          } else {
            _self.$alert('网络请求超时', {
              confirmButtonText: '确定',
              center: _self,
              customClass: _self.messageBox
            })
          }
        }).catch(function (error) {
          console.log(error)
        })
      } else {
        alert(_noneFlag + '不能为空')
      }
    },
    changeAddress () {
      let _self = this
      _self.showAddress = true
      Axios.get(`${API}/gz/get_days_activity_address`, {
        headers: {
          'Authorization': _self.loginId
        }
      }).then(function (resp) {
        if (resp.data.code !== 405) {
          _self.personMessage.personName = resp.data.data.user_name
          _self.personMessage.personPhone = resp.data.data.phone_num
          _self.personMessage.personAddress = resp.data.data.address
          _self.personMessage.personRemark = resp.data.data.remark
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    clickHistory () {
      let _self = this
      _self.showHistory = true
      this.getCurrentHistory()
    },
    getCurrentHistory () {
      let _self = this
      Axios.get(`${API}/gz/get_lucky_user_order`, {
        params: {
          page: _self.currentPage,
          page_size: _self.pageSize
        },
        headers: {
          'Authorization': _self.loginId
        }
      }).then(function (resp) {
        if (resp.data.code === 200) {
          if (resp.data.data.data_list.length < 5) {
            resp.data.data.data_list.forEach(item => {
              _self.tableData.push(item)
            })
            _self.isScroll = false
          } else {
            resp.data.data.data_list.forEach(item => {
              _self.tableData.push(item)
            })
            // _self.tableData = resp.data.data.data_list
            _self.totalCount = resp.data.data.data_total
          }
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    scrollFunction () {
      if (this.$refs.goodsList.scrollHeight - this.$refs.goodsList.clientHeight - this.$refs.goodsList.scrollTop > 0) {
      } else {
        if (this.isScroll) {
          this.getCurrentHistory()
          this.currentPage += 1
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  body{
    margin: 0;
    padding: 0;
  }
  .hello-wrap{
    width: 100%;
    height: 100%;
    background: url("../../assets/装饰.png") lightsalmon;
    background-size: contain;
  }
  .hello-title{
    width: 82%;
    height: 80px;
    margin: 0 auto;
    background: url("../../assets/天天都是粉丝日.png") no-repeat;
    background-size:contain;
  }
  .luck-magic{
    width: 200px;
    height: 38px;
    margin: 0 auto;
    margin-top: 15px;
    background: url("../../assets/摇起来.png") no-repeat;
    background-size: contain;
  }
  .luck-times{
    width: 200px;
    height: auto;
    border: 2px solid #123;
    border-radius: 40%;
    margin: 0 auto;
  }
  .luck-top-bac{
    display: flex;
    width: 368px;
    height: 368px;
    flex-wrap: wrap;
    margin: 0 auto;
    background: url('../../assets/抽奖盒子.png') no-repeat;
    background-size:contain
  }
  .luck-top{
    display: flex;
    width: 270px;
    height: 268px;
    flex-wrap: wrap;
    margin: 0 auto;
    margin-top: 57px;
    margin-right: 52px;
  }
  .luck-item-wrap{
    width: 86px;
    height: 86px;
    line-height: 92px;
    display: block;
    /*border-radius: 50%;*/
    /*margin-top: 6px;*/
    /*margin-left: 3px;*/
    /*background-color: #333;*/
    /*color: #fff;*/
    margin: 1px;
    cursor: pointer;
    /*box-shadow: inset 0 3px #111, inset 0 -3px #555;*/
  }
  .luck-item{
    width: 86px;
    height: 86px;
    line-height: 92px;
    display: block;
    border-radius: 14px;
    font-family:cursive;
    /*text-shadow:6px 2px 2px #333;*/
    color:deeppink;
    /*font-size: 25px;*/
    /*margin-top: 6px;*/
    /*margin-left: 3px;*/
    /*background-color: #333;*/
    /*color: #fff;*/
    margin: 1px;
    cursor: pointer;
    /*box-shadow: inset 0 3px #111, inset 0 -3px #555;*/
  }
  .active{
    background-color: darkgoldenrod;
    color: #fff;
  }
  .message-box-phone{
    width: 50%;
  }
  .message-box-pc{
    width: 20%;
  }
  .address-model-phone{
    width: 80%;
    left: 10%;
  }
  .address-model-pc{
    width: 20%;
    left: 40%;
  }
  .address-model-bottom{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background: #000;
    z-index: 2018;
  }
  .address-model{
    position: fixed;
    /*width: 50%;*/
    padding: 5px;
    top: 20%;
    text-align: center;
    z-index: 2019;
    padding-bottom: 10px;
    vertical-align: middle;
    background-color: #FFF;
    border-radius: 4px;
    border: 1px solid #EBEEF5;
    font-size: 18px;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    overflow: hidden;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }
  .address-model-item{
    padding: 5px;
  }
  .address-model > .address-model-item > .el-input{
    width: 50%;
  }
  .click-me{
    background: url('../../assets/立即抽奖.png') no-repeat;
    background-size:contain
  }
  .change-address{
    width: 120px;
    height: 36px;
    display: inline-block;
    cursor: pointer;
    background: url("../../assets/更换地址.png") no-repeat;
    background-size: contain;
  }
  .click-history{
    width: 120px;
    height: 36px;
    display: inline-block;
    cursor: pointer;
    background: url("../../assets/查看订单.png") no-repeat;
    background-size: contain;
  }
</style>
