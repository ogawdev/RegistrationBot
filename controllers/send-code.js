const { ADMIN_ID } = require("../config");
const postgres = require("../db/db");
const generateCode = require("../generate-code");
const sms = require("../sms");
const req_phone = require("./req_phone");

module.exports = async (bot, msg, user) => {
  try {
    let user_id = msg.from.id;
    let { users } = await postgres();

    let phone_number = msg.contact?.phone_number.replace("+", "");
    let phone = phone_number ? phone_number : msg.text.replace("+", "");

    if (phone.length > 12 || phone.length < 12) {
      await bot.sendMessage(user_id, "❌Xato");

      await req_phone(bot, msg, user);
      return;
    }

    let code = generateCode();
    await sms(phone, `Tasdiqlash kodi: ${code}`);

    await users.update(
      {
        phone,
        code,
        step: "verify",
      },
      { where: { user_id } }
    );

    await bot.sendMessage(
      user_id,
      "Telefon raqamingizga tasdiqlash kodi yuborildi, kodni kiriting",
      { reply_markup: { keyboard: [[]] } }
    );
  } catch (e) {
    console.log(e + "");
  }
};
