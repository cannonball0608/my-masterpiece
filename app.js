const express = require("express");
const bodyParser = require("body-parser");
const request= require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");
  console.log("main page accessed");
})

app.post("/",function(req,res){
    // console.log("submit detected");
    // res.send("submitted");
    const firstName=req.body.fName;
    const lastName=req.body.lName;
    const email=req.body.inputEmail;

    const data ={
      members:[
        {
          email_address:email,
          status:"subscribed",
          merge_fields:{
            FNAME:firstName,
            LNAME:lastName}
        }
      ]
    };

    const jsonData=JSON.stringify(data);
    const url="https://us18.api.mailchimp.com/3.0/lists/8d69a5f2ff";

    const options={
      method:"POST",
      auth:"ethan:0feef933e05ec69d65681eb37d660218-us18"
    }

    const request = https.request(url,options,function(response){
      if(response.statusCode==200)
      {res.send("successfully subscribed");}
      else{
        res.send("error");
      }
      response.on("data",function(data){
        console.log(JSON.parse(data));
      })
    })

    request.write(jsonData);
    request.end();

    //console.log(firstName + lastName + email);

})


app.listen(process.env.PORT || 3000,function(){
  console.log("server started at port 3000");
})


// curl --request POST \
// --url 'https://usX.api.mailchimp.com/3.0/lists' \
// --user 'anystring:apikey' \
// --header 'content-type: application/json' \
// --data '{"name":"Freddie'\''s Favorite Hats","contact":{"company":"Mailchimp","address1":"675 Ponce De Leon Ave NE","address2":"Suite 5000","city":"Atlanta","state":"GA","zip":"30308","country":"US","phone":""},"permission_reminder":"You'\''re receiving this email because you signed up for updates about Freddie'\''s newest hats.","campaign_defaults":{"from_name":"Freddie","from_email":"freddie@freddiehats.com","subject":"","language":"en"},"email_type_option":true}' \
// --include


//mailchim api key   0feef933e05ec69d65681eb37d660218-us18
// mailchim audience id 8d69a5f2ff
