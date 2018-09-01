<template>
    <div>
        <label class="mint-radiolist-title food-title">食物种类</label>
        <div class="item-container">
            <mt-field 
                type="text"
                placeholder="请输入食物种类"
                v-for="(type, index) in foodtypes"
                :key="type.id"
                v-model="type.name"
                disableClear>
                <span class="adder-bowl-num">{{type.value}}碗</span>
                <mt-button class="adder-btn" size="small" @click.native="Minus(type)">-</mt-button>
                <span class="adder-value">{{type.value}}</span>
                <mt-button class="adder-btn" size="small" @click.native="Add(type)">+</mt-button>
                <mt-button class="food-adder-delete-btn" @click.native="DeleteFoodType(index)">删除</mt-button>
            </mt-field>
        </div>
        <div class="food-adder-btn-container">
            <mt-button class="food-adder-btn" @click.native="AddFoodType">添加食物种类</mt-button>
        </div>
    </div>
</template>

<script>

  export default {
    name: 'food',
    props: {
        value: {
            type: Array,
            default: [{
              name: '',
              value: 0,
            }],
        },
    },
    data () {
        return {
            foodtypes: [{
              name: '',
              value: 0,
            }],
        }
    },
    methods: {
        Add (type) {
            type.value++;
            this.$emit('input', this.foodtypes)
        },
        Minus (type) {
            type.value--;
            if (type.value < 0) {
                type.value = 0;
            }
            this.$emit('input', this.foodtypes)
        },
        AddFoodType () {
            this.foodtypes.push({
              name: '',
              value: 0,
            })
        },
        DeleteFoodType (index) {
            this.foodtypes.splice(index, 1);
        }
    },
    mounted () {
    }
  }

</script>
<style>
  .adder-value {
      display: inline-block;
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border: 1px solid #ccc;
      border-radius: 5px;
  }
  .adder-btn {
      touch-action: none;
  }
  .adder-bowl-num {
    padding-right: 20px;
  }
  .food-title {
    margin: 10px 0 -5px 10px;
  }
  .food-adder-btn {
    display: block;
    font-size: 15px;
    width: 80%;
    margin: 10px auto;
  }
  .food-adder-btn-container {
      text-align: center;
  }
  .food-adder-delete-btn {
    color:cornflowerblue !important;
    font-size: 14px !important;
    background-color: #fff !important;
    padding: 2px !important;
    box-shadow: 0 0 0px!important;
  }
</style>

