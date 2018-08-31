<template>
    <div>
        <div class="item-container">
            <mt-field :label="text" type="text" v-model="displayValue" readonly disableClear>
                <mt-button class="adder-btn" size="small" @click.native="Minus">-</mt-button>
                <span class="adder-value">{{this.adderValue}}</span>
                <mt-button class="adder-btn" size="small" @click.native="Add">+</mt-button>
            </mt-field>
        </div>
    </div>
</template>

<script>

  export default {
    name: 'adder',
    props: {
        value: {
            type: Number,
            default: 0,
        },
        text: {
            type: String,
            default: '',
        },
        unit: {
            type: String,
            default: '',
        }
    },
    data () {
        return {
            adderValue: this.value,
            displayValue: `${this.value}${this.unit}`,
        }
    },
    watch : {
        adderValue (val) {
            this.displayValue = `${val}${this.unit}`
        }
    },
    methods: {
        Add () {
            this.adderValue++;
            this.$emit('input', this.adderValue)
        },
        Minus () {
            this.adderValue--;
            if (this.adderValue < 0) {
                this.adderValue = 0;
            }
            this.$emit('input', this.adderValue)
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
</style>

