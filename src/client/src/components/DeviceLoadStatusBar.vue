<template>
    <div class="row items-center q-py-md q-px-md justify-center">
        <div class="col-lg-4 col-md-6 col-sm-5 text-body1 text-weight-bold">
            {{deviceName}}
        </div>
        <div class="col-lg-7 col-md-8 col-sm-12 col-xs-12">
            <q-linear-progress
                rounded
                style="height: 15px"
                :value="deviceLoadAmount/100"
                class="load-status-bar"
            />
        </div>
        <div class="col-lg-1 col-lg-2 col-sm-4 text-body1 q-pl-sm">
            {{Math.floor(deviceLoadAmount*10)/10}}%
        </div>

    </div>
</template>

<script>
export default {
    name: 'DeviceLoadStatusBar',
    props: {
        deviceName: {
            type: String
        },
        deviceLoadAmount: {
            type: Number
        },
    },
    computed: {
    },
    data() {
        return {}
    }
}
</script>

<style>
</style>
