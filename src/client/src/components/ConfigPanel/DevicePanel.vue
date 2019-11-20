<template>
  <div class="q-pa-md">
		<q-table
			:data="this.boardDatas"
			:columns="boardColumns"
			row-key="board_id"
		>
			<template v-slot:body-cell-actions="props">
				<q-td
					key="actions"
				>
					<q-btn
						round
						color="primary"
						class="float-right"
						size="sm"
						icon="fas fa-edit"
						@click="editBoard(props.row.sk)"
					/>
				</q-td>
			</template>
		</q-table>
		<q-inner-loading :showing="showLoading">
				<q-spinner-gears
						size="50px"
						color="primary"
				/>
		</q-inner-loading>

		<q-dialog
				v-model="isBoardEditing"
				persistent
		>
			<q-card style="width: 600px">
					<q-card-section class="row items-center">
							<div class="text-h6">Update Board Alias</div>
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
										<q-input filled v-model="newAlias" label="Type new Alias" />
									</div>
							</div>
					</q-card-section>
					<q-separator />
					<q-card-actions align="right">
							<q-btn
									flat
									label="Update"
									color="primary"
									@click="updateBoardAlias()"
									v-close-popup
							/>
					</q-card-actions>

			</q-card>
		</q-dialog>
	</div>
</template>

<script>
import async from 'async'
import {
    UPDATE_BOARD_ALIAS
} from '@shared/descriptions/endpoints/endpointIds'
import { keys, propOr } from 'ramda'
import invokeApiLambda from '~/utils/server/invokeApiLambda'
import { mapActions } from 'vuex'
import { actionIds as deviceActionIds } from '~/store/deviceData/allIds'

export default {
  name: 'DevicePanel',
  data () {
    return {
			boardColumns: [
				{ name: 'board_id', required: true, label: 'Board_ID', align: 'left', field: 'sk', sortable: true },
				{ name: 'alias', label: 'Alias', align: 'left', field: 'alias', sortable: true },
				{ name: 'board_type', label: 'Board_Type', align: 'left', field: 'board-type', sortable: true },
				{ name: 'board_revision', label: 'Board_Revision', align: 'left', field: 'board-revision', sortable: true },
				{ name: 'actions', label: 'Actions', align: 'right'}
			],
			selectedBoardId: '',
			isBoardEditing: false,
			newAlias: '',
			showLoading: false
		}
	},
	computed: {
		boardDatas(){
			return Object.values(this.$store.state.deviceData.allBoard)
		},
	},
	methods: {
		...mapActions('deviceData', {
				getDeviceData: deviceActionIds.GET_DEVICE_DATA,
				resetDeviceData: deviceActionIds.RESET_DEVICE_DATA,
		}),

		editBoard(boardId) {
			this.selectedBoardId = boardId
			this.isBoardEditing = true
			this.newAlias = propOr('', 'alias', this.$store.state.deviceData.allBoard[boardId])
		},
		async updateBoardAlias() {
			this.showLoading = true
			await invokeApiLambda(UPDATE_BOARD_ALIAS, {deviceId: this.selectedBoardId, alias: this.newAlias})
			await this.getDeviceData()
			this.showLoading = false
		},
	}
}
</script>

<style>
</style>
