const express = require("express");
const app = express();
const path = require('path');
const sendMail = require("./email")
const Application = require('./models/applications');
app.set("view engine","ejs");
app.set("views",path.join(__dirname,'views'));
const mongoose = require("mongoose");
app.use(express.urlencoded({extended : true}));
const catchAsync = require("./utilities/catchAsync");
const ExpressError = require("./utilities/expressError");
const {applicationSchema} = require('./utilities/schemas.js');
const isEmailValid = require("./utilities/emailValidation.js");
//connecting the database
mongoose.connect('mongodb+srv://JobApp:nuketown@cluster0.9umi5.mongodb.net/job-application?retryWrites=true&w=majority',{
    useNewUrlParser : true,
    useCreateIndex : true,
    useUnifiedTopology : true
});

//checking for database connectivity
const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error"));
db.once("open", () => { 
    console.log("Database Connected!");

});

//validate database
const validateApplication = (req,res,next)=>{
    console.log(req.body);
    const {error} = applicationSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg,400);  
    }else{
        next();
    }
}

// application form
app.get('/' , async(req,res)=>{
    res.render("applicationForm");
});

//application post route
app.post('/applications',validateApplication,catchAsync(async(req,res,next)=>{
    const {email} = req.body.application ;
    const {valid} = await isEmailValid(email);
    if(valid){
        const application = new Application(req.body.application);
        await application.save();
        sendMail(email, (err, data) => {
            if (err) {
                res.status(500).json({ message: 'Internal Error' });
            }
            else {
                res.json({ message: 'Email sent successfully!' });
            }
        })
    }
    else {
        const msg = "Enter Valid Email Address!"
        throw new ExpressError(msg,400);  
    }


    res.redirect("/");  
})
);

//express error handler
app.use((err,req,res,next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Something Went Wrong!!";
    res.status(statusCode).render("error",{err});
    // next();
});

app.all("*",(req,res,next)=>{ 
    res.send("404 PAGE NOT FOUND!!");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server started successfully!!");
});