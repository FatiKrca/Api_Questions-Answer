
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Question =require("./Question")

const UserSchema = new Schema({

    name:{
        type: String,
        required :[true,"Lütfen İsim Alnını boş bırakmayınız"]
    },
    email :{
        type : String,
        required : [true,"Lütfen E-mail alanını boş bırakmayınız"],
        unique : true,
        match :[
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Lütfen Email formatında yazın"
        ]
    },
    role:{
        type: String,
        default: "user",
        enum :["user","admin"]
    },
    password:{
        type : String,
        minlength : [6,"Şifre 6 karakterden uzun olmalı"],
        required :[true,"Lütfen şifre alanını boş bırakmayınız"],
        select : false
    },
    resetPasswordToken:{
        type: String
    },
    resetPasswordExpire:{
        type: Date
    },
    createdAt : {
        type: Date,
        default : Date.now
    },
    title :{
        type : String
    },
    about : {
        type : String
    },
    place : {
        type : String
    },
    website : {
        type : String
    },
    profile_image : {
        type : String,
        default : "default.jpg"
    },
    blocked : {
        type : Boolean,
        default: false
    }

})
UserSchema.methods.getResetPasswordTokenFromUser = function(){

    const randomHexString = crypto.randomBytes(15).toString("hex");

    const {RESET_PASSWORD_EXPIRE} = process.env


    const resetPasswordToken = crypto
    .createHash("SHA256")
    .update(randomHexString)
    .digest("hex");
   
    this.resetPasswordToken = resetPasswordToken;
    this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE);
    
}

//UserSchema Methods
UserSchema.methods.generateJwtFromUser = function(){

    const{JWT_SECRET_KEY,JWT_EXPIRE} = process.env;

    const payload ={
        id : this._id,
        name: this.name
    };  

    const token =jwt.sign(payload,JWT_SECRET_KEY,{
        expiresIn: JWT_EXPIRE
    })
    return token
};




//kaydedilmeden hemen önce çalışır
//.pre nin ilk paremetresi save pre ise önce demek
UserSchema.pre("save",function(next){
    //parla değişmemiş diğer bilgiler güncellenirse
    if(!this.isModified("password")){

        next() ;
    }

    //bu bcryptjs (npm ile indirdik) bir paket şifreyi hashlememize yarar
    //hata kontrollerini yapıcaz eğer hata yoksa şifre fonksiyona giricek
    // fonksiyondan şifrelenmiş olarak çıkıcak bu çıktı'hash' e atanıcak eğer sorun çıkmazsa
    //şifrenin içine hashlenmiş şifreyi atıcak
    //bu işlemler save olmadan hemen önce yapılıyor.
    bcrypt.genSalt(10, (err, salt)=> {
        if(err) next(err);
        
        bcrypt.hash(this.password, salt, (err, hash) =>{
            // Store hash in your password DB.
            if(err) next(err);
            this.password = hash;
            next();

        });
    });

    // buradaki this kayıt edilmeye hazır kullanıcının bilgilerini verir
    //this.password ise kullanıcının şifresini verir
    // console.log(this.password);
});

// kullanıcı kaldırıldıktan sonra bu işlemleri yap diyoruz
UserSchema.post("remove", async function(){

    await Question.deleteMany({
        user: this._id
    });

});

module.exports = mongoose.model("User",UserSchema); 
