<template>
    <q-layout view="lHh Lpr lFf">
        <q-header
            elevated
            reveal
        >
            <q-toolbar>
                <q-toolbar-title
                    class="row items-center content-stretch"
                    alignment="horizontal-content-center"
                >
                    <img
                        :src="'statics/logos/toradex-white.svg'"
                        spinner-color="white"
                        style="toradex-logo"
                        class="responsive toradex-logo col"
                    >
                    <img
                        :src="'statics/logos/aws-white.svg'"
                        spinner-color="white"
                        class="responsive aws-logo col"
                    >
                    <img
                        :src="'statics/logos/nxp-logo.svg'"
                        spinner-color="white"
                        class="responsive nxp-logo col"
                    >
                </q-toolbar-title>

                <q-btn-dropdown
                    stretch
                    flat
                    icon="apps"
                    class="lt-sm"
                >
                    <q-list>
                        <q-item-label
                            header
                            class="bg-yellow-1"
                        >
                            <div class="row items-center no-wrap">
                                <q-icon
                                    left
                                    name="account_circle"
                                    size="lg"
                                />
                                <div class="text-center text-black">
                                    {{ fullname }}
                                </div>
                            </div>

                        </q-item-label>
                        <q-item
                            clickable
                            @click="logout"
                        >
                            <q-item-section>
                                <q-item-label>Log out</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-btn-dropdown>

                <q-btn-dropdown
                    rounded=""
                    color="light-green-1"
                    text-color="black"
                    class="gt-xs"
                >

                    <template v-slot:label>
                        <div class="row items-center no-wrap">
                            <q-icon
                                left
                                name="account_circle"
                                size="sm"
                            />
                            <div class="text-center text-black">
                                {{ fullname }}
                            </div>
                        </div>
                    </template>
                    <q-list>
                        <q-item
                            clickable
                            v-close-popup
                            @click="logout"
                        >
                            <q-item-section>
                                <q-item-label>Log out</q-item-label>
                            </q-item-section>
                        </q-item>

                    </q-list>
                </q-btn-dropdown>
            </q-toolbar>
        </q-header>

        <q-page-container>

            <div class="row items-center q-px-sm q-py-md justify-end">
                <div class="col-lg-2 col-md-2 col-sm-4 col-xs-10">
                    <q-select
                        bg-color="rgb(241, 248, 233)"
                        rounded
                        outlined
                        v-model="selectedBoardModel"
                        :options="getAllBoards"
                        label="Select Board"
                        dense
                    >
                        <template v-slot:append>
                            <q-icon
                                size="xs"
                                name="brightness_1"
                                style="font-size:15px"
                                :color="deviceStatus ? 'green' : 'red'"
                            />
                        </template>
                        <template v-slot:option="scope">
                            <q-item
                                v-bind="scope.itemProps"
                                v-on="scope.itemEvents"
                            >
                                <q-item-section>
                                    <q-item-label v-html="scope.opt" />
                                </q-item-section>
                                <q-item-section avatar>
                                    <q-icon
                                        size="xs"
                                        name="brightness_1"
                                        style="font-size:15px"
                                        :color="deviceStatusByBoardID(scope.opt) ? 'green' : 'red'"
                                    />
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                </div>
                <div class="col-lg-7 col-md-7 col-sm-12 col-xs-12">
                    <h4 class="text-center pt-0 mt-0">
                        {{ this.title }}
                    </h4>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-5 col-xs-12">
                    <q-btn-group
                        rounded
                        class="text-center"
                        spread
                    >
                        <q-btn
                            icon="replay"
                            label="Reset"
                            rounded
                            class="reset-button"
                            @click="resetDeviceData('data')"
                        />
                    </q-btn-group>
                </div>
            </div>
            <transition
                name="transitions"
                enter-active-class="animated fadeIn"
                leave-active-class="animated fadeOut"
                mode="out-in"
            >
                <q-page
                    padding
                    id="pageContent"
                >

                    <q-tabs
                        inline-label
                        :breakpoint="0"
                        align="justify"
                        class="text-white shadow-2 router-tap q-page-sticky flex-center fixed-top q-page-sticky--expand"
                        style="z-index:1000"
                    >
                        <q-route-tab
                            icon="fas fa-chalkboard-teacher"
                            label="Deep Learning Model Performance"
                            to="deeplearning-model"
                            exact
                        />
                        <q-route-tab
                            icon="fas fa-microchip"
                            to="compute-pfm"
                            label="Compute Performance"
                            exact
                        />
                        <q-route-tab
                            icon="fas fa-share-alt-square"
                            to="conveyar-status"
                            label="Conveyor Belt Status"
                            exact
                        />
                        <q-route-tab
                            icon="fas fa-share-alt-square"
                            to="conveyar-status"
                            label="Conveyor Belt Status"
                            exact
                        />
                    </q-tabs>
                    <q-tabs
                        v-model="tab"
                        inline-label
                        align="justify"
                        class="text-white shadow-2 router-tap"
                        style="z-index:1000"
                        narrow-indicator
                    >
                        <q-route-tab
                            icon="fas fa-chalkboard-teacher"
                            label="Deep Learning Model Performance"
                            to="deeplearning-model"
                            exact
                        />
                        <q-route-tab
                            icon="fas fa-microchip"
                            to="compute-pfm"
                            label="Compute Performance"
                            exact
                        />
                        <q-route-tab
                            icon="fas fa-share-alt-square"
                            to="conveyar-status"
                            label="Conveyor Belt Status"
                            exact
                        />
                        <q-route-tab
                            icon="fas fa-users-cog"
                            to="admin-panel"
                            label="Admin Panel"
                            :disable="!isRightAuthentication(admin)"
                            exact
                        />
                    </q-tabs>

                    <router-view />
                    <q-page-scroller
                        position="bottom-right"
                        :scroll-offset="150"
                        :offset="[18, 18]"
                        style="z-index: 1000"
                    >
                        <q-btn
                            fab
                            icon="keyboard_arrow_up"
                            color="accent"
                        />
                    </q-page-scroller>

                </q-page>
            </transition>
        </q-page-container>
    </q-layout>
