<template>
  <div class="login-text p-5 h-100">
    <div class="flex items-center justify-center text-center p-1">
      <div class="p-5">
        <h4>Confirm Registration</h4>
        <div
          v-if="error.message"
          class="error-message p-1 text-center"
        >
          {{ error.message }}
        </div>
        <div>
          <p>
            Enter the confirmation code received via email or text message. <router-link
              flat
              no-caps
              color="primary"
              to="confirm-code"
            >
              Click me to confirm!
            </router-link>
          </p>
          <p>
            Having trouble finding the code?
            <q-btn
              @click="resendConfirmation"
              dense
              flat
              no-caps
              color="primary"
            >
              Resend it.
            </q-btn>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { actionIds } from '~/store/userdata/allIds'

export default {
	name: 'ConfirmTextPage',
	data () {
		return {}
	},
	computed: mapGetters('userdata', [
		'username', 'error'
	]),
	methods: {
		resendConfirmation () {
			debugger
			this.resendCode(this.username)
		},
		...mapActions('userdata', {
			resendCode: actionIds.RESEND_CONFIRM_CODE
		})
	}
}
</script>

<style>
</style>
