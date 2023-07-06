const tags=[]
const mixers=`property="og:type",content="website"?property="og:url",content="https://xformbot-b0b06e555ec7.herokuapp.com/""?property="og:title",content="xFormBot | Create and reply forms on telegram"?property="og:description",content="xFormBot is  a telegram bot to create and answer forms.You can see your forms  on our site.Create form easily on telegram and send it someone to fill it."?property="og:image",content=""?property="twitter:card",content="summary_large_image"?property="twitter:url",content="https://xformbot-b0b06e555ec7.herokuapp.com/""?property="twitter:title",content="xFormBot | Create and reply forms on telegram"?property="twitter:description",content="xFormBot is  a telegram bot to create and answer forms.You can see your forms  on our site.Create form easily on telegram and send it someone to fill it."?property="twitter:image",content=""`
const allArr=mixers.split("?")

for(const prop of allArr){
    const attributes=prop.split(",")
    for(const attribute of attributes){
        const tag = document.createElement('meta');
    }
}