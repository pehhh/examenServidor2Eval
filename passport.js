const passport=require('passport')
const Strategy=require('passport-local').Strategy
const mysql= require('mysql')

const {promisify}= require('util')

const conn=mysql.createConnection({
    host:process.env.DES_HOST,
    user:process.env.DES_USER,
    password:process.env.DES_PASS,
    database:process.env.DES_DB
  })

conn.query=promisify(conn.query)
const comparar=(password,savedPassword)=>{
    
}
passport.use('login',new Strategy({
    usernameField:'username',
    passwordField:'password',
    passReqToCallback:true
}),async(req,username,password,done)=>{
    const result= await conn.query('select * from usuarios where username=?',[username])
    if(result.length>0){
        const user= result[0]
        if()
    }else{

    }
})
