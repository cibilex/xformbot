<script setup>
import {  ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import myAxios from "../boot/myAxios";
import {  useRouter} from '../../node_modules/vue-router';
import { useQuasar } from "quasar";
import Loading from "./Loading.vue";
const $q=useQuasar();
const router=useRouter()
const loading=ref(true)
const answering=ref({})
    const props=defineProps({
        answerInfo:{
            type:Object,
            required:true
        }
    })
const emits=defineEmits(['answerDeleted'])
const getAnswers=async()=>{
try{
const res=await myAxios.post(`/get-answers`,props.answerInfo)
answering.value=res;
}catch(error){
  console.log("hata olduasdasd")
     $q.notify({
         message:error.message,
         type:"warning"
     })
}
loading.value=false;
}

onMounted(()=>getAnswers())
const deleteAnswer= async()=>{
  loading.value=true;
  try{
    const res=await myAxios.delete('/delete-answer',{data:props.answerInfo})
    if(!res.success) throw new Error('something went wrong')
     $q.notify({
         message:"successfully answer deleted",
         type:"positive"
     })
     emits('answerDeleted')
  }catch(err){
         $q.notify({
         message:err,
         type:"warning"
     })
     loading.value=false;
     router.replace('/')
  }
}
</script>
<template>
    <q-list bordered class="rounded-borders bg-grey-2 q-py-xl relative-position" style="font-family: 'Roboto Slab', serif;">
        <div v-if="Object.keys(answering).length!=0">
                    <div class="absolute-bottom-right q-ma-md  text-grey-8">{{answering.createdAt}}</div>
        <q-icon class="absolute-top-right q-ma-md cursor-pointer text-dark" size="sm" name="close" v-close-popup></q-icon>
        <q-item-label class="justify-around text-capitalize row text-h6 q-my-md" style="font-family: 'Righteous', cursive;">
            <span>{{answering.answering.first_name}}</span>
            <span>{{answering.answering.last_name}}</span>
        </q-item-label>
        <div  v-for="answer of answering.answers" :key="answer.question_index" class="on-left on-right">
                      <q-expansion-item>
            <template v-slot:header>
          <q-item-section avatar>{{answer.answer.question_index+1}}</q-item-section>

          <q-item-section class="column">
            <span class="text-body2 question-title">{{answer.question.question}} ?</span>
            <!-- <span class="text-caption">{{answer.question.required ? 'required' : 'opsionel'}}</span> -->
</q-item-section>
        </template>
      <q-card>
        <q-card-section class="text-center text-bold question-title"> {{answer.answer.answer}}</q-card-section>
      </q-card>
    </q-expansion-item>
      <q-separator />
        </div>
      <q-card-actions align="center" class="q-my-md">
          <q-btn label="Delete" outline color="negative" @click="deleteAnswer"  style="padding:7px 30px;font-weight:500;font-family:arial;" size="md"></q-btn>
      </q-card-actions>
        </div>
        <loading :showing="loading"></loading>
    </q-list>
</template>


<style>
.question-title:first-letter {
    text-transform: uppercase;
}
</style>