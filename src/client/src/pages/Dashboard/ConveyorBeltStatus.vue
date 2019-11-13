<template>
    <div>
        <div class="row justify-center q-mt-md">
            <div class="col-lg-8 col-md-8 col-xs-12">
                <!-- <img src="statics/beltConveyor/allBack.svg" /> -->
                <div class="row justify-center">
                    <div class="col-10 belt-conveyor">
                        <div class="wheel-container">
                            <img
                                class="belt-wheel-left animate-spin"
                                src="statics/beltConveyor/wheel.svg"
                            />
                            <img
                                class="belt-wheel-right animate-spin"
                                src="statics/beltConveyor/wheel.svg"
                            />
                        </div>
                        <img
                            class="gauge confidence-gauge"
                            src="statics/gauge/cap.svg"
                            :style="getRotate(confidence)"
                        >
                        <img
                            class="gauge pasta-count-gauge"
                            src="statics/gauge/cap.svg"
                            :style="getRotate(getPastaCountInMin * 270.0 / 100)"
                        >
                        <img
                            class="gauge belt-speed-gauge"
                            src="statics/gauge/cap.svg"
                            :style="getRotate(beltSpeed * 270.0 / 100)"
                        >
                        <img
                            class="led-light"
                            src="statics/beltConveyor/ledLight.svg"
                        >

                        <div class="led-brightnetss-controller">
                            <q-slider
                                v-model="ledBrightness"
                                :min="0"
                                :max="100"
                                :step="1"
                                label
                                @change="updateLedBrightness"
                            />
                        </div>

                    </div>
                </div>
                <div
                    class="row justify-center"
                    style="margin-top: -10%;margin-left: 17%;"
                >
                    <div class="col-6">
                        <p class="text-subtitle1 text-center ">
                            Conveyor Belt Speed Controller
                        </p>

                        <q-slider
                            v-model="beltSpeed"
                            :min="0"
                            :max="100"
                            :step="1"
                            label
                            @change="updateBeltSpeed"
                        />
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <p class="text-h6 text-center ">
                            Conveyer Belt Status and Statistics
                        </p>
                    </div>
                </div>

            </div>
            <div class="col-lg-4 col-md-4 col-xs-12">
                <div class="row shadow-1 q-px-sm q-py-sm q-mb-md">
                    <div class="col-12">
                        <p class="text-h6 text-center ">
                            Data Logger
                        </p>

                        <textarea
                            id="story"
                            name="story"
                            rows="5"
                            cols="33"
                            v-model="getMQTTData"
                            style="width: 100%;height: 602px;resize: vertical;"
                        >
                        </textarea>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { INFERENCE, CB, LED } from '@shared/constants/deviceTypes'
import invokeApiLambda from '~/utils/server/invokeApiLambda'
import {
    UPDATE_BELT_SPEED, UPDATE_LED_BRIGHTNESS
} from '@shared/descriptions/endpoints/endpointIds'

import { sum, propOr, last, split } from 'ramda'
export default {
    name: 'ConveyorBeltStatus',
    computed: {
        ...mapGetters('deviceData', ['getMQTTData', 'getAverageConfidence', 'getPastaCountInMin', 'getBeltSpeed', 'getLedBrightness', 'getSelectedBoard']),
        beltSpeed: {
            get() {
                return this.getBeltSpeed
            },
            set(val) {
            }
        },
        ledBrightness: {
            get() {
                return this.getLedBrightness
            },
            set(val) {
            }
        },
        confidence: function () {
            return this.getAverageConfidence * 270.0 / 100
        },
    },
    methods: {
        getRotate(ang) {
            return `transform: rotate(${ang}deg);`
        },
        async updateBeltSpeed(val) {
            await invokeApiLambda(UPDATE_BELT_SPEED, { deviceId: last(split('-', this.getSelectedBoard)), beltSpeed: val })
        },
        async updateLedBrightness(val) {
            await invokeApiLambda(UPDATE_LED_BRIGHTNESS, { deviceId: last(split('-', this.getSelectedBoard)), ledBrightness: val })
        }
    }
}
</script>

<style lang="stylus">
.textarea {
    width: '100%';
    height: '602px';
    resize: 'vertical';
}
</style>>
