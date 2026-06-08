import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import path from 'path'

const app = express();
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
    cloud_name: 'da2ywxond', 
    api_key: '914648313471613', 
    api_secret: 'ziCiFf1Rq6tALXqtwhP7HQuwon4' 
});


app.use(express.urlencoded({extended:true}));

mongoose.connect("mongodb+srv://kamandomutum2615_db_user:N80k902lzmbxxPzn@cluster0.rqmefon.mongodb.net/",{
    dbName: "NodeJs_image_uploader"
}).then(()=>console.log('MongoDb is connected...!')).catch((err)=>console.log(err))

app.get('/', (req,res) => {
    res.render('index.ejs',{url:null});
})

const storage = multer.diskStorage({
//   destination: './public/uploads',
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

const  imageSchema = new mongoose.Schema({
    filename: String,
    public_id: String,
    imageUrl: String
});

const File = mongoose.model("cloudinary", imageSchema)

app.post('/upload', upload.single('file'), async (req, res, next) => {
    const file = req.file.path;

    const cloudinaryRes = await cloudinary.uploader.upload(file,{
        folder:"NodeJs_image_uploader"
    })


    const db = await File.create({
        filename:file.originalname,
        public_id: cloudinaryRes.public_id,
        imageUrl: cloudinaryRes.secure_url,
    })

    res.render("index.ejs",{url:cloudinaryRes.secure_url });
    // res.json({
    //     message:"file uploaded successfully",cloudinaryRes
    // })
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
})

const port = 3000;
app.listen(port, ()=>console.log(`server is running on port ${port}`))