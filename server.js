// console.log("Image uploaded successfully")

import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import path from 'path'
import { config } from 'dotenv'


const app = express()

config({ path: '.env'})

import { v2 as cloudinary } from 'cloudinary';

    // Configuration
    cloudinary.config({ 
        cloud_name: 'drjcckdue', 
        api_key: '283519114564559', 
        api_secret: 'sUU4mGMODKw3uKXMKq0MKsJ6NGw' // Click 'View API Keys' above to copy your API secret
    });
    
    

mongoose.connect( process.env.MONGO_URI , {dbName:"Nodejs_Mastery_Course"})
.then(()=>console.log("MongoDB COnnected Successfully"))
.catch((err)=>console.log(err))

// Rendering the ejs file.
app.get('/',(req,res)=>{
    res.render("index.ejs",{url:null})
})

const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + path.extname(file.originalname)
      cb(null, file.fieldname + "-" + uniqueSuffix)
    }
  })
  
  const upload = multer({ storage: storage })

  // Schema of mongodb.
  const imageSchema = new mongoose.Schema({
    filename:String,
    public_id:String,
    imageUrl:String
  })
   const File = mongoose.model("cloudinary", imageSchema )

  

app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file.path

  const cloudinaryRes = await cloudinary.uploader.upload(file,{
    folder:"Nodejs_Mastery_Course"
  })

  // Save to Database.
  const db = await File.create({
    filename:file.originalname,
    public_id: cloudinaryRes.public_id,
    imageUrl: cloudinaryRes.secure_url
  })

  res.render("index.ejs",{ url:cloudinaryRes.secure_url })

  // Any One res you want to show res.json or res.render.
  // res.json({ message: "file Uploaded Successfully", cloudinaryRes })
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
  })

const port = process.env.PORT

app.listen(port,()=>console.log(`server started in port ${port}`))