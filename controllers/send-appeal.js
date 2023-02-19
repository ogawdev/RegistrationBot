const postgres = require("../db/db");

module.exports = async (bot, msg, user) => {
  try {
    let user_id = msg.from.id;
    let { users } = await postgres();

    await users.update(
      {
        step: "name",
      },
      { where: { user_id } }
    );

    await bot.sendMessage(user_id, "FIShngizni kiriting");
  } catch (e) {
    console.log(e);
  }
};
