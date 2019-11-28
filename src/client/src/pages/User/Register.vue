<template>
  <div class="register-form p-5 flex h-100 justify-center">
    <div
      class
      :class="{
        'm-auto':$q.screen.gt.sm
      }"
      style="max-width: 25rem;width: 350px;"
    >
      <h4 class="text-center pt-0 mt-5">
        New Account
      </h4>
      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md"
      >
        <div
          v-if="error.message"
          class="error-message p-1 text-center"
        >
          {{ error.message }}
        </div>
        <q-input
          outlined
          @focus="focused['name']=true; setError('')"
          @blur="focused['name']=false; setError('')"
          v-model="userModel.data.name"
          label="Name "
          color="secondary"
          lazy-rules
          :rules="[
            val => val !== null && val !== '' || 'Enter your full name (First and Last)',
          ]"
        >
          <template v-slot:prepend>
            <q-icon
              :color="focused['name']?'secondary':'default'"
              name="person"
            />
          </template>
        </q-input>
        <q-input
          outlined
          @focus="focused['email']=true; setError('')"
          @blur="focused['email']=false; setError('')"
          v-model="userModel.username"
          label="Email *"
          color="secondary"
          lazy-rules
          :rules="[
            val => val !== null && val !== '' || 'Enter your registered email',
            val => val.match(emailRegex) || 'This is not a valid email'
          ]"
        >
          <template v-slot:prepend>
            <q-icon
              :color="focused['email']?'secondary':'default'"
              name="alternate_email"
            />
          </template>
        </q-input>

        <q-input
          outlined
          @focus="focused['pwd']=true; setError('')"
          @blur="focused['pwd']=false; setError('')"
          type="password"
          v-model="userModel.password"
          label="Password *"
          color="secondary"
          lazy-rules
          :rules="[
            val => passwordMatchAll() || ``
          ]"
        >
          <template v-slot:prepend>
            <q-icon
              :color="focused['pwd']?'secondary':'default'"
              name="lock"
            />
          </template>
        </q-input>
        <div
          style="margin-top: -0.8rem;"
          v-if="focused['pwd']"
        >
          <div
            :class="{
              'text-positive': passwordMatchCase('uppercase'),
              'text-negative': !passwordMatchCase('uppercase'),
            }"
          >
            <span class="check-mark">{{ passwordMatchCase('uppercase')?'✓':'×' }}</span> At least one uppercase letter (ABCDEF)
          </div>
          <div
            :class="{
              'text-positive': passwordMatchCase('lowercase'),
              'text-negative': !passwordMatchCase('lowercase'),
            }"
          >
            <span class="check-mark">{{ passwordMatchCase('lowercase')?'✓':'×' }}</span> At least one lowercase letter (abcdef)
          </div>

          <div
            :class="{
              'text-positive': passwordMatchCase('symbol'),
              'text-negative': !passwordMatchCase('symbol'),
            }"
          >
            <span class="check-mark">{{ passwordMatchCase('symbol')?'✓':'×' }}</span> At least one Symbol (!@#$%^&amp;*&gt;!&lt;/\?)
          </div>
          <div
            :class="{
              'text-positive': passwordMatchCase('number'),
              'text-negative': !passwordMatchCase('number'),
            }"
          >
            <span class="check-mark">{{ passwordMatchCase('number')?'✓':'×' }}</span> At least one number (1234567890)
          </div>
          <div
            :class="{
              'text-positive': passwordMatchCase('minimum'),
              'text-negative': !passwordMatchCase('minimum'),
            }"
          >
            <span class="check-mark">{{ passwordMatchCase('minimum')?'✓':'×' }}</span> Minimum of 8 characters long
          </div>
        </div>
        <q-input
          outlined
          @focus="focused['pwd2']=true; setError('')"
          @blur="focused['pwd2']=false; setError('')"
          type="password"
          v-model="userModel.password2"
          label="Same password again"
          color="secondary"
          lazy-rules
          :rules="[
            val => val !== null && val !== '' || 'Enter the same password',
            val => ( val === userModel.password) || 'It must match what you entered above.'
          ]"
        >
          <template v-slot:prepend>
            <q-icon
              :color="focused['pwd2']?'secondary':'default'"
              name="lock"
            />
          </template>
        </q-input>

        <div>
          <q-btn
            :loading="loading"
            class="full-width"
            label="Create account"
            type="submit"
            color="primary"
          >
            <template v-slot:loading>
              <q-spinner-gears class="on-left" /> Processing...
            </template>
          </q-btn>
        </div>
      </q-form>
      <div class="text-center mt-2">
        If your already have an account
        <router-link
          flat
          no-caps
          color="primary"
          to="login"
        >
          sign in
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { actionIds } from '~/store/userdata/allIds'
import { emailRe } from '~/constants/regexs'

export default {
	name: 'RegisterFormComponent',
	data () {
		return {
			userModel: {
				userEmail: '',
				password: '',
				password2: '',
				remember: false,
				data: {}
			},
			emailRegex: new RegExp(
				emailRe
			),
			passwordStrength: {
				strong: new RegExp(
					'^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
				),
				medium: new RegExp(
					'^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})'
				)
			}
		}
	},
	computed: mapGetters('userdata', [
		'loading', 'error', 'focused'
	]),
	methods: {
		...mapActions('userdata', {
			register: actionIds.REGISGER_USER
		}),
		...mapMutations('userdata', {
			setError: actionIds.SET_ERRORS
		}),
		onReset () { },
		onSubmit () {
			this.register(this.userModel)
		},
		passwordMatchCase (type) {
			let match = false
			switch (type) {
			case 'uppercase':
				match = this.userModel.password.match(/[A-Z]/)
				break
			case 'lowercase':
				match = this.userModel.password.match(/[a-z]/)
				break
			case 'number':
				match = this.userModel.password.match(/[0-9]/)
				break
			case 'symbol':
				match = this.userModel.password.match(/[@#$-/:-?{-~!"^_`\\\[\]]/)
				break
			case 'minimum':
				match = this.userModel.password.length >= 8
				break
			default:
				break
			}
			return match
		},
		passwordMatchAll (type) {
			const match =
                this.passwordMatchCase('minimum') &&
                this.passwordMatchCase('uppercase') &&
                this.passwordMatchCase('lowercase') &&
                this.passwordMatchCase('symbol') &&
                this.passwordMatchCase('number')
			return match
		}
	}
}
</script>

<style>
</style>
