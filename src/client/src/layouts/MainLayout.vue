<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title
          class="row items-center"
          alignment="horizontal-content-center"
        >
          <img
            :src="'statics/logos/toradex-white.svg'"
            spinner-color="white"
            style="toradex-logo"
            class="responsive toradex-logo"
          >
          <img
            :src="'statics/logos/aws-logo.svg'"
            spinner-color="white"
            class="responsive aws-logo"
          >
          <img
            :src="'statics/logos/nxp-logo.svg'"
            spinner-color="white"
            class="responsive nxp-logo"
          >
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <transition
        name="transitions"
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        mode="out-in"
      >
        <router-view />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
	name: 'MainLayout',
	data () {
		return {
			leftDrawerOpen: this.$q.platform.is.desktop
		}
	},
	methods: {
		openURL
	}
}
</script>

<style lang="stylus">
.q-toolbar {
    height: 70px;
}

.toradex-logo {
    min-height: 21px;
    max-height: 60px;
}

.aws-logo {
    min-height: 21px;
    max-height: 40px;
    margin-left: 20px;
}

.nxp-logo {
    min-height: 21px;
    max-height: 60px;
    margin-left: 20px;
}
</style>
