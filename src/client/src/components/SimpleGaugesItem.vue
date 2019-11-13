<template>
    <div class="row justify-center">
        <div class="col-12">
            <div class="row justify-center">
                <div class="col-12">
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
                        :style="'margin-left:auto;margin-right:auto'"
                    >
                    </JqxGauge>
                </div>
            </div>
            <p class="text-h6 text-center">{{gaugesName}}</p>
        </div>
    </div>
</template>

<script>
import JqxGauge from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgauge.vue"
export default {
    name: 'SimpleGaugeItem',
    data() {
        return {
            ticksMinor: { interval: 10, size: '5%' },
            ticksMajor: { interval: 20, size: '9%' },
            ranges: [
                { startValue: 0, endValue: 33, style: { fill: '#00508c', stroke: '#00508c' }, endWidth: 10, startWidth: 10 },
                { startValue: 33, endValue: 66, style: { fill: '#96c837', stroke: '#96c837' }, endWidth: 10, startWidth: 10 },
                { startValue: 66, endValue: 100, style: { fill: '#ff5a00', stroke: '#ff5a00' }, endWidth: 10, startWidth: 10 },
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
        gaugesAmount: {
            type: Number
        },
        gaugesName: {
            type: String
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
