<template>
    <div class="row items-center justify-center">
        <div class="col-5">
            <JqxGauge
                ref="gauge"
                :ranges="ranges"
                :ticksMinor="ticksMinor"
                :ticksMajor="ticksMajor"
                :value="this.gaugesAmount"
                :colorScheme="'scheme05'"
                :animationDuration="1200"
                :width="150"
                :height="150"
                :caption="caption"
                :border="border"
                :cap="cap"
                :max="100"
            >
            </JqxGauge>
        </div>
        <div class="col-1">
        </div>
        <div class="col-3">
            <p class="text-h6 text-center">{{gaugesName}}</p>
        </div>
    </div>
</template>

<script>
import JqxGauge from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgauge.vue"
export default {
    name: 'GaugeItem',
    data() {
        return {
            ticksMinor: { interval: 10, size: '5%' },
            ticksMajor: { interval: 20, size: '9%' },
            ranges: [
                { startValue: 0, endValue: 20, style: { fill: '#bce671', stroke: '#bce671' }, endWidth: 10, startWidth: 10 },
                { startValue: 20, endValue: 40, style: { fill: '#a8d458', stroke: '#a8d458' }, endWidth: 10, startWidth: 10 },
                { startValue: 40, endValue: 60, style: { fill: '#a1d04d', stroke: '#a1d04d' }, endWidth: 10, startWidth: 10 },
                { startValue: 60, endValue: 80, style: { fill: '#9bcc44', stroke: '#9bcc44' }, endWidth: 10, startWidth: 10 },
                { startValue: 80, endValue: 100, style: { fill: '#8abb33', stroke: '#8abb33' }, endWidth: 10, startWidth: 10 },
            ],
            caption: { offset: [0, -25], value: `${this.gaugesAmount.toFixed(2)} %`, position: 'bottom' },
            border: { visible: false },
            cap: { size: '7%', style: { fill: '#00508c', stroke: '#00508c' }, visible: true },
        }
    },
    components: {
        JqxGauge
    },
    props: {
        gaugesName: {
            type: String,
            default: ''
        },
        gaugesAmount: {
            type: Number
        },
    },
    watch: {
        gaugesAmount: function (val) {
            this.$refs.gauge.caption = { offset: [0, -25], value: `${val.toFixed(2)} %`, position: 'bottom' }
            this.$refs.gauge.value = val
        }
    }
}
</script>

<style>
</style>
