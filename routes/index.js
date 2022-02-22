var express = require('express');
var router = express.Router();
const bcrypt= require('bcryptjs')

const encriptar= async (password)=>{
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password,salt)
  return hash
}

const mysql= require('mysql')
const conn=mysql.createConnection({
  host:process.env.DES_HOST,
  user:process.env.DES_USER,
  password:process.env.DES_PASS,
  database:process.env.DES_DB
})
/* GET home page. */
router.get('/', (req, res, next)=> {
  res.render('index');
});

//usuarios
router.get('/insertarUsuario', (req, res, next)=> { 
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
router.get('insertarCoche',(req,res,next)=>{
  res.render('insertarCoche')
})
router.get('/borrarUsuario/:id',async (req,res,next)=>{
  await conn.query('delete from usuarios where id=?', [req.params.id],(err,result)=>{
    res.redirect('/listarUsuario')
  })
})
// coches
router.get('/insertarCoche', (req, res, next)=> { 
  res.render('insertarCoche')
});
router.post('/insertarCoche',async(req,res,next)=>{
  console.log(req.body)
  await conn.query('insert into coches set? ',[req.body],(err,result)=>{
    res.redirect('/listarCoche')
  })
})
router.get('/listarCoche', async(req,res,next)=>{
  await conn.query('select * from coches',(err,result)=>{
    res.render('listarCoche',{
      data:result
    })
  })
})
router.get('/editarCoche/:id', async (req,res,next)=>{
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
router.get('insertarCoche',(req,res,next)=>{
  res.render('insertarCoche')
})
router.get('/borrarCoche/:id',async (req,res,next)=>{
  await conn.query('delete from coches where id=?', [req.params.id],(err,result)=>{
    res.redirect('/listarCoche')
  })
})

module.exports = router;
