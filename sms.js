const fetch = require("node-fetch").default;
const FormData = require("form-data");

async function login() {
  try {
    const formdata = new FormData();

    let email = "test@eskiz.uz";
    let password = "j6DWtQjjpLDNjWEk74Sx";

    formdata.append("email", email);
    formdata.append("password", password);

    const response = await fetch(`https://notify.eskiz.uz/api/auth/login`, {
      method: "POST",
      body: formdata,
    });

    let data = await response.json();

    if (response.status >= 200 && response.status < 300) {
      return data.data.token;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function sms(phone_number, message) {
  try {
    let token = await login();

    const formdata = new FormData();

    formdata.append("mobile_phone", phone_number);
    formdata.append("message", message);
    formdata.append("from", 4546);

    const response = await fetch(
      `https://notify.eskiz.uz/api/message/sms/send`,
      {
        method: "POST",
        body: formdata,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    let data = await response.json();
    console.log(data);
    if (response.status >= 200 && response.status < 300) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
}

module.exports = sms;
