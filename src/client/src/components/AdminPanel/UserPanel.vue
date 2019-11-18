<template>
    <div class="q-pa-md">
        <q-table
            :data="this.userTableData"
            :columns="columns"
            row-key="name"
        >
            <template v-slot:body="props">
                <q-tr :props="props">
                    <q-td
                        key="name"
                        :props="props"
                    >
                        {{ props.row.name }}
                    </q-td>
                    <q-td
                        key="email"
                        :props="props"
                    >
                        <q-badge color="green">
                            {{ props.row.email }}
                        </q-badge>
                    </q-td>
                    <q-td
                        key="status"
                        :props="props"
                    >
                        <q-badge color="orange">
                            {{ props.row.status }}
                        </q-badge>
                    </q-td>
                    <q-td
                        key="created"
                        :props="props"
                    >
                        <q-badge color="primary">
                            {{ props.row.created }}
                        </q-badge>
                    </q-td>
                    <q-td
                        key="actions"
                        :props="props"
                    >
                        <q-btn
                            round
                            color="primary"
                            size="sm"
                            icon="fas fa-edit"
                            @click="editUser(props.row.userId)"
                        />
                    </q-td>
                </q-tr>
            </template>
        </q-table>
        <q-inner-loading :showing="visible">
            <q-spinner-gears
                size="50px"
                color="primary"
            />
        </q-inner-loading>
        <q-dialog
            v-model="userEdit"
            persistent
        >
            <q-card style="width: 600px">
                <q-card-section class="row items-center">
                    <div class="text-h6">Select Devices For User</div>
                    <q-space />
                    <q-btn
                        icon="close"
                        flat
                        round
                        dense
                        v-close-popup
                    />
                </q-card-section>
                <q-separator />
                <q-card-section>
                    <div class="row">
                        <div class="col-12">
                            <q-select
                                filled
                                v-model="selectedOptions"
                                multiple
                                :options="boardSelectOptions"
                                use-chips
                                stack-label
                                label="Devices"
                            />

                        </div>
                    </div>
                </q-card-section>
                <q-separator />
                <q-card-actions align="right">
                    <q-btn
                        flat
                        label="Update"
                        color="primary"
                        @click="updateDevicesForUser()"
                        v-close-popup
                    />
                </q-card-actions>

            </q-card>
        </q-dialog>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { actionIds } from '~/store/userdata/allIds'
import invokeApiLambda from '~/utils/server/invokeApiLambda'
import {
    GET_USER_LIST, GET_BOARD_DATA
} from '@shared/descriptions/endpoints/endpointIds'
import {
    pathOr, join, split, tail
} from 'ramda'
import { UPDATE_USER_DATA } from '../../../../shared/descriptions/endpoints/endpointIds'

export default {
    name: 'UserPanelComponent',
    data() {
        return {
            visible: true,
            userList: [],
            userEdit: false,
            boardDatas: [],
            userDeviceDatas: [],
            selectedOptions: [],
            selectedUserId: '',
            columns: [
                {
                    name: 'name',
                    required: true,
                    label: 'Name',
                    align: 'left',
                    field: row => row.name,
                    format: val => `${val}`,
                    sortable: true
                },
                { name: 'email', align: 'center', label: 'Email', field: 'email', sortable: true },
                { name: 'status', label: 'Status', field: 'status' },
                { name: 'created', label: 'Created', field: 'created' },
                { name: 'actions', label: 'Actions', field: 'actions' },
            ],
        }
    },
    async created() {
        await this.loadDeviceData()
    },
    methods: {
        getValue: function (row, field) {
            let res = null
            row.forEach((element) => {
                if (element.Name == field) res = element.Value
            })
            return res
        },
        editUser: function (userId) {
            this.userEdit = true
            this.selectedUserId = userId
            let devices = null
            debugger
            this.userDeviceDatas.forEach((userDeviceData) => {
                if (userDeviceData.sk == this.selectedUserId) devices = userDeviceData.allowDevices
            })
            this.selectedOptions = (devices && devices != ',') ? split(',', devices).map((device) => `Board-${device}`) : []
        },
        updateDevicesForUser: async function () {
            this.visible = true
            await invokeApiLambda(UPDATE_USER_DATA, { deviceIds: join(',', this.selectedOptions.map((option) => tail(split('-', option)))), selectedUserId: this.selectedUserId })
            await this.loadDeviceData()
        },
        loadDeviceData: async function () {
            this.visible = true
            const data = await invokeApiLambda(GET_USER_LIST)
            this.userList = pathOr([], ['body', 'Users'], data)
            const boardAndUserData = await invokeApiLambda(GET_BOARD_DATA)
            this.boardDatas = boardAndUserData.body.allBoards
            this.userDeviceDatas = boardAndUserData.body.userDatas
            this.visible = false
        }
    },
    computed: {
        userTableData: function () {
            return this.userList.map((row) => {
                return {
                    name: this.getValue(row.Attributes, 'name'),
                    email: this.getValue(row.Attributes, 'email'),
                    status: row.UserStatus,
                    created: row.UserCreateDate,
                    userId: row.Username
                }
            })
        },
        boardSelectOptions: function () {
            return this.boardDatas.map((boardData) => `Board-${boardData.sk}`)
        },
    },
    watch: {
        userTableData: function (val) {
        }
    }

}
</script>

<style>
</style>
