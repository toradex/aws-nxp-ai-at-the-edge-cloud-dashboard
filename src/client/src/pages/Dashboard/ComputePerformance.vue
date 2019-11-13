<template>
    <div>
        <div class="row shadow-1 justify-center q-mt-md">
            <div class="col-lg-5 col-sm-12  col-xs-12">
                <div class="row q-px-sm q-py-sm q-mb-md">
                    <div class="col-12">
                        <p class="text-h6 text-center">Average System Load</p>
                        <p class="text-subtitle1 text-center">
                            <font class="">Last updated time: </font>{{getLastUpateTime}}
                        </p>
                        <device-load-status-bar
                            :device-name="CPU.loadName"
                            :device-load-amount="getAverageDeviceData(CPU)"
                            class="fa-border"
                        >
                        </device-load-status-bar>

                        <device-load-status-bar
                            :device-name="GPU.loadName"
                            :device-load-amount="getAverageDeviceData(GPU)"
                            class="fa-border"
                        >
                        </device-load-status-bar>

                        <device-load-status-bar
                            :device-name="RAM.loadName"
                            :device-load-amount="getAverageDeviceData(RAM)"
                            class="fa-border"
                        >
                        </device-load-status-bar>
                    </div>
                </div>
                <div class="row justify-center items-center q-py-sm q-px-sm">
                    <div class="col-12">
                        <p class="text-h6 text-center">System Load</p>

                        <apexchart
                            ref="realtimeChart"
                            type="line"
                            :options="options"
                            :series="series"
                        />
                    </div>
                </div>
            </div>
            <div class="col-lg-7 col-sm-8  col-xs-12">
                <detailed-system-load-widget>

                </detailed-system-load-widget>
            </div>
        </div>
    </div>
</template>

<script>
import DeviceLoadStatusBar from '~/components/DeviceLoadStatusBar'
import DetailedSystemLoadWidget from '~/components/DetailedSystemLoadWidget'

import VueApexCharts from 'vue-apexcharts'
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { CPU, GPU, RAM } from '@shared/constants/deviceTypes'
import { propOr } from 'ramda'
export default {
    data: function () {
        return {
            CPU, GPU, RAM,
            propOr,
            range: 10,
            options: {
                chart: {
                    id: 'vuechart-example',
                    animations: {
                        enabled: true,
                        easing: 'linear',
                        dynamicAnimation: {
                            speed: 1000
                        }
                    },
                    toolbar: {
                        show: false
                    },
                    zoom: {
                        enabled: false
                    },
                    width: "100%",
                    height: 380,
                },
                xaxis: {
                    range: 10,
                    tickAmount: 10
                },
                yaxis: {
                    min: 0,
                    max: 100,
                    tickAmount: 10
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth'
                },
            },
        }
    },
    name: 'ComputePerformance',
    components: {
        DeviceLoadStatusBar,
        apexchart: VueApexCharts,
        DetailedSystemLoadWidget
    },
    computed: {
        ...mapGetters('deviceData', [
            'getAverageDeviceData', 'getLastUpateTime', 'getDeviceHistory', 'getHistoryCount'
        ]),
        series: function () {
            return [{
                name: 'CPU',
                data: this.getDeviceHistory(CPU)
            }, {
                name: 'GPU',
                data: this.getDeviceHistory(GPU)
            }, {
                name: 'RAM',
                data: this.getDeviceHistory(RAM)
            }]
        }
    },
}
</script>

<style>
</style>
