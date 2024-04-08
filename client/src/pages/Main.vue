<script setup></script>
<template>
  <q-page style="overflow: hidden">
    <div
      class="row justify-around q-gutter-y-md col-sm-5 absolute-center full-width"
    >
      <div class="col-7 col-sm-4 col-md-4 text-center">
        <q-img src="../assets/form.png" alt="form.png"></q-img>
      </div>
      <div
        class="col-8 col-sm-8 col-md-7 text-center text-h5 column justify-around items-center"
        style="font-family: 'Righteous', cursive"
      >
        <span v-if="$q.screen.gt.md"></span>
        <div>
          <h1 style="font-size: 2.5rem; line-height: 3.2rem">
            xFormBot helps you to create a form on Telegram and send it to
            someone to fill out.
          </h1>
          <p style="font-size: 1.3rem" class="q-mt-sm">
            You can see your form answers on our website
          </p>
        </div>
        <q-btn
          label="get started"
          color="accent"
          size="md"
          class="q-my-sm"
          type="a"
          target="_blank"
          href="https://telegram.me/x_form_bot?start=hi"
          outline
          style="padding: 10px 30px; font-size: 1rem"
        ></q-btn>
        <span></span>
      </div>
    </div>
  </q-page>
</template>

<style></style>