</template>

<script>
import { openURL, debounce, QTabs } from 'quasar'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { actionIds } from '~/store/userdata/allIds'
import { actionIds as deviceActionIds, mutationIds as deviceMutationIds } from '~/store/deviceData/allIds'
import { setInterval, clearInterval } from 'timers';
import { scroll } from 'quasar'
const { getScrollPosition, setScrollPosition } = scroll
import { admin } from '@root/src/shared/constants/authenticationTypes'

QTabs.mixin({
    mounted() {
        if (this.$refs.content) {
            this.$refs.content.addEventListener('scroll', debounce(this.__updateArrows, 150));
        }
    }
});

export default {
    name: 'DashboardLayout',
    data() {
        return {
            leftDrawerOpen: this.$q.platform.is.desktop,
            tab: '',
            polling: null,
            boardID: null,
            admin
        }
    },
    methods: {
        openURL,
        ...mapActions('userdata', {
            logout: actionIds.LOGOUT
        }),
        ...mapActions('deviceData', {
            getDeviceData: deviceActionIds.GET_DEVICE_DATA,
            resetDeviceData: deviceActionIds.RESET_DEVICE_DATA,
        }),
        ...mapMutations('deviceData', {
            selectBoard: deviceMutationIds.SELECT_BOARD
        }),
        pollData() {
            this.getDeviceData()

            this.polling = setInterval(() => {
                this.getDeviceData()
            }, 5000)
        },
        getScrollPosition,
        renderOptionForDevice(val) {
            debugger
        }
    },
    beforeDestroy() {
        clearInterval(this.polling)
    },
    computed: {
        ...mapGetters('page', [
            'title'
        ]),
        ...mapGetters('userdata', [
            'fullname', 'isRightAuthentication'
        ]),
        ...mapGetters('deviceData', [
            'deviceStatus', 'getAllBoards', 'getSelectedBoard', 'deviceStatusByBoardID'
        ]),
        selectedBoardModel: {
            get() {
                return this.getSelectedBoard
            },
            set(val) {
                return this.selectBoard(val)
            }
        }
    },
    created() {
        this.pollData()
    }

}
</script>

<style lang="stylus"></style>
