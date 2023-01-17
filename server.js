const express =require("express"),
   mongoose=require("mongoose"),
   ejs =require("ejs")
   app =express()
app.set("views engine","ejs")
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.get("/",(req,res)=>{
    res.render("index.ejs")
})

mongoose.connect("mongodb://localhost:27017/centerDatabase",{useNewUrlParser:true,useUnifiedTopology:true})
const studentSchema= new mongoose.Schema({
    fn:String,
    ln:String,
    sex:String,
    phone:String,
    address:String,
    course:String,
    date_registered:{
        type:Date,
        default:Date.now
    }
})
const Student =new  mongoose.model("student",studentSchema)
app.get("/about",(req,res)=>{
    res.render("about.ejs")
})
app.get("/contact",(req,res)=>{
    res.render("contact.ejs")
})
app.get("/register",(req,res)=>{
    res.render("registration.ejs")
})
app.post("/register",(req,res)=>{
    const {fn,ln,sex,phone,address,course}=req.body
    let error=[];
    if(!fn ||!ln||!sex||!phone||!address||!course){
        error.push({msg:"please ensure that all fields have been filled"})
    }
    if(error.length >=1)
{
    res.render("registration",{error,fn,ln,sex,address,course})
}else{
    const newApplicant =new Student({
        fn,ln,sex,address,phone,course
    })
    newApplicant.save((er)=>{
        if(er){
            console.log(err)
            res.send("there was a problem saving into the databse")
        }else{
            res.send("Applicant Successful.Be on the watchout")
        }
    })
}
})
app.get('/viewsA',(req,res)=>{
    Student.find({},(err,result)=>{
        if(err){
            res.send("trhere is Aa problem .please try again")
        }else{
            res.render("view_applicant.ejs",{result})
        }
    })
})
app.get('/edit/:s_id',(req,res)=>{
    // console.log(req.params.s_id)
    // res.send("processing")\
    Student.findOne({_id:req.params.s_id},(err,result)=>{
        if(err){
            res.send("there is a problem .please try again")
            console.log(err)
        }else{
            res.render("edit.ejs",{result})
        }
        // res.send("processing")
        // console.log(result)
    })
})
app.post('/editpage/:s_id',(req,res)=>{
    console.log(req.body)
    res.send("processing")
    const{fn,ln,sex,address,phone,course} =req.body
    Student.updateOne({_id:req.params.s_id},{$set:{fn,phone,address,course}},(err)=>{
        if(err){
            res.send("update wasnt successful")
            console.log(err)
        }else{
            res.send("student record successfully updated")
        }
    })
})
app.get('/delete/:s_id',(req,res)=>{
    Student.deleteOne({_id:req.params.s_id},(err)=>{
        if(err){
            res.send("could not successfully delete")
            console.log(err)
         } else{
            res.redirect('/viewsA')
        }
    })
})
app.listen(2100,()=>{
    console.log("Server listening on port 2100")
   })