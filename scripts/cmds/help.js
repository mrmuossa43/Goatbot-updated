const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "الاوامر",
    version: "2.0.0",
    author: "S H A D O W / تعديل ChatGPT لدعم GoatBot",
    category: "الــــجـــروب",
    shortDescription: "اوامر البوت",
    longDescription: "يعرض قائمة الأوامر بشكل تفاعلي: فئات ← أوامر ← تفاصيل الأمر",
    guide: "{pn}الاوامر"
  },

  // 📩 المرحلة الثانية والثالثة (رد المستخدم بالأرقام)
  onReply: async function ({ message, event, Reply }) {
    try {
      const num = parseInt(event.body.trim());
      if (isNaN(num)) return message.reply("رد على الرسالة برقم صالح يا ذكي 😏");
      let msg = "";

      const allCommands = global.GoatBot.commands;
      const replyType = Reply.type;

      // ⚙️ الرد على الفئة لإظهار أوامرها
      if (replyType === "category") {
        if (num <= 0 || num > Reply.content.length)
          return message.reply("ياغبي الرقم الي اخترته مش في المنيو أصلاً 😂😂");

        const selectedCategory = Reply.content[num - 1];
        const cmds = selectedCategory.cmds;
        msg += `» ${selectedCategory.group.toUpperCase()} «\n`;
        let count = 0;
        for (const cmd of cmds) {
          const cmdDesc = allCommands.get(cmd)?.config.shortDescription || "بدون وصف";
          msg += `\n ${++count}. ↞ ${cmd}: ${cmdDesc}`;
        }

        const imgURL = "https://i.postimg.cc/TwR8nnqZ/1.png";
        const imgPath = path.join(__dirname, "cache", "menu.jpg");
        const imgBuffer = (await axios.get(imgURL, { responseType: "arraybuffer" })).data;
        fs.ensureDirSync(path.join(__dirname, "cache"));
        fs.writeFileSync(imgPath, Buffer.from(imgBuffer, "utf-8"));

        await message.unsend(Reply.messageID);
        return message.reply({
          body: msg,
          attachment: fs.createReadStream(imgPath)
        }).then(info => {
          global.GoatBot.onReply.set(info.messageID, {
            type: "cmd_info",
            name: module.exports.config.name,
            messageID: info.messageID,
            content: cmds
          });
        });
      }

      // ⚙️ الرد على أمر داخل الفئة لإظهار تفاصيله
      if (replyType === "cmd_info") {
        if (num <= 0 || num > Reply.content.length)
          return message.reply("ياغبي الرقم الي اخترته مش في المنيو أصلاً 😂😂");

        const cmdName = Reply.content[num - 1];
        const cmd = allCommands.get(cmdName);
        if (!cmd) return message.reply("ما لقيت هذا الأمر في قاعدة البيانات 🤔");

        const c = cmd.config;
        msg += `『 ${c.category?.toUpperCase() || "غير محدد"} 』\n`;
        msg += `\n⌯ اســم الــأمــر: ${cmdName}`;
        msg += `\n⌯ الــوصــف: ${c.longDescription || c.shortDescription || "لا يوجد وصف"}`;
        msg += `\n⌯ الــاســتــخــدام: ${(c.guide) ? c.guide : "غير محدد"}`;
        msg += `\n⌯ الإصدار: ${c.version || "1.0"}`;
        msg += `\n⌯ المــؤلــف: ${c.author || "مجهول"}`;
        msg += `\n✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏`;
        msg += `\n\nhttps://www.facebook.com/profile.php?id=100034682431522 ↞`;

        const imgURL = "https://i.postimg.cc/TwR8nnqZ/1.png";
        const imgPath = path.join(__dirname, "cache", "menu.jpg");
        const imgBuffer = (await axios.get(imgURL, { responseType: "arraybuffer" })).data;
        fs.ensureDirSync(path.join(__dirname, "cache"));
        fs.writeFileSync(imgPath, Buffer.from(imgBuffer, "utf-8"));

        await message.unsend(Reply.messageID);
        return message.reply({
          body: msg,
          attachment: fs.createReadStream(imgPath)
        });
      }

    } catch (err) {
      console.error(err);
      message.reply("حدث خطأ أثناء معالجة الرد 😅");
    }
  },

  // 🚀 البداية: عرض الفئات
  onStart: async function ({ message }) {
    try {
      const allCommands = global.GoatBot.commands;
      const groups = [];

      // تجميع الأوامر حسب الفئات
      for (const [name, cmd] of allCommands) {
        const cat = (cmd.config.category || "أخرى").toLowerCase();
        if (!groups.some(item => item.group === cat))
          groups.push({ group: cat, cmds: [cmd.config.name] });
        else
          groups.find(item => item.group === cat).cmds.push(cmd.config.name);
      }

      // إنشاء القائمة الأولى (الفئات)
      let msg = "⌯\n 【قــائــمــة الــاوامــر】\n⌯\n";
      let index = 0;
      for (const group of groups) msg += `\n${++index}. » ${group.group.toUpperCase()}`;
      msg += `\n\n⌯ الــصــفــحــة 【1/1】\n`;

      const imgURL = "https://i.postimg.cc/TwR8nnqZ/1.png";
      const imgPath = path.join(__dirname, "cache", "menu.jpg");
      const imgBuffer = (await axios.get(imgURL, { responseType: "arraybuffer" })).data;
      fs.ensureDirSync(path.join(__dirname, "cache"));
      fs.writeFileSync(imgPath, Buffer.from(imgBuffer, "utf-8"));

      // إرسال القائمة والانتظار للرد بالأرقام
      return message.reply({
        body: msg,
        attachment: fs.createReadStream(imgPath)
      }).then(info => {
        global.GoatBot.onReply.set(info.messageID, {
          type: "category",
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
