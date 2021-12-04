const express = require("express");
const { Telegraf, Telegram, Markup, Scenes, session } = require("telegraf");
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: "./helpers/.env" });
const addQuestion = require("./controllers/addQuestions");
const { getAllQuestionTitles, getQuestionId, getQuestionWithId } = require("./controllers/getOperations");
const PORT = process.env.PORT || 5000;
const token = process.env.BOT_TOKEN;
if (token === undefined) {
  throw new Error("BOT_TOKEN must be provided!");
}
const bot = new Telegraf(token);
// const telegram=new Telegram(token)
const doneForm = (ctx) => (ctx.message.text == "/done" ? true : false);
const isNotText=(ctx)=>ctx.message.text ? false : true
let currentIndex;
//hata ayıklama eksik.
const createQuestion = (ctx) => {
  if(isNotText(ctx)) return ctx.reply("Sorry, I only support text and emoji for questions and answers.")
  if (ctx.message.text.length < 3)return ctx.reply("question length must be greater than 2");
  ctx.wizard.state.form.push({
    question: ctx.message.text,
  });
  currentIndex = ctx.wizard.state.form
    .map((e) => e.question)
    .indexOf(ctx.message.text);
  ctx.wizard.state.form[currentIndex].index=currentIndex
  ctx.replyWithHTML(
    `
    ➜ Creating a new queston:  <strong>${
     ctx.wizard.state.form[currentIndex].question
   } ? </strong>

➜ Please choose  type of the question.
  
➜ For cancelling to the operation send <strong>${"/cancel"}</strong>
  `,
    Markup.keyboard([["Text", "Number"]])
      .resize()
      .oneTime()
  );
  return ctx.wizard.selectStep(2);
};
const leaveToCreateForm = (ctx) =>
  ctx.message.text == "/cancel" ? true : false;
