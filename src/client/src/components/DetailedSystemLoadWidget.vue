<template>
    <div class="row q-py-sm">
        <div class="col-12">
            <p class="text-h6 text-center">Average System Load</p>
            <div class="row justify-center">
                <q-btn-group
                    rounded
                    class="text-center"
                >
                    <q-btn
                        rounded
                        class="round-button"
                        label="CPU"
                    />

                    <q-btn
                        rounded
                        color="white"
                        text-color="black"
                        label="GPU"
                    />
                </q-btn-group>
            </div>
            <p class="text-h6 text-center text-black-12 q-mt-sm">Detailed System Load</p>

            <div class="row border justify-center">

                <div class="col-lg-4 col-sm-12  col-xs-12 q-mx-sm list-border">
                    <div class="list-title">
                        <font class="text-subtitle1">Arm Cortex A72</font>
                    </div>
                    <single-gauges-item
                        :gaugesAmount="getAverageCPUData('a72-0-load')"
                        :gaugesName="'Core 1'"
                    >
                    </single-gauges-item>
                    <single-gauges-item
                        :gaugesAmount="getAverageCPUData('a72-1-load')"
                        :gaugesName="'Core 2'"
                    >
                    </single-gauges-item>
                </div>
                <div class="col-lg-7 col-sm-12  col-xs-12 q-mx-sm list-border">
                    <div class="list-title">
                        <font class="text-subtitle1">Arm Cortex A53</font>
                    </div>

                    <div class="row justify-center">
                        <div class="col-5">
                            <single-gauges-item
                                :gaugesAmount="getAverageCPUData('a53-0-load')"
                                :gaugesName="'Core 3'"
                            >
                            </single-gauges-item>
                        </div>
                        <div class="col-5">
                            <single-gauges-item
                                :gaugesAmount="getAverageCPUData('a53-2-load')"
                                :gaugesName="'Core 5'"
                            >
                            </single-gauges-item>
                        </div>
                    </div>
                    <div class="row justify-center">
                        <div class="col-5">
                            <single-gauges-item
                                :gaugesAmount="getAverageCPUData('a53-1-load')"
                                :gaugesName="'Core 4'"
                            >
                            </single-gauges-item>
                        </div>
                        <div class="col-5">
                            <single-gauges-item
                                :gaugesAmount="getAverageCPUData('a53-3-load')"
                                :gaugesName="'Core 6'"
                            >
                            </single-gauges-item>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SingleGaugesItem from '~/components/SimpleGaugesItem'
import { mapGetters } from 'vuex'
export default {
    name: 'DetailedSystemLoad',
    data() {
        return {}
    },
    components: {
        SingleGaugesItem
    },
    computed: {
        ...mapGetters('deviceData', ['getAverageCPUData'])
    }
}
</script>

<style type="text/css">
.list-border {
    border-radius: 4px;
    border: 1px solid rgb(149, 149, 149);
}
</style>
