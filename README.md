# VACCINE SLOT AVAILABILITY NOTIFIER 🇮🇳

A simple Node server running a cron job every minute to check the vaccine slot availability in your area using the public API made available by the Government. Currently the app uses calenderByPin endpoint. You can explore other endpoints as well by clicking this link.
[API Setu](https://apisetu.gov.in/public/marketplace/api/cowin/cowin-public-v2#/)




>> Features that are included 😊
    - support for multiple pincodes
    - get a notification via email
    - support to add multiple email ids
    - templating to customize the email content



>> Things required from end user ✔

 Since we don't have the hosted web app , you need to run this server locally and pls follow below steps 
 - add your gmail credentials in server.js
 - update the pincodes and mailing list in server.js
 - __need to allow no secure apps to access gmail in order to send email__ Enable the flag here [allow access](https://myaccount.google.com/lesssecureapps)
 - to start the server run `node server.js` from root




 