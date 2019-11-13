<template>
  <div class="login-form p-5 flex h-100 flex items-center justify-center text-center">
    <div
      class
      :class="{
        'm-auto':$q.screen.gt.sm,
        'mt-0': $q.screen.lt.md
      }"
      style="max-width: 25rem"
    >
      <h4 class="text-center pt-0 mt-0">
        Confirm Registration
      </h4>
      <q-form
        ref="loginForm"
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md"
      >
        <div
          v-if="error.message"
          class="error-message p-1 text-center"
        >
          {{ error.message }}
          <div v-if="error.code==='UserNotConfirmedException'">
            <q-btn
              @click="resendConfirmation"
              color="primary"
              flat
              no-caps
            >
              Resend validation code
            </q-btn>
          </div>
        </div>
        <q-input
          outlined
          @focus="focused['code']=true; error.message = ''"
          @blur="focused['code']=false"
          v-model="codeModel.code"
          label="Confirmation code *"
          color="secondary"
          class="mnw-20em"
          lazy-rules
          :rules="[
            val => val !== null && val !== '' || 'Enter the confirmation code received via email or text message',
          ]"
        >
          <template v-slot:prepend>
            <q-icon
              :color="focused['code']?'secondary':'default'"
              name="person"
            />
          </template>
        </q-input>

        <div>
          <q-btn
            class="full-width"
            label="Confirm"
            type="submit"
            color="primary"
          />
          <!-- <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm"/> -->
        </div>
      </q-form>
      <div class="text-center mt-2">
        <q-btn
          @click="resendConfirmation"
          flat
          no-caps
          color="primary"
          href
        >
          Resend confirmation code
        </q-btn>
        <q-btn
          @click="gotoLogin"
          flat
          no-caps
          color="primary"
          href
        >
          Click me to login
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { AuthService } from '~/services/auth'
import { emailRe } from '~/constants/regexs'
import { mapGetters } from 'vuex'

export default {
	name: 'ConfrimCodePage',
	data () {
		return {
			codeModel: {
				code: ''
			},
			error: {
				message: '',
				code: ''
			},
			focused: {},
			emailRegex: new RegExp(
				emailRe
			)
		}
	},
	computed: mapGetters('userdata', [
		'username'
	]),

	methods: {
		onReset () { },
		onSubmit ($e) {
			AuthService.confirmRegistration({ code: this.codeModel.code, username: this.username })
				.then(result => {
					this.$router.push({ name: 'login' })
				})
				.catch(err => {
					this.error = err
				})
		},
		resendConfirmation ($e) {
			AuthService.resendConfirmation({ username: this.username })
				.then(result => {
					// this.$router.push({ name: "confirm-code" });
				})
				.catch(err => {
					this.error = err
				})
			// to reset validations:
			this.$refs.loginForm.resetValidation()
		},
		gotoLogin () {
			this.$router.push({ name: 'login' })
		} }
}
</script>

<style>
</style>