const createFormWizard = new Scenes.WizardScene(
  "create-form-wizard", // first argument is Scene_ID, same as for BaseScene
  (ctx) => {
    if (!("form" in ctx.wizard.state)) ctx.wizard.state.form = [];
    ctx.replyWithHTML(`➜ Enter the first question`);
    return ctx.wizard.next();
  },
  (ctx) => createQuestion(ctx),
  (ctx) => {
    if(isNotText(ctx)) return ctx.reply("⚠️ you must send a text or image.")
    const text = ctx.message.text.toLowerCase();
    if (leaveToCreateForm(ctx)) {
      ctx.wizard.state.form = [];
      ctx.reply("creating the form operation is cancelled",{reply_markup:{remove_keyboard:true}});
      return ctx.scene.leave();
    }
    if (text != "text" && text != "number")
      return ctx.reply("⚠️ please send a valid type");
    ctx.wizard.state.form[currentIndex].type = ctx.message.text;
    ctx.reply('➜ please send a question case',Markup.keyboard([
      ['Required','Opsionel']
    ]).resize()
    .oneTime())
    return ctx.wizard.next();
  },ctx=>{
    if(isNotText(ctx)) return ctx.reply("⚠️ you must send a text or image.")
    if (leaveToCreateForm(ctx)) {
      ctx.wizard.state.form = [];
      ctx.reply("➜ creating the form operation is cancelled",{reply_markup:{remove_keyboard:true}});
      return ctx.scene.leave();
    }
    const text=ctx.message.text.toLowerCase()
    if(text!='opsionel' && text!='required') return ctx.reply('⚠️ please send a valid question case.')
    ctx.wizard.state.form[currentIndex].required = text=='required' ? true : false;
    ctx.replyWithHTML(  
      `
      ➜ Good. Now send me another question.
  
➜ When you've added enough questions, simply send  <strong>${"/done"}</strong> to publish the form.

➜ For cancelling to the operation send <strong>${"/cancel"}</strong>
`,
      { reply_markup: { remove_keyboard: true } }
    );
    return ctx.wizard.next();
  }
  ,
  async (ctx) => {
    if(isNotText(ctx)) return ctx.reply("⚠️ you must send a text or image.")
    if (leaveToCreateForm(ctx)) {
      ctx.wizard.state.form = [];
      ctx.reply("➜ creating the form operation is cancelled",{reply_markup:{remove_keyboard:true}});
      return ctx.scene.leave();
    }
    if (!doneForm(ctx)) return createQuestion(ctx);
    ctx.reply("➜ Please send the form title");
    return ctx.wizard.next();
  },async ctx=>{
    if(isNotText(ctx)) return ctx.reply("⚠️ you must send a text or image.")
    if (leaveToCreateForm(ctx)) {
      ctx.wizard.state.form = [];
      ctx.reply("➜ creating the form operation is cancelled",{reply_markup:{remove_keyboard:true}});
      return ctx.scene.leave();
    }
    if(ctx.message.text.length>=30 || ctx.message.text.length<=3) return ctx.reply("⚠️ question title must be greater than 3 and lesser than 30")
    try{
      const peyload={
        user:ctx.message.from.id,
        title:ctx.message.text,
        questions:ctx.wizard.state.form
      }
      const isDocExist=await getQuestionId(peyload)
      if(isDocExist) return ctx.reply('⚠️ please send a unique question title.')
     const doc= await addQuestion(peyload)
      console.log("başarılı şekilde eklendi")
      ctx.replyWithHTML(`
      👍 Form created. Use this link to share it to a person : <b>https://telegram.me/cibilexBot?start=${doc.id}</b>

 ➜ Seeing the forms you have created, please send  <b>/myForms</b>
      `);
      
      return ctx.scene.leave();
    }catch(err){console.log(err)}
    
  }
);
bot.command("/myForms",async (ctx)=>{
  const titles=await getAllQuestionTitles(ctx.message.from.id)

  const docList=[]
  for(const title of titles){
docList.push(Markup.button.callback(title,`getQuestion=${title}`))
  }
 await ctx.replyWithHTML('<b>Your forms 💨</b>',Markup.inlineKeyboard([
    ...docList
  ],{wrap: () => true}))
  ctx.reply('➜ please click to publish the form')
})
//tüm inline actiona alınmamış bot actionları için çalışır.Dikkat edilmeli.
//paylaşılan linklerde kullanıcı id si var.
bot.action(/.+/, async(ctx) => {
  const data=ctx.match[0].split("=")
if(data[0]!='getQuestion') return ctx.reply("⚠️ this is not a get question operation")
  const peyload={
    user:ctx.update.callback_query.from.id,
    title:data[1],
    request:'id'
  }
const questionId=await getQuestionId(peyload)
if(!questionId) return ctx.reply('⚠️ no question with that inputs')
ctx.replyWithHTML(`➜ Use this link to share it to a person : t.me/CibilexBot?start=${questionId}`)
return ctx.answerCbQuery()
})
const stage = new Scenes.Stage([createFormWizard]);
bot.use(session());
bot.use(stage.middleware());
bot.hears("s", (ctx) => ctx.scene.enter("create-form-wizard"));
bot.start(async(ctx) => {
  if(ctx.startPayload.length!=20) return ctx.reply('please send a valid question data')
  const question=await getQuestionWithId(ctx.startPayload)
  if(!question) return ctx.reply('no form with that infos')
  ctx.reply('question is here,dont worryasmdas')
  console.log(question)
})
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on("sticker", (ctx) => ctx.reply("👍"));
bot.hears("hi", (ctx) => ctx.reply("Hey there"));

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

// const secretPath = `/telegraf/${bot.secretPathComponent()}`
// // npm install -g localtunnel && lt --port 3000
const app = express();
// bot.telegram.setWebhook(`https://rotten-termite-85.loca.lt/${secretPath}`)
bot.launch();
app.get("/", (req, res) => res.send("Hello World!"));
// app.use(bot.webhookCallback(secretPath))
app.listen(PORT, () => {
  console.log(`app listenin on port ${PORT}`);
});
