const TelegramBot = require("node-telegram-bot-api");
const { TOKEN } = require("./config");
const req_phone = require("./controllers/req_phone");
const sendAppeal = require("./controllers/send-appeal");
const sendCode = require("./controllers/send-code");
const postgres = require("./db/db");

const bot = new TelegramBot(TOKEN, {
  polling: true,
});

bot.on("message", async (msg) => {
  const user_id = msg.from.id;
  let { text } = msg;
  try {
    let { users, appeals } = await postgres();

    let user = await users.findOne({ where: { user_id } });
    if (!user) {
      user = await users.create({
        user_id,
      });

      await req_phone(bot, msg, user);
    } else if (text == "/start") {
      await bot.sendMessage(
        user_id,
        "Assalomu alaykum, ushbu bot orqali o'z murojaatlaringizni yuborishingiz mumkin"
      );

      await users.update(
        {
          step: "0",
          temp: "0",
        },
        { where: { user_id } }
      );

      if (!user.phone || user.is_verify == false) {
        await req_phone(bot, msg, user);
      } else {
        await bot.sendMessage(
          user_id,
          "Murojaat yuborish uchun quyidagi tugmani bosing",
          {
            reply_markup: {
              resize_keyboard: true,
              one_time_keyboard: true,
              keyboard: [[{ text: "✅ Murojaat yuborish" }]],
            },
          }
        );
      }
    } else if (
      user.phone &&
      user.is_verify == true &&
      text == "✅ Murojaat yuborish"
    ) {
      await sendAppeal(bot, msg, user);
    } else if (!user.phone && user.step != "phone") {
      await req_phone(bot, msg, user);
    } else if (user.step == "phone") {
      await sendCode(bot, msg, user);
    } else if (user.step == "verify") {
      if (text == user.code) {
        await users.update(
          {
            is_verify: true,
            step: "name",
          },
          { where: { user_id } }
        );

        await bot.sendMessage(user_id, "FIShngizni kiriting");
      } else if (text == "♻️Telefon raqamni o'zgartirish") {
        await req_phone(bot, msg, user);
      } else {
        await bot.sendMessage(user_id, "Kod xato, qaytadan urinib ko'ring", {
          reply_markup: {
            resize_keyboard: true,
            keyboard: [[{ text: "♻️Telefon raqamni o'zgartirish" }]],
          },
        });
      }
    } else if (user.step == "name") {
      let appeal = await appeals.create({
        user_id,
        full_name: text,
        phone: user.phone,
      });

      await users.update(
        { step: "appeals", temp: appeal.id },
        { where: { user_id } }
      );
      await bot.sendMessage(user_id, "Murojaatingizni yozing");
    } else if (user.step == "appeals") {
      let appeal = await appeals.update(
        { text },
        { where: { id: user.temp }, returning: true, raw: true }
      );

      await users.update({ step: "confirm" }, { where: { user_id } });

      let keyboard = {
        resize_keyboard: true,
        one_time_keyboard: true,
        keyboard: [[{ text: "❌" }, { text: "✅" }]],
      };

      await bot.sendMessage(
        user_id,
        `🗂 Murojaat:\n\n📌 FISH: ${appeal[1][0].full_name}\n☎️ Tel: +${appeal[1][0].phone}\n📄 Murojaat matni: ${appeal[1][0].text}`,
        { reply_markup: keyboard }
      );

      await bot.sendMessage(
        user_id,
        "Murojaatingiz quyidagicha ko'rinishda yuboriladi, Ma'lumotlar tog'ri bo'lsa yuborishni tasdiqlang"
      );
    } else if (user.step == "confirm") {
      if (text == "✅") {

        

      } else {
        await users.update({ step: "0", temp: "0" }, { where: { user_id } });
        
        await bot.sendMessage(user_id, "Murojaatingiz bekor qilindi");

        await bot.sendMessage(
          user_id,
          "Murojaat yuborish uchun quyidagi tugmani bosing",
          {
            reply_markup: {
              resize_keyboard: true,
              one_time_keyboard: true,
              keyboard: [[{ text: "✅ Murojaat yuborish" }]],
            },
          }
        );
      }
    }
  } catch (e) {
    console.log(e + "");
    await bot.sendMessage(user_id, `Error ${e}`);
  }
});
