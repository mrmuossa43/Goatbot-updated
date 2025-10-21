const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "ميكو",
    version: "1.0.1",
    author: "S H A D O W",
    category: "chat",
    shortDescription: "رد تلقائي مثل ميكو القديم"
  },

  onChat: async function ({ event, message, usersData }) {
    if (!event.body) return;
    const text = event.body.toLowerCase();
    const name = await usersData.getName(event.senderID);
    const time = moment.tz("Africa/Cairo").format("HH:mm:ss L");

    const tl = ["نعم", "شن تبي", "منو ينادي 🤍", "فوتني", "عيونها💙"];
    const rand = tl[Math.floor(Math.random() * tl.length)];

    if (["زبر", "زب"].includes(text))
      return message.reply("️لا تسب يشلال");

    if (["احبك", "بحبك"].includes(text))
      return message.reply("️موسى حبيبي الوحيد يولد");

    if (["زكمك", "كسمك"].includes(text))
      return message.reply("️لا تسب");

    if (["كيوت", "كيوتت"].includes(text))
      return message.reply("️يعمريييي🤧💞");

    if (["شسمك", "ايش هو اسمك"].includes(text))
      return message.reply("️ميكو عمتك");

    if (["كيفكم", "كيفك"].includes(text))
      return message.reply("️بخير وانت👀");

    if (["السلام عليكم", "سلام عليكم"].includes(text))
      return message.reply("️وعليكم السلام ورحمه الله وبركاته");

    if (["جيت", "سلام"].includes(text))
      return message.reply("️منور");

    if (["طرد", "الطرد"].includes(text))
      return message.reply("️اطرد الزب");

    if (["كيفها حياتك", "كيف حياتك"].includes(text))
      return message.reply("️ماشيا الحمد لله وانت ❤️");

    if (["ماشيا", "بخير الحمد لله"].includes(text))
      return message.reply("️دومك بخير وصحه وسعاده");

    if (["بوت", "يا بوت"].includes(text))
      return message.reply("️اسمي ميكو معش تعاودها");

    if (["جييتت", "باااكك"].includes(text))
      return message.reply("️نورت البيت🫣❤");

    if (["المطور", "من المطور"].includes(text))
      return message.reply("https://www.facebook.com/profile.php?id=100034682431522");

    if (text.startsWith("كيوتتي") || text.startsWith("ميكو"))
      return message.reply(rand);
  }
};
