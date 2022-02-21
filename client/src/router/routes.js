const routes = [
{
  path:"/",name:"MainLayout",
  meta:{
    title:"Create and reply forms on telegram",
  },component:()=>import("../layouts/MainLayout.vue"),children:[
    {
      path: "",
      name: "Main",
      component:()=>import("../pages/Main.vue")
    },
    {
      path: ":id",
      name: "Home", meta:{
        title:"My Forms",
      },
      component:()=>import("../pages/Home.vue")
    },
    {
      path:"form/:id",
      name:"Form", meta:{
        title:"Form replys",
      },
      component:()=>import('../pages/Form.vue')
    },
  ]
},
{
  path: '/:catchAll(.*)*', meta:{
    title:"404 Not Found"
  },
  component: () => import('../pages/Error404.vue')
}
  ];


  export default routes