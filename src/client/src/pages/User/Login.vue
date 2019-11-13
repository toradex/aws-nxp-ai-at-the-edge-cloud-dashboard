<template>
  <div class="login-form p-5 flex h-100 justify-center">
    <div
      class
      :class="{
        'm-auto':$q.screen.gt.sm,
        'mt-0': $q.screen.lt.md
      }"
      style="max-width: 25rem"
    >
      <h4 class="text-center pt-0 mt-0">
        Sign In
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
          @focus="focused['email']=true; setError('')"
          @blur="focused['email']=false"
          v-model="loginModel.username"
          label="Email "
          color="secondary"
          lazy-rules
          :rules="[
            val => val !== null && val !== '' || 'Enter your registered username or email',
          ]"
        >
          <template v-slot:prepend>
            <q-icon
              :color="focused['email']?'secondary':'default'"
              name="person"
            />
          </template>
        </q-input>

        <q-input
          outlined
          @focus="focused['pwd']=true; setError('');"
          @blur="focused['pwd']=false"
          type="password"
          v-model="loginModel.password"
          label="Password *"
          color="secondary"
          lazy-rules
          :rules="[
            val => val !== null && val !== '' || 'Enter your password']"
        >
          <template v-slot:prepend>
            <q-icon
              :color="focused['pwd']?'secondary':'default'"
              name="lock"
            />
          </template>
        </q-input>

        <q-toggle
          v-model="loginModel.remember"
          label="Remember me"
        />

        <div>
          <q-btn
            :loading="loading"
            class="full-width"
            label="Sign In"
            type="submit"
            color="primary"
          >
            <template v-slot:loading>
              <q-spinner-gears class="on-left" /> Processing...
            </template>
          </q-btn>
          <!-- <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm"/> -->
        </div>
      </q-form>
      <div class="text-center mt-2">
        <q-btn
          @click="gotoPasswordHelp"
          flat
          no-caps
          color="primary"
          href
        >
          Password help
        </q-btn>
        <q-btn
          @click="gotoRegister"
          flat
          no-caps
          color="primary"
          href
        >
          Create new account
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { actionIds } from '~/store/userdata/allIds'

export default {
	name: 'LoginFormComponent',
	data () {
		return {
			loginModel: {
				username: '',
				password: '',
				remember: false
			},
			focused: {}
		}
	},
	computed: mapGetters('userdata', [
		'error', 'loading'
	]),
	methods: {
		...mapActions('userdata', {
			login: actionIds.LOGIN,
			setError: actionIds.SET_ERRORS,
			resendConfirm: actionIds.RESEND_CONFIRM_CODE
		}),
		onReset () { },
		onSubmit ($e) {
			this.login(this.loginModel)
		},
		resendConfirmation ($e) {
			this.resendConfirm(this.loginModel.username)
		},
		gotoRegister () {
			this.$router.push({ name: 'register' })
		},
		gotoPasswordHelp () {
			this.$router.push({ name: 'forget-password' })
		}
	}
}
</script>

<style>
</style>
