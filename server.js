const express = require("express");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const axios = require("axios");
const { format, add } = require("date-fns");
const path = require("path");

app = express();

// get tommorow's date
const selectedDate = format(add(new Date(), {days: 1}), "dd-MM-yyyy");

// add the pincodes and create urls as per the requirement
const url1 = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=######&date=${selectedDate}`;
const url2 = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=######&date=${selectedDate}`;

const urls = [url1, url2];

const useragent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0";

const EmailTemplate = require("email-templates").EmailTemplate;

// add the distribution list
const mailList = ["###########@gmail.com", "##########@gmail.com"];

async function sendMail(context) {
  const template = new EmailTemplate(
    path.join(__dirname, "template", "emailer")
  );
  const emailer = await template.render({ data: context });
  
  const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "##########", // add your gmail credentials
      pass: "##########", // add your gmail credentials
    },
  });

  let mailDetails = {
    from: '"YOUR NAME" <###########@gmail.com>',
    to: mailList,
    subject: "Vaccine Slot Notifier",
    html: emailer.html,
  };
  mailTransporter.sendMail(mailDetails, function (e, data) {
    if (e) {
      console.log("Something went wrong ...", e);
    } else {
      console.log("Email got tiggred", data);
    }
  });
}

// cron job to fetch the details every minute
cron.schedule("*/1 * * * *", async function () {
  try {
    const data = await Promise.all(
      urls.map(async (url) => {
        const response = await axios.get(url, {
          headers: { "User-Agent": useragent },
        });
        return response;
      })
    );
    console.log("cron job running ....");
  
    if (data.length) {
      data.forEach((day) => {
        if (day.status === 200 && day.data && day.data.centers.length) {
          formatData(day.data.centers);
        }
      });
    }
  } catch(e) {
    console.log('Something went wrong .....');
  }
});

async function formatData(dataSet) {
  try {
    const collection = [];
    dataSet.forEach((center) => {
      const data = center.sessions.filter((obj) => obj.available_capacity > 0);
      if (data.length) {
        const availableSlots = data.map((elem) => {
          const obj = {
            ageLimit: elem.min_age_limit,
            slots: elem.slots,
            date: elem.date,
            address: center.address,
            pincode: center.pincode,
            capacity: elem.available_capacity,
			      fees: center.fee_type,
			      vaccine: elem.vaccine
          };
          return obj;
        });
        console.log(JSON.stringify(availableSlots, null, 4));
        collection.push(availableSlots);
      }
    });
    if (collection.length) {
      sendMail(collection);
    }
  } catch (e) {
    console.log(e);
  }
}

app.listen(3000, () => {
  console.log("App listening on port 3000 ....");
});