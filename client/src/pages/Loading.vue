<script setup>
import { onMounted, ref } from "@vue/runtime-core";
const iconColor=ref('grey-1')
const currentColors=["pink-1","pink-2","pink-3","pink-4","pink-5"]
        let index=0;
setInterval(()=>{
iconColor.value=currentColors[index];
index++
if(index>4)index=0
},1000)
</script>

<template>
<q-page>
        <div class="fullscreen column justify-around items-center" id="loading">

                             <h1 style="font-family: 'Tourney', cursive;" class="text-h3 text-grey-1"> xFormBot</h1>
 

           <q-spinner-cube   :color="iconColor" size="12em"  />
           <div></div>

                </div>

</q-page>
</template>
