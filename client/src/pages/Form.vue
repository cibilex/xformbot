<script setup>import myAxios from '../boot/myAxios';
import { useRoute } from '../../node_modules/vue-router';
import { reactive, ref } from '@vue/reactivity';
import { useQuasar } from 'quasar';
import Answer from '../components/Answer.vue';
import Loading from '../pages/Loading.vue';
import DeleteForm from '../components/DeleteForm.vue';
const route=useRoute()
const $q=useQuasar()
const rows=ref([])
const title=ref(null)
const loadings=ref(false)
const formDialog=ref(false)
const answerInfo=reactive({question_id:route.params.id,answer_id:""})
const deleteDialog=ref(false)

     const res=await myAxios(`/get-form/${route.params.id}`)
    for(const [index,value] of res.answers.entries()){
      value.index=index+1
    }
    rows.value=res.answers;
    title.value=res.title

const columns = [
{
  name:"index",
  field:row=>row.index,
  sortable:true,
align:"center",
},
{
  name:"first_name",
  label:"First name",
  field:row=>row.answering.first_name,
  sortable:true,
align:"center",
},
{
  name:"last_name",
  label:"Last name",
  field:row=>row.answering.last_name,
  sortable:true,
align:"center",
},{
  name:"reply_date",
  label:"Reply date",
  field:row=>row.created,
  sortable:true,
  sort:(a,b)=>new Date(b) - new Date(a),
 align:"center",
},{
  name:"show",
  label:"",  
align:"center",
}
 ];

 const showAnswer=(id)=>{
   answerInfo.answer_id=id
   formDialog.value=true;
 }
 const answerDeleted=async()=>{
   formDialog.value=false;
   loadings.value=true
     const data=await myAxios(`/get-form/${route.params.id}`)
    for(const [index,value] of data.answers.entries()){
      value.index=index+1
    }
    rows.value=data.answers;
    title.value=data.title
  loadings.value=false;
 }
</script>
<template>
    <q-page v-if="res">
        <h5 class="text-center q-pt-xl text-capitalize" style="font-family: 'Righteous', cursive;">{{title}}</h5>
      <div class="row justify-center">
      <q-table
      class="col-10 col-sm-10  col-md-8 col-lg-7 q-mt-xl"
    table-style="max-height:2450px;"
    :rows="rows"
    :row-key="(row) => row.index"
    :columns="columns"
    table-header-class="text-center text-uppercase text-bold"
    table-header-style="font-family: 'Righteous', cursive;"
    table-class="text-capitalize"
     style="background-color:rgba(215,210,255,.4);font-weight:700;font-family: 'EB Garamond', serif;"
    square
    >
    <!-- @request="onRequest" -->
    <!-- :hide-bottom="rows.length<=7"  -->
 <template v-slot:no-data="{ message }">
            <div v-if="message!='No data available'" class=" full-width row flex-center text-body2 q-mt-lg text-blue-8 q-gutter-sm">
              <q-icon size="2em" name="icon-ma-sentiment_satisfied_alt" />
          <span>
         {{ message }}
          </span>
          <q-icon size="2em" name="icon-ma-pending" />
            </div>
        <div v-else class="full-width  flex-center column  text-body2 q-mt-lg text-dark q-gutter-sm q-my-xl">
          <h6 class="text-center" style="font-family: 'Righteous', cursive;">No one has answered this form yet</h6>
        </div>
      </template>
    <template v-slot:body-cell-show="props">
      <q-td key="name" :props="props" class="text-weight-bold text-grey-8">
        <q-btn @click="showAnswer(props.row.id)" label="show" outline color="dark"  style="background-color:rgba(215,210,255,.4);font-weight:700;font-family: 'Righteous', cursive;"></q-btn>
      </q-td>
    </template>


  </q-table>
  <q-card class="col-10 col-sm-10  col-md-8 col-lg-7 q-mt-xl">
    <q-card-section>
                <h6 class="text-center" style="font-family: 'Righteous', cursive;">Send this form to somebody to answer the form</h6>
                <div class="row justify-around full-width q-my-md q q-gutter-x-xs q-gutter-y-md">
            <q-btn outline type='a' target="_blank"  style="color:#1da1f2;" icon="icon-fa-twitter-square-brands"  :href="`https://twitter.com/intent/tweet?url=t.me/xFormBot?start=${$route.params.id}&text=Hi there,click this link to fill the form%0aForm title : ${title.toUpperCase()}%0a&hashtags=xformbot,form,telegram`"  ></q-btn>
            <q-btn outline type='a' target="_blank" style="color:#1877f2;" icon="icon-fa-facebook-brands" :href="`https://www.facebook.com/sharer.php?u=t.me/xFormBot?start=${$route.params.id}`"  ></q-btn>
            <q-btn outline type='a' target="_blank"  color="positive" icon="icon-fa-whatsapp-brands" :href="`https://api.whatsapp.com/send?&text=Hi there,click this link to fill the form%0aForm title : ${title.toUpperCase()}%0a%20t.me/xFormBot?start=${$route.params.id}`"  ></q-btn>
            <q-btn outline type='a' target="_blank" style="color:#0a66c2;" icon="icon-fa-linkedin-brands" :href="`https://www.linkedin.com/sharing/share-offsite/?url=t.me/xFormBot?start=${$route.params.id}`"  ></q-btn>
            <q-btn outline type='a' target="_blank" style="color:#0088cc;" icon="icon-fa-telegram-brands" :href="`tg://msg_url?url=t.me/xFormBot?start=${$route.params.id}&text=Hi there,click this link to fill the form%0aForm title : ${title.toUpperCase()}%0a&hashtags=xformbot,form,telegram`"  ></q-btn>
          </div>
    </q-card-section>
  </q-card>
    <q-card class="col-10 col-sm-10  col-md-8 col-lg-7 q-mt-xl bg-transparent " flat>
      <q-card-actions align="around">
        <q-btn label="delete form" color="negative" class="shadow-12" @click="deleteDialog=true" style="padding:10px 40px;font-family: 'Righteous', cursive;"></q-btn>
      </q-card-actions>
  </q-card>
      </div>
      <q-dialog v-model="formDialog"  full-width full-height ><answer @answerDeleted="answerDeleted" :answerInfo="answerInfo" ></answer></q-dialog>
      <q-dialog v-model="deleteDialog" persistent >
      <delete-form :title="res.title"></delete-form>
      </q-dialog>
          <loading  v-if="loadings"></loading>
    </q-page>
</template>


