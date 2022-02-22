const passport=require('passport')
const Strategy=require('passport-local').Strategy
const mysql= require('mysql')
const bcrypt=require('bcryptjs')
const {promisify}= require('util')

const conn=mysql.createConnection({
    host:process.env.DES_HOST,
    user:process.env.DES_USER,
    password:process.env.DES_PASS,
    database:process.env.DES_DB
})

conn.query=promisify(conn.query)
const comparar= async (password,savedPassword)=>{
    const result= await bcrypt.compare(password,savedPassword)
    return result
}
passport.use('login',new Strategy({
    usernameField:'username',
    passwordField:'password',
    passReqToCallback:true
},async(req,username,password,done)=>{
    const result= await conn.query('select * from usuarios where username=?',[username])
    console.log(result[0])
    if(result.length>0){
        
        const user= result[0]
        const resultComp= await comparar(password,user.password)
        console.log(resultComp)
        if(resultComp){
            done(null,user)
        }else{
            done(null,false)
        }
    }else{
        return done(null,false)
    }
}))

passport.serializeUser((user,done)=>{
    done(null,user.id)
})
passport.deserializeUser(async (id,done)=>{
    const result2= await conn.query('select * from usuarios where id=?',[id])
    done(null,result2[0])
})
