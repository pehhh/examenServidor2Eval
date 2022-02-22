var express = require('express');
var router = express.Router();


const mysql= require('mysql')
const conn=mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'password',
  database:'coches'
})
/* GET home page. */
router.get('/', (req, res, next)=> {
  res.render('index');
});
router.get('/insertarUsuario', (req, res, next)=> { 
  res.render('insertarUsuario')
});
router.post('/insertarUsuario',(req,res,next)=>{
  conn.query('insert into usuarios set? ',[req.body],(err,result)=>{
    res.redirect('/listarUsuario')
  })
})
router.get('/listarUsuario',(req,res,next)=>{
  conn.query('select * from usuarios',(err,result)=>{
    res.render('listarUsuarios',{
      data:result
    })
  })
})
router.get('/editar/:id',(req,res,next)=>{
  conn.query('select * from usuarios where id=?',[req.params.id],(err,result)=>{
    
  })
})

router.get('insertarCoche',(req,res,next)=>{
  res.render('insertarCoche')
})
router.get('/listarUsuarios',(req,res,next)=>{
  
})
module.exports = router;
