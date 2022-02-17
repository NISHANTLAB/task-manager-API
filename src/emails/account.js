const sgMail = require("@sendgrid/mail");

// const sendgridAPIKey ='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'
  
// sgMail.setApiKey(sendgridAPIKey);

// sgMail.send({
//   to: "nishantkumarsingh355@gmail.com",
//   from: "nishant355355@gmail.com",
//   subject: "This is my first creation",
//   text: "This is my first Nodejs Api mail",
// });



sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// const message={
//   to: ["nishantkumarsingh355@gmail.com","nishant355355@gmail.com"],
//     from: "nishant355355@gmail.com",
//     subject: "This is my first creation",
//     text: "This is my first Nodejs Api mail",
//     html:"<h1>hello from sendgrid</h1>"
// }
// sgMail.send(message).then((response)=>{
//   console.log('Email sent......');
// }).catch((error)=>{
//   console.log('Error message')
// })


const WelcomeEmail=(email,name)=>{
  sgMail.send({
    to:email,
    from:'nishant355355@gmail.com',
    subject:'Thanks for joining in!',
    text:`Welcome to the application, ${name} Let me know how you get along with the app.`
  })
  
}
const cancelEmail=(email,name)=>{
  sgMail.send({
    to:email,
    from:'nishant355355@gmail.com',
    subject:'Sorry to see to again!',
    text:`Goodbye ${name}. I hope see you back somtimes back! `
  })
}

// const message={
//     to: 'email',
//       from: "nishant355355@gmail.com",
//       subject: "This is my first creation",
//       text: "This is my first Nodejs Api mail",
//       html:"<h1>hello from sendgrid</h1>"
//   }
//   sgMail.send(message).then((response)=>{
//     console.log('Email sent......');
//   }).catch((error)=>{
//     console.log('Error message')
//   })

module.exports={
  WelcomeEmail,cancelEmail
};