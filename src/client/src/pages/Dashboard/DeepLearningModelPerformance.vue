<template>
    <div>
        <div class="row justify-center q-mt-md shadow-1">
            <div class="col-lg-6 col-md-6 col-sm-12  col-xs-12">
                <div class="row q-px-sm q-py-sm q-mb-md">
                    <div class="col-12">
                        <p class="text-h6 text-center ">Pasta on Current Frame</p>
                        <apexchart
                            ref="pastaCountBarChart"
                            type="bar"
                            :options="options"
                            :series="series"
                        />

                    </div>
                </div>
            </div>
            <div class="col-lg-6  col-md-6 col-sm-12  col-xs-12">
                <div class="row q-px-sm q-py-sm q-mb-md">
                    <div class="col-12">
                        <p class="text-h6 text-center ">
                            Average Inference Confidence by Pasta Types
                        </p>
                        <div class="row">
                            <div class="col-lg-6 col-sm-12  col-xs-12">
                                <gauge-item
                                    :gaugesName="SHELLS.name"
                                    :gaugesAmount="this.getInferenceConfident[SHELLS.id]"
                                >
                                </gauge-item>
                            </div>
                            <div class="col-lg-6  col-sm-12  col-xs-12">
                                <gauge-item
                                    :gaugesName="PENNE.name"
                                    :gaugesAmount="this.getInferenceConfident[PENNE.id]"
                                >
                                </gauge-item>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-6  col-sm-12  col-xs-12">
                                <gauge-item
                                    :gaugesName="FARFALLE.name"
                                    :gaugesAmount="this.getInferenceConfident[FARFALLE.id]"
                                >
                                </gauge-item>
                            </div>
                            <div class="col-lg-6  col-sm-12  col-xs-12">
                                <gauge-item
                                    :gaugesName="ELBOWS.name"
                                    :gaugesAmount="this.getInferenceConfident[ELBOWS.id]"
                                >
                                </gauge-item>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import VueApexCharts from 'vue-apexcharts'
import pastaTypes, { SHELLS, PENNE, FARFALLE, ELBOWS } from '@shared/constants/pastaTypes'
import GaugeItem from '~/components/GaugeItem'

import { mapActions, mapMutations, mapGetters } from 'vuex'
import { maxPlus } from '@shared/util/ramdaPlus'
import { map, assoc } from 'ramda'
export default {
    name: 'DeepLearningModelPerformance',
    data: function () {
        return {
            SHELLS, PENNE, FARFALLE, ELBOWS,
            pastaTypes,
            options: {
                chart: {
                    height: 350,
                    type: 'bar',
                    toolbar: {
                        show: false
                    }
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '55%',
                        endingShape: 'rounded'
                    },
                    dataLabels: {
                        position: 'top',
                        maxItems: 100,
                        hideOverflowingLabels: false,
                    }
                },
                dataLabels: {
                    enabled: true,
                    enabledOnSeries: undefined,
                    formatter: function (val, opts) {
                        return val
                    },
                    textAnchor: 'middle',
                    style: {
                        fontSize: '40px',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        colors: ['white']
                    },
                    dropShadow: {
                        enabled: false,
                        top: 1,
                        left: 1,
                        blur: 1,
                        opacity: 0.45
                    }
                },
                stroke: {
                    show: true,
                    width: 2,
                    colors: ['transparent']
                },
                xaxis: {
                    categories: map((pastaType) => pastaType.name, pastaTypes),
                },
                yaxis: {
                    max: 8
                },
                fill: {
                    opacity: 1
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return Math.floor(val)
                        }
                    }
                }
            },
        }
    },
    methods: {
        updateYaxisMax(val) {
            if (val > 5) {
                this.$refs.pastaCountBarChart.updateOptions({
                    yaxis: {
                        max: val * 2,
                    }
                })
            }
        }
    },
    computed: {
        ...mapGetters('deviceData', [
            'getPastaCount', 'getInferenceConfident'
        ]),
        getMaxPastaCount: function () {
            return maxPlus(this.getPastaCount)
        },
        series: function () {
            return [
                {
                    name: 'Pasta',
                    data: map((pastaType) => ({ x: pastaType.name, y: this.getPastaCount[pastaType.id] }), pastaTypes)
                }
            ]
        }
    },
    components: {
        apexchart: VueApexCharts,
        GaugeItem,
    },
    mounted: function () {
        this.getMaxPastaCount && this.updateYaxisMax(this.getMaxPastaCount)
    },
    watch: {
        getMaxPastaCount: function (val) {
            this.updateYaxisMax(val)
        },
    }
}
</script>

<style>
</style>
