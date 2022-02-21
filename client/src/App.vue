<script setup>
</script>
<template> 
<div style="background-color:rgba(215,210,255,.6);"> 
         <div style="z-index:11111;text-shadow:1px 1px 1px grey;font-family: 'Tourney', cursive;color:#e0ffff;" class="row items-center fixed-top-left q-my-md q-mx-lg text-h5 text-bold  cursor-pointer" @click="$router.push('/')"> <span class="text-h3">X</span>FormBot</div>
<router-view />
</div>
</template>
