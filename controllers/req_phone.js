const postgres = require("../db/db");

module.exports = async (bot, msg, user) => {
  try {
    const user_id = msg.from.id;
    let { users } = await postgres();
    
    await users.update(
      {
        step: "phone",
      },
      { where: { user_id } }
    );

    let keyboard = {
      resize_keyboard: true,
      one_time_keyboard: true,
      keyboard: [[{ text: "☎️Telefon raqam yuborish", request_contact: true }]],
    }; 

    await bot.sendMessage(
      user_id,
      "Telefon raqamingizni '☎️Telefon raqam yuborish' tugmasi orqali yoki quyidagicha ko'rinishda yuboring\n\n+998915865494",
      {
        reply_markup: keyboard,
      }
    );
  } catch (e) {
    console.log(e + "");
  }
};
