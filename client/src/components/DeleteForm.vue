<script setup>
import { ref } from "@vue/reactivity"
import myAxios from "../boot/myAxios";
import Loading from "./Loading.vue";
import { useRoute,useRouter} from '../../node_modules/vue-router';
import { useQuasar } from "quasar";
const route=useRoute()
const router=useRouter()
const $q=useQuasar()
const props=defineProps({
    title:{
        required:true,
        type:String
    }
})
const loading=ref(false)
const deleteForm=async()=>{
    loading.value=true
    try{
       const data= await myAxios.delete(`/delete-form/${route.params.id}`,{data:{
            title:props.title
        }})
           $q.notify({
  message:"successfully form deleted",
  type:"positive"
});
        router.replace(`/${data.user_id}`)
    }catch(err){
   $q.notify({
  message:err,
  type:"negative"
});
    }
    loading.value=false;
}
</script>
<template>
        <q-card style="font-family: 'Righteous', cursive;" class="relative-position">
                    <q-icon class="absolute-top-right  q-ma-md cursor-pointer text-dark" size="sm" name="close" v-close-popup></q-icon>
          <q-card-section class="text-h6 text-center q-mt-xl" >
            After this process, your form will be permanently deleted.
          </q-card-section>
          <q-card-actions align="right">
            <q-btn label="cancel" class="q-mx-md q-my-sm" color="positive"  outline v-close-popup></q-btn>
            <q-btn label="delete" class="q-mx-md q-my-sm" color="negative" outline @click="deleteForm"></q-btn>
          </q-card-actions>
          <Loading :showing="loading"></Loading>
        </q-card>
</template>

