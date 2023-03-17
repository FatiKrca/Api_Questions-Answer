const bcrypt = require("bcryptjs")
const validateUserInput=(email,password)=>{

    //eğer doluysa true boşsa false gönderir
    return email && password;
};

const comparePassword = (password,hashedPassword)=>{

    //ikisini kıyaslayıp doğruysa true döndürür
   return bcrypt.compareSync(password,hashedPassword);
}

module.exports = {
    validateUserInput,
    comparePassword
}