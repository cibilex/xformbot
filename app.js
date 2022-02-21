require("dotenv").config({ path: "./helpers/.env" });
const express = require("express");
const { Telegraf,Markup, Scenes, session } = require("telegraf");
const {addQuestion,addAnswer} = require("./controllers/addOperations");
const { getAllQuestionTitles, getQuestionId, getQuestionWithId } = require("./controllers/getOperations");
const history = require('connect-history-api-fallback');
const PORT = process.env.PORT || 5000;
const token = process.env.BOT_TOKEN;
if (token === undefined) {
  throw new Error("BOT_TOKEN must be provided!");
}

const bot = new Telegraf(token);

const doneForm = (ctx) => (ctx.message.text == "/done" ? true : false);
const isNotText=(ctx)=>ctx.message.text ? false : ctx.reply("⚠️ I can just understand from text and emoji.")
const isCommand=ctx=>ctx.message.text.startsWith("/") ? ctx.reply('⚠️ The operation continues. To send a command, you must first cancel or complete the operation.')  : false
const isBot=(ctx)=>{if(ctx.message.from.is_bot) {
  ctx.reply('Bots cannot create  a form.Go home bot.')
  return ctx.scene.leave()}
  else return  false }
  const leaveToOperation = (ctx) =>{
    if(ctx.message.text == "/cancel") {
      delete ctx.wizard.state.form;
      ctx.reply("creating the form operation is cancelled",{reply_markup:{remove_keyboard:true}});
      return ctx.scene.leave();
    }
    else return false};
