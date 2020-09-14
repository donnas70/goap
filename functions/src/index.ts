const functions = require('firebase-functions');
const cors = require('cors')({origin: true});

const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
admin.initializeApp();

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'goap576@gmail.com',
        pass: 'mooper8197'
    }
});

exports.sendEmail = functions.https.onRequest((req:any, res:any) => {
    cors(req, res, () => {
   let body = req.body;

const mailOptions = {
    from: 'GOAP <goap576@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
    to: 'GOAP <goap576@gmail.com>',
    bcc: body.to,
    subject: body.subject, // email subject
    html: body.msg
  // email content in HTML
};
    
            let inf = {msg: 'sent', now: Date.now().toString() }
            let error = {msg: 'error', now: Date.now().toString() }
            return transporter.sendMail(mailOptions, (err: any, info: any) => { 
               // console.log(Object.keys(err));
                if (err)
                {
                    console.log("code: " + err.code + " response: " + err.response  + " command:" + err.command);
                    res.send(error)
                }
                else
                {
                    res.send(inf); 
                }
            });

        })

});

// const sendgrid = require('@sendgrid/mail')
// const client = sendgrid("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")


/* function parseBody(body: any) {
    var helper = sendgrid.mail;
    var fromEmail = new helper.Email('GOAP <dsteinman70@gmail.com>');
    var toEmail = new helper.Email(body.to);
    var subject = body.subject;
    var content = new helper.Content('text/html', body.msg);
    var mail = new helper.Mail(fromEmail, subject, toEmail, content);
    return  mail.toJSON();
  }

  exports.sendMail = functions.https.onRequest((req:any, res:any) => {
    cors(req, res, () => {
        return Promise.resolve()
        .then(() => {
          if (req.method !== 'POST') {
            const error = new Error('Only POST requests are accepted');
            //error.code = 405;
            throw error;
          }
    
    
          const request = client.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: parseBody(req.body)
          });
    
          return client.API(request)
    
    
        })
        .then((response) => {
          if (response.body) {
            res.send(response.body);
          } else {
            res.end();
          }
        })
    
        .catch((err) => {
          console.error(err);
          return Promise.reject(err);
        });
    })
  }) */

