const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "الاوامر",
    version: "1.0.1",
    author: "S H A D O W / تعديل دعم GoatBot بواسطة ChatGPT",
    category: "الــــجـــروب",
    shortDescription: "اوامر البوت",
    longDescription: "يعرض قائمة الأوامر بشكل منسق بالعربية",
    guide: "{pn}الاوامر"
  },

  // 🧩 هذه الدالة تعمل عندما يرد المستخدم على رسالة البوت
  onReply: async function ({ event, message, Reply }) {
    try {
      const num = parseInt(event.body.split(" ")[0].trim());
      const data = Reply.content;
      let msg = "";
      let check = false;

      if (isNaN(num)) return message.reply("رد على الرسالة برقم العنوان لعرض الأوامر");
      if (num > data.length || num <= 0)
        return message.reply("ياغبي الرقم الي اخترته مش في المنيو أصلاً 😂😂");

      const allCommands = global.GoatBot.commands;
      let dataAfter = data[num - 1];

      if (Reply.type == "cmd_info") {
        const commandConfig = allCommands.get(dataAfter).config;
        msg += ` 『  ${commandConfig.category?.toUpperCase() || "غير محدد"}   』\n`;
        msg += `\n⌯ اســم الــأمــر: ${dataAfter}`;
        msg += `\n⌯ الــوصــف: ${commandConfig.longDescription || commandConfig.shortDescription || "لا يوجد وصف"}`;
        msg += `\n⌯ الــاســتــخــدام: ${(commandConfig.guide) ? commandConfig.guide : ""}`;
        msg += `\n⌯ الإصدار: ${commandConfig.version || "1.0"}`;
        msg += `\n⌯ المــؤلــف: ${commandConfig.author || "مجهول"}`;
        msg += `\n✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏`;
        msg += `\n\nhttps://www.facebook.com/profile.php?id=100034682431522 ↞`;
      } else {
        check = true;
        let count = 0;
        msg += `» ${dataAfter.group.toUpperCase()} «\n`;
        dataAfter.cmds.forEach(item => {
          const cmdDesc = allCommands.get(item)?.config.shortDescription || "بدون وصف";
          msg += `\n ${++count}. ↞ ${item}: ${cmdDesc}`;
        });
      }

      const imgLinks = [
        "https://i.postimg.cc/TwR8nnqZ/1.png"
      ];
      const imgPath = path.join(__dirname, "cache", "menu.jpg");
      const rdimg = imgLinks[Math.floor(Math.random() * imgLinks.length)];
      const imgBuffer = (await axios.get(rdimg, { responseType: "arraybuffer" })).data;
      fs.ensureDirSync(path.join(__dirname, "cache"));
      fs.writeFileSync(imgPath, Buffer.from(imgBuffer, "utf-8"));

      await message.unsend(Reply.messageID);
      await message.reply({
        body: msg,
        attachment: fs.createReadStream(imgPath)
      }).then(info => {
        if (check) {
          global.GoatBot.onReply.set(info.messageID, {
            type: "cmd_info",
            name: module.exports.config.name,
            messageID: info.messageID,
            content: data[num - 1].cmds
          });
        }
      });

    } catch (err) {
      console.error(err);
      message.reply("حدث خطأ أثناء معالجة الأمر 😅");
    }
  },

  // 🧠 هذه الدالة الأساسية لتشغيل الأمر
  onStart: async function ({ message, event, args }) {
    try {
      const allCommands = global.GoatBot.commands;
      const threadID = event.threadID;
      const prefix = global.GoatBot.config.prefix;

      const imgLinks = [
        "https://i.postimg.cc/TwR8nnqZ/1.png"
      ];
      const imgPath = path.join(__dirname, "cache", "menu.jpg");
      const rdimg = imgLinks[Math.floor(Math.random() * imgLinks.length)];
      const imgBuffer = (await axios.get(rdimg, { responseType: "arraybuffer" })).data;
      fs.ensureDirSync(path.join(__dirname, "cache"));
      fs.writeFileSync(imgPath, Buffer.from(imgBuffer, "utf-8"));

      const groups = [];
      for (const [name, cmd] of allCommands) {
        const cat = (cmd.config.category || "أخرى").toLowerCase();
        if (!groups.some(item => item.group.toLowerCase() === cat))
          groups.push({ group: cat, cmds: [cmd.config.name] });
        else
          groups.find(item => item.group.toLowerCase() === cat).cmds.push(cmd.config.name);
      }

      let msg = "⌯\n 【قــائــمــة الــاوامــر】\n⌯\n";
      let index = 0;

      groups.forEach(group => {
        msg += `\n${++index}. » ${group.group.toUpperCase()}`;
      });

      msg += `\n\n⌯ الــصــفــحــة 【1/1】\n`;

      await message.reply({
        body: msg,
        attachment: fs.createReadStream(imgPath)
      }).then(info => {
        global.GoatBot.onReply.set(info.messageID, {
          name: module.exports.config.name,
          messageID: info.messageID,
          content: groups
        });
      });

    } catch (err) {
      console.error(err);
      message.reply("حدث خطأ أثناء عرض قائمة الأوامر 😅");
    }
  }
};