const createQuestion = (ctx) => {
  if (ctx.message.text.length < 3)return ctx.reply("question length must be greater than 2");
  ctx.wizard.state.form.push({
    question: ctx.message.text,
  });
  const currentIndex = ctx.wizard.state.form
    .map((e) => e.question)
    .indexOf(ctx.message.text);
  ctx.wizard.state.form[currentIndex].index=currentIndex
  ctx.replyWithHTML(
    `
    ➜ Creating a new queston:  <strong>${
     ctx.wizard.state.form[currentIndex].question
   } ? </strong>

➜ Please choose  type of the question.
  
➜ For cancelling to the operation send <strong> /cancel </strong>
  `,
    Markup.keyboard([["Text", "Number"]])
      .resize()
      .oneTime()
  );
  return ctx.wizard.selectStep(2);
};

  const createFormWizard = new Scenes.WizardScene(
  "create-form-wizard", 
  (ctx) => {
    if(isBot(ctx)) return 
    if ("form" in ctx.wizard.state){
      ctx.reply('⚠️ already form operatin is exist.First,Finish current form operation.')
      return ctx.scene.leave()
    }
     ctx.wizard.state.form=[]
    ctx.replyWithHTML(`➜ Enter the first question`);
    return ctx.wizard.next();
  },
  (ctx) => {
    if(isNotText(ctx) || isCommand(ctx) || isBot(ctx)) return
    return createQuestion(ctx)
  },
  (ctx) => {
    if(isNotText(ctx) || isBot(ctx) ||leaveToOperation(ctx)) return
    if(isCommand(ctx)) return
    const text = ctx.message.text.toLowerCase();
    if (text != "text" && text != "number") return ctx.reply("⚠️ please send a valid type");
    ctx.wizard.state.form[ctx.wizard.state.form.length-1].type = ctx.message.text;
    ctx.reply('➜ please send a question case',Markup.keyboard([
      ['Required','Opsionel']
    ]).resize()
    .oneTime())
    return ctx.wizard.next();
  },ctx=>{
    if(isNotText(ctx) || isBot(ctx) || leaveToOperation(ctx)) return
    if(isCommand(ctx))return
    const text=ctx.message.text.toLowerCase()
    if(text!='opsionel' && text!='required') return ctx.reply('⚠️ please send a valid question case.')
    ctx.wizard.state.form[ctx.wizard.state.form.length-1].required = text=='required' ? true : false;
    ctx.replyWithHTML(  
      `
      ➜ Good. Now send me another question.
  
➜ When you've added enough questions, simply send  <strong> /done </strong> to publish the form.

➜ For cancelling to the operation send <strong> /cancel </strong>
`,
      { reply_markup: { remove_keyboard: true } }
    );
    return ctx.wizard.next();
  }
  ,
  async (ctx) => {
    if(isNotText(ctx) || leaveToOperation(ctx)) return 
    if(!doneForm(ctx) && isCommand(ctx)) return
    if (!doneForm(ctx)) return createQuestion(ctx);
    ctx.reply("➜ Please send the form title");
    return ctx.wizard.next();
  },async ctx=>{
    if(isNotText(ctx)) return
    if (leaveToOperation(ctx)) return
    if(isCommand(ctx)) return 
    if(ctx.message.text.length>=30 || ctx.message.text.length<=3) return ctx.reply("⚠️ question title must be greater than 3 and lesser than 30")
    try{
      const peyload={
        user:ctx.message.from,
        title:ctx.message.text,
        questions:ctx.wizard.state.form
      }
      const isDocExist=await getQuestionId(peyload)
      if(isDocExist) return ctx.reply('⚠️ please send a unique question title.')
     const doc= await addQuestion(peyload)
     delete ctx.wizard.state.form;
      ctx.replyWithHTML(`
      👍 Form created. Use this link to share it to a person : <b>https://telegram.me/xFormBot?start=${doc.id}</b>

 ➜ Seeing the forms you have created, please send  <b>/myforms</b>
      `);
      
      return ctx.scene.leave();
    }catch(err){
      console.log(err)
      ctx.reply('something went wrong,please try again later')
      return ctx.scene.leave()
    }
    
  }
);
const qRequiredMessage=(required) =>  `📌 This question is ${required ? 'required' : "optional.Enter /skip to go next question."}`
const currentQuestion=ctx=> ctx.wizard.state.form.questions[ctx.wizard.state.formAnswers.length] 
const CreateQuestionModal=ctx=>{
  const questionTitle=ctx.wizard.state.form.title
  ctx.replyWithHTML(`
     <b>📄 ${questionTitle.toUpperCase()}</b>

<i> ▪ Question ${ctx.wizard.state.formAnswers.length+1}</i> : ${currentQuestion(ctx).question} ?

${qRequiredMessage(currentQuestion(ctx).required)}

➜ For cancelling to the operation send <strong> /cancel </strong>
<pre>                                                     ${ctx.wizard.state.formAnswers.length+1}/${ctx.wizard.state.form.questions.length}</pre>

  `)
}
const answerFormWizard=new Scenes.WizardScene('answer-form-wizard',
async(ctx) => {
   if ("form" in ctx.wizard.state || "formAnswers" in  ctx.wizard.state){
      ctx.reply('⚠️ already form operatin is exist.First,Finish current form operation.')
      return ctx.scene.leave()
   }
   let data;
   try{
    data=await getQuestionWithId(ctx.startPayload)
   }catch(err){
    console.log(err)
    ctx.reply('something went wrong,please try again later')
    return ctx.scene.leave()
   }
   if(!data){
ctx.reply('⚠️ no form with that infos')
return ctx.scene.leave()
   }
   ctx.wizard.state.form={...data,question_id:ctx.startPayload}
   ctx.wizard.state.formAnswers=[]
   CreateQuestionModal(ctx)
  return ctx.wizard.next();
},
async(ctx) => {
  if(isNotText(ctx) || isBot(ctx) || leaveToOperation(ctx)) return 
  const crQuestion=currentQuestion(ctx)
  if(ctx.message.text=='/skip' && crQuestion.required || crQuestion.required && !ctx.message.text) return ctx.reply('⚠️ please answer this question.The answer of this question is required.')
  if( ctx.message.text!='/skip' && isCommand(ctx))return
  if(crQuestion.type=='number' && isNaN(ctx.message.text)) return ctx.reply('⚠️ The answer type must be number.')
  if(crQuestion.type=='string' && !isNaN(ctx.message.text)) return ctx.reply('⚠️ the answer type must be string.')
  ctx.wizard.state.formAnswers.push({
    question_index:crQuestion.index,
    answer:ctx.message.text=='/skip' ?  'not answered' : ctx.message.text
  })
  if(ctx.wizard.state.form.questions.length!=ctx.wizard.state.formAnswers.length)   return CreateQuestionModal(ctx)

  const answers={
    answering:ctx.message.from,
    creative:ctx.wizard.state.form.user,
    answers:ctx.wizard.state.formAnswers,
    question_id:ctx.wizard.state.form.question_id
  }

  try{
    await addAnswer(answers)
  }  catch(err){
    console.log(err)
    ctx.reply('something went wrong,please try again later')
    return ctx.scene.leave()
  }
  ctx.replyWithHTML(`
  ➜ Questions are done and answers recorded.

➜ Thans for answering.

➜ You can delete this chat.`)
  //veritabanına kaydet ve çık 
  return ctx.scene.leave()
})
bot.command("/myforms",async (ctx)=>{
  let titles;
  try{
    titles=await getAllQuestionTitles(ctx.message.from.id)
  }catch(err){
    console.log(err)
    ctx.reply('something went wrong,please try again later')
    return ctx.scene.leave()
  }
  if(!titles) return ctx.reply(`
  You don't have form yet.

➜ to create a form.send me /newform
  `)
  const docList=[]
  for(const title of titles){
docList.push(Markup.button.callback(title,`getQuestion=${title}`))
  }
 await ctx.replyWithHTML('<b>Your forms 💨</b>',Markup.inlineKeyboard([
    ...docList
  ],{wrap: () => true}))
  const url=`https://telegramformbot.herokuapp.com/${ctx.message.from.id}`
 return ctx.replyWithHTML(`
 ➜ please click title to publish the form
 
 ➜Click this link to see all your forms and answers : ${url}
 `)
})
//tüm inline actiona alınmamış bot actionları için çalışır.Dikkat edilmeli.
bot.action(/.+/, async(ctx) => {
  const data=ctx.match[0].split("=")
if(data[0]!='getQuestion') {await ctx.answerCbQuery();return ctx.reply("⚠️ this is not a get question operation")}
const peyload={
    user:{id:ctx.update.callback_query.from.id},
    title:data[1],
    request:'id'
  }
try{
  questionId=await getQuestionId(peyload)
}catch(err){
  console.log(err)
  return ctx.reply('something went wrong,please try again later')
}
if(!questionId) return ctx.reply('⚠️ no question with that inputs')
ctx.replyWithHTML(`➜ Send this link to the person you want to fill the form : t.me/xFormBot?start=${questionId}`)
return ctx.answerCbQuery()
})
const stage = new Scenes.Stage([createFormWizard,answerFormWizard]);
bot.use(session());
bot.use(stage.middleware());
bot.command("/newform", (ctx) => ctx.scene.enter("create-form-wizard"));
bot.start(async(ctx) => {
  if(!ctx.startPayload || ctx.startPayload.length!=20) return ctx.reply(`
 Hi there, I can help you create a form and send it to someone to fill out. You can see your form answers on our website.
  
  You can control me by sending these commands:
  
  /newform  -  create a new form
  /myforms  -    see your created forms
  `)
  return ctx.scene.enter('answer-form-wizard')
})
bot.help((ctx) => ctx.reply(`
I can help you create a form and send it to someone to fill out. You can see your form answers on our website.

You can control me by sending these commands:

/newform  -  create a new form
/myforms  -    see your created forms
`));
bot.on("sticker", (ctx) => ctx.reply("👍"));

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));


const app = express();
const cors=require("cors")
app.use(cors())
bot.launch();
app.use(express.static("public"))
app.use(express.static("views"))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(require("./routers/main"))
app.use(history({
  disableDotRule: true,
  verbose: true
}));
app.use(express.static("public"))
app.use(express.static("views"))
app.use(require("./middlewares/errorHandler"))
app.listen(PORT, () => {
  console.log(`app listenin on port http://localhost:${PORT}`);
}); 
