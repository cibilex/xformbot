<script setup>
import { onErrorCaptured, ref } from "@vue/runtime-core";
import Loading from "../pages/Loading.vue";
import { useRoute, useRouter } from '../../node_modules/vue-router';
import { useQuasar } from "quasar";
const $q=useQuasar()
const router=useRouter()
const compErr=ref(false)
onErrorCaptured(e=>{
  console.log(e)
  compErr.value=e
   $q.notify({
  message:e,
  type:"negative"
});
  router.replace("/")
  return false
})
</script>
<template>
  <q-layout view="lHh lpR lFf">
    <q-page-container>
<router-view v-slot="{ Component }">
  <template v-if="Component">
    <!-- <div v-if="compErr"> -->
      <!-- <h5 class="text-center q-my-md">Something went wrong</h5>
        <h5 class="text-center q-my-md">{{compErr}}</h5></div> -->
<!-- <transition-group v-else
  appear
  enter-active-class="animated fadeIn"
  leave-active-class="animated fadeOut"
> -->

               <suspense :timeout="0">
          <template #default>
            <component :is="Component"></component>
            </template>
          <template #fallback>
            <loading></loading>
          </template>
        </suspense>
<!-- </transition-group> -->
  </template>
</router-view>
    </q-page-container>
  </q-layout>
</template>