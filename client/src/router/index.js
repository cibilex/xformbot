import { createRouter, createWebHistory } from "../../node_modules/vue-router";
import routes from "./routes";
const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  //önceki metayı dğeil default meta ve metatags oluştur.Oluşturulan routelarda meta yoksa bunlar eklensin.
  const  nearestMetaTitle = to.matched.slice().reverse().find((route) => route.meta && route.meta.title);

  const nearestMetaTags = to.matched.slice().reverse().find((route) => route.meta && route.meta.metaTags);
  const mainHeader = {
    title: " Create and reply forms on telegram",
    // metaTags:[
    //   {name:"description",content:"xFormBot is  a telegram bot to create and answer forms.You can see your forms  on our site.Create form easily on telegram and send it someone to fill it."},{property:"og:type",content:"website" },{property:"og:url",content:"https://metatags.io/"},
    //   {property:"og:title",content:"xFormBot | Create and reply forms on telegram"},
    //   {property:"og:description",content:"xFormBot is  a telegram bot to create and answer forms.You can see your forms  on our site.Create form easily on telegram and send it someone to fill it."},
    //   {property:"og:image",content:"./public/xFormBot.png"},
    //   {property:"twitter:url",content:"https://metatags.io/"},
    //   {property:"twitter:title",content:"xFormBot | Create and reply forms on telegram"},
    //   {property:"twitter:description",content:"xFormBot is  a telegram bot to create and answer forms.You can see your forms  on our site.Create form easily on telegram and send it someone to fill it."},
    //   {property:"twitter:image",content:"./public/xFormBot.png"},
    //   {property:"twitter:card",content:"summary_large_image"},
    //   {name:"keywoards",content:"Telegram bot,create bot,telegram form bot,telegram form generator,xFormBot,xformbot,create form on telegram,form generator,create telegram form,,form bot,create form on telegram,x form bot,telegram bot input form"}
    // ]
  };
  nearestMetaTitle ? document.title= `xFormBot | ${nearestMetaTitle.meta.title}` : document.title=`xFormBot |  ${mainHeader.title}`;  //If There is a title in the directory ,take it.else if look at the main layout directory. Else use the main title .
 
  // Array.from(document.querySelectorAll('[for-public-urls]')).map(el => el.parentNode.removeChild(el)); 
  // if(to.path=="/" || to.path==""){
  //   document.getElementById("robot-meta-tag").content="index,follow"
  //   mainHeader.metaTags.map(tagDef => {       //add current meta tags
  //     const tag = document.createElement('meta');
  //     Object.keys(tagDef).forEach(key => {
  //       tag.setAttribute(key, tagDef[key]);
  //     });
  //     tag.setAttribute('for-public-urls', '');
  //     return tag;
  //   })
  //   .forEach(tag => document.head.appendChild(tag));
  // }
  // else document.getElementById("robot-meta-tag").content="noindex,nofollow"
  next();
});
export default router;