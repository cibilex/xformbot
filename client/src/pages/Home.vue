<script setup>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";
// import Swiper core and required modules
import SwiperCore, { EffectCards } from "swiper";

SwiperCore.use([EffectCards]);
import myAxios from "../boot/myAxios";
import { useQuasar } from "quasar";
import { ref } from "@vue/reactivity";
import { useRoute, useRouter } from "../../node_modules/vue-router";
const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const forms = ref([]);
const showPreview = ref(false);

forms.value = await myAxios.get(`/get-form-info/${route.params.id}`);
for (const [index, form] of forms.value.entries()) {
  form.index = index;
}
</script>

<template>
  <q-page>
    <section
      style="
        font-family: 'Righteous', cursive;
        background-color: rgba(215, 210, 255, 0.6);
      "
      class="fullscreen row items-center"
    >
      <swiper :effect="'cards'" :grabCursor="true" class="col-8 col-md-4 row">
        <swiper-slide
          v-for="form in forms"
          :key="form.index"
          style="border-radius: 10px"
        >
          <div
            class="col-10 col-md-8 bg-light-blue-1 q-pa-md"
            style="border-radius: 10px"
          >
            <q-card
              class="q-py-lg text-white q-mx-none text-center on-left relative-position"
              style="
                border-radius: 10px;
                font-size: 1.4em;
                background-color: rgba(215, 210, 255, 0.6);
              "
            >
              <q-card-section
                class="text-h4 text-capitalize"
                style="word-wrap: break-word"
                >{{ form.title }}</q-card-section
              >
              <q-card-section>Created at : {{ form.created }}</q-card-section>
              <q-card-section
                >Number of respondents : {{ form.answerCount }}</q-card-section
              >
              <q-card-actions align="center">
                <q-btn
                  style="
                    font-family: 'Oregano', cursive;
                    font-size: 0.9em;
                    padding: 4px 17px;
                  "
                  @click="$router.push(`/form/${form.form_id}`)"
                  label="Read More"
                  no-caps
                  outline
                ></q-btn>
              </q-card-actions>
            </q-card>
          </div>
        </swiper-slide>
        <swiper-slide
          :key="forms.length"
          style="border-radius: 10px"
          class="full-height"
        >
          <div
            class="col-10 col-md-8 bg-light-blue-1 q-pa-md"
            style="border-radius: 10px"
          >
            <q-card
              class="q-py-lg text-white q-mx-none text-center on-left relative-position"
              style="
                border-radius: 10px;
                font-size: 1.4em;
                background-color: rgba(215, 210, 255, 0.6);
              "
            >
              <q-card-section
                class="text-h4 text-capitalize"
                style="word-wrap: break-word"
                >Let's create a form</q-card-section
              >
              <q-card-actions align="center">
                <q-btn
                  style="padding: 6px 24px"
                  type="a"
                  target="_blank"
                  href="https://telegram.me/x_form_bot?start=hi"
                  size="lg"
                  label="Create"
                  no-caps
                  outline
                ></q-btn>
              </q-card-actions>
            </q-card>
          </div>
        </swiper-slide>
      </swiper>
    </section>
  </q-page>
</template>
