var express = require('express');
var router = express.Router();
const bcrypt= require('bcryptjs')
const mysql= require('mysql')
const passport = require('passport')

const encriptar= async (password)=>{
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password,salt)
  return hash
}


const conn=mysql.createConnection({
  host:process.env.DES_HOST,
  user:process.env.DES_USER,
  password:process.env.DES_PASS,
  database:process.env.DES_DB
})
const logueado=(req,res,next)=>{
  if(req.isAuthenticated()){
      return next()
  }else{
      return res.redirect('/login')
  }
}
const noLogueado=(req,res,next)=>{
  if(!req.isAuthenticated()){
      return next()
  }else{
     return res.redirect('/listarCoche')
  }
}
/* GET home page. */
router.get('/', (req, res, next)=> {
  res.render('index');
});

//usuarios
router.get('/insertarUsuario',noLogueado, (req, res, next)=> { 
  res.render('insertarUsuario')
});
router.post('/insertarUsuario',async(req,res,next)=>{
  const user={
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  }
  user.password= await encriptar(req.body.password)
  await conn.query('insert into usuarios set? ',[user],(err,result)=>{
    res.redirect('/listarUsuario')
  })
})
router.get('/listarUsuario', async(req,res,next)=>{
  await conn.query('select * from usuarios',(err,result)=>{
    res.render('listarUsuarios',{
      data:result
    })
  })
})
router.get('/editarUsuario/:id', async (req,res,next)=>{
  await conn.query('select * from usuarios where id=?',[req.params.id],(err,result)=>{
    res.render('editarUsuario',{
      data:result[0]
    })
  })
})
router.post('/editarUsuario/:id', async (req,res,next)=>{
  await conn.query('update usuarios set? where id=?',[req.body,req.params.id],(err,result)=>{
    res.redirect('/listarUsuario')
})
})

router.get('/borrarUsuario/:id',async (req,res,next)=>{
  await conn.query('delete from usuarios where id=?', [req.params.id],(err,result)=>{
    res.redirect('/listarUsuario')
  })
})
// coches
router.get('/insertarCoche', logueado,(req, res, next)=> { 
  res.render('insertarCoche')
});
router.post('/insertarCoche',async(req,res,next)=>{
  console.log(req.body)
  const coche={
    marca:req.body.marca,
    modelo:req.body.modelo,
    url:req.body.url,
    user_id: req.user.id
  }
  await conn.query('insert into coches set? ',[coche],(err,result)=>{
    res.redirect('/listarCoche')
  })
})
router.get('/listarCoche', logueado,async(req,res,next)=>{
  await conn.query('select * from coches where user_id=?',[req.user.id],(err,result)=>{
    res.render('listarCoche',{
      data:result
    })
  })
})
router.get('/editarCoche/:id', logueado,async (req,res,next)=>{
  await conn.query('select * from coches where id=?',[req.params.id],(err,result)=>{
    res.render('editarCoche',{
      data:result[0]
    })
  })
})
router.post('/editarCoche/:id', async (req,res,next)=>{
  await conn.query('update coches set? where id=?',[req.body,req.params.id],(err,result)=>{
    res.redirect('/listarCoche')
})
})
router.get('insertarCoche',logueado,(req,res,next)=>{
  res.render('insertarCoche')
})
router.get('/borrarCoche/:id',logueado,async (req,res,next)=>{
  await conn.query('delete from coches where id=?', [req.params.id],(err,result)=>{
    res.redirect('/listarCoche')
  })
})
//login

router.get('/login',noLogueado,(req,res,next)=>{
  res.render('login')
})
router.post('/login',(req,res,next)=>{
  console.log(req.body)
  passport.authenticate('login',{
    successRedirect:'/listarCoche',
    failureRedirect:'/login'
  })(req,res,next)
})
router.get('/logout',(req,res,next)=>{
  req.logout()
  res.redirect('/login')
})
module.exports = router;







