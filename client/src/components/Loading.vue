<script setup>
const props=defineProps({
    showing:{
        required:true,
        type:Boolean
    }
})
</script>
<template>
              <q-inner-loading 
              :showing="showing"
        label="Please wait..."
        label-class="text-teal"
        label-style="font-size: 1.1em"
       />
</template>

