<template>
  <div class="">
    <div class="item-container">
      <mt-field label="打卡日期" placeholder="请选择日期" type="date" v-model="date" disableClear></mt-field>
    </div>
    <mt-checklist
      align="right"
      title="如有步行请在右侧打勾，否则请填写备注原因"
      v-model="isWalked"
      :options="walkOption">
    </mt-checklist>
    <adder
      v-if="isWalkTimeShow"
      v-model="walkTime"
      text="步行次数">
    </adder>
    <div class="item-container" v-if="isWalkTimeShow">
      <mt-field label="总步行时间" :state="walkTotalState" placeholder="请输入步行分钟" type="text" v-model="walkTotal" disableClear>
        分钟
      </mt-field>
    </div>
    

    <!-- stage3选项 -->
    <adder
      v-model="bpl"
      unit="瓶"
      text="百普力">
    </adder>
    <adder
      v-model="rn"
      unit="瓶"
      text="瑞能">
    </adder>
    <adder
      v-model="BDJTime"
      unit="瓶"
      text="益力佳">
    </adder>

    <food
      >
    </food>

    <mt-radio
      title="今日心情"
      v-model="mood"
      :max="1"
      :options="['开心 😄', '一般 😐', '难过 😫']">
    </mt-radio>

     <!-- stage5选项 -->
    <mt-checklist
      align="right"
      title="如有练习请在右侧打勾，否则请填写备注原因"
      v-model="isBDJ"
      :options="BDJOptions">
    </mt-checklist>
    <adder
      v-if="isBDJTimeShow"
      v-model="BDJTime"
      text="练习次数">
    </adder>


    
    <!-- general -->
    <br>
    <mt-button 
      size="large"
      type="primary">
      提交
    </mt-button>

  </div>
</template>

<script>
  import { Toast } from 'mint-ui';
  import Adder from './Adder';
  import Food from './Food';

  Date.prototype.format = function (format) {
      var o = {
          "M+": this.getMonth() + 1, //month
          "d+": this.getDate(),    //day
          "h+": this.getHours(),   //hour
          "m+": this.getMinutes(), //minute
          "s+": this.getSeconds(), //second
          "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
          "S": this.getMilliseconds() //millisecond
      }
      if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
          (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o) if (new RegExp("(" + k + ")").test(format))
          format = format.replace(RegExp.$1,
              RegExp.$1.length == 1 ? o[k] :
                  ("00" + o[k]).substr(("" + o[k]).length));
      return format;
  }
  function getQueryString(name) { 
    let reg = `(^|&)${name}=([^&]*)(&|$)`
    let r = window.location.search.substr(1).match(reg); 
    if (r != null) return unescape(r[2]); return null; 
  }


  export default {
    components: {
      Adder,
      Food,
    },
    data () {
      return {
        openid: "",
        stage: 0,

        date: new Date().format('yyyy-MM-dd'),
        
        mood: '',

        isWalked: [false],
        walkOption: ['是否步行'],
        isWalkTimeShow: false,
        walkTotal: 0,
        walkTotalState: '',
        walkTime: 0,

        // stage3选项
        bpl: 0,
        ylj: 0,
        nql: 0,
        rn: 0,

        // stage5选项
        isBDJ: [false],
        BDJOptions: ['是否练习八段锦'],
        BDJTime: 0,
        isBDJTimeShow: false,

        isbplShow: false,
        isyljShow: false,
        isnqlShow: false,
        isrnShow: false,
        isBDJShow: false,
      }
    },
    watch: {
      isWalked (val) {
        this.isWalkTimeShow = !!val[1];
      },
      walkTotal (val) {
        if (isNaN(Number(val))) {
          Toast('请输入纯数字!');
          this.walkTotalState = 'error';
        }
        else {
          this.walkTotalState = '';
        }
      },

      //stage 5
      isBDJ (val) {
        this.isBDJTimeShow = !!val[1];
      },
    },
    methods: {
      // general
      getStage () {
          this.$http.get(`https://api.cancercare.net.cn/api/questionnaire?openid=${this.openid}`)
          .then(res => {
            console.log(res)
            this.stage = res.body.content.stage;
          }, res => {
            Toast('网络连接失败，请稍后重试!');
          }) 
      }
      // stage 5
    },
    mounted () {
      this.openid = getQueryString('openid')
      this.getStage()
    }
  }

</script>
<style>
  .item-container {
    padding: 10px 0 0 20px;
  }
</style>

