<template>
  <div class="">
    <div class="item-container">
      <mt-field label="患者姓名" placeholder="请输入患者姓名" type="text" v-model="name" disableClear></mt-field>
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
      v-model="nql"
      unit="瓶"
      text="能全力"
      v-if="isnqlShow">
    </adder>
    <adder
      v-model="asf"
      unit="勺"
      text="安素粉"
      v-if="isasfShow">
    </adder>
    <adder
      v-model="bpl"
      unit="瓶"
      text="百普力"
      v-if="isbplShow">
    </adder>
    <adder
      v-model="rn"
      unit="瓶"
      text="瑞能"
      v-if="isrnShow">
    </adder>
    <adder
      v-model="ylj"
      unit="瓶"
      text="益力佳"
      v-if="isyljShow">
    </adder>
    <div class="item-container">
      <mt-field label="液体总量" placeholder="请输入液体总量" type="text" v-model="liquid" disableClear>
          毫升
      </mt-field>
    </div>
    <food v-model="foodtypes" v-if="isfoodtypesShow"></food>
    

    <mt-radio
      title="今日心情"
      v-model="mood"
      :max="1"
      :options="[{
        label:'开心 😄',
        value:'good',
       }, {
         label: '一般 😐',
         value: 'normal',
       }, {
         label: '难过 😫',
         value: 'bad',
       }]">
    </mt-radio>

     <!-- stage5选项 -->
     <div v-if="isBDJShow">
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
     </div>
    <div class="item-container">
      <mt-field label="备注信息" placeholder="请输入备注信息" type="textarea" rows="2" v-model="remark"></mt-field>
    </div>

    
    <!-- general -->
    <br>
    <mt-button 
      size="large"
      type="primary"
      @click.native="postCheck">
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
        plan: 0,
        name: "",

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
        asf: 0,


        liquid: 0,

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
        isasfShow: false,
        isfoodtypesShow: false,
        

        remark: "",

        foodtypes: [],
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
            this.stage = res.body.content.stage;
            this.plan = res.body.content.plan;
            var s = this.stage;
            var p = this.plan;

            if (s == 3) {
              if (p == 1) {
                this.isrnShow = true;
                this.isnqlShow = true;
                this.isasfShow = true;
              }
              else if (p == 2) {
                this.isrnShow = true;
                this.isnqlShow = true;
                this.isyljShow = true;
              }
              else if (p == 3) {
                this.isrnShow = true;
                this.isnqlShow = true;
              }
              else if (p == 4) {
                this.isrnShow = true;
                this.isnqlShow = true;
                this.isasfShow = true;
              }
              else if (p == 5) {
                this.isrnShow = true;
                this.isbplShow = true;
                this.isyljShow = true;
              }
              else if (p == 6) {
                this.isrnShow = true;
                this.isbplShow = true;
              }
            }
            else if (s == 4) {
              this.isfoodtypesShow = true;
              if (p == 1) {
                this.isnqlShow = true;
                this.isasfShow = true;
              }
              else if (p == 2) {
                this.isnqlShow = true;
                this.isasfShow = true;
              }
              else if (p == 3) {
                this.isbplShow = true;
                this.isyljShow = true;
              }
              else if (p == 4) {
                this.isbplShow = true;
                this.isyljShow = true;
              }
            }
            else if (s == 5) {
                this.isbplShow = true;
            }
          }, res => {
            Toast('网络连接失败，请稍后重试!');
          }) 
      },
      postCheck () {
        var food_type = [];
        var food_zw = [];
        this.foodtypes.forEach((type) => {
          food_type.push(type.name);
          food_zw.push(type.value);
        })
        this.$http.post("https://api.cancercare.net.cn/api/questionnaire", {
          openid: this.openid,
          stage: this.stage,
          name: this.name,
          stage: this.stage,
          nql: this.nql,
          bpl: this.bpl,
          rn: this.rn,
          asf: this.asf,
          ylj: this.ylj,
          liquid: this.liquid,
          iswalk: this.isWalked,
          walk_cnt: this.walkTime,
          walk_dura: this.walkTotal,
          remark: this.remark,
          mood: this.mood,
          food_type: food_type,
          food_zw: food_zw,
          isbdj: this.isBDJ,
          bdj_cnt: this.BDJTime,
          date: this.date,
          
        })
          .then(res => {
            Toast(res.body.message);
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
    padding: 10px 0 0 16px;
  }
</style>

