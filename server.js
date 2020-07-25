var express=require('express');  
var mysql=require("mysql")                                   //module

var app=express();   
app.use(express.json())                                       //app express

app.use(express.json())                                       //use update and put 
                                                              
var connect={                                                 //connect databases
    host: process.env.Hostname,                                        //middleware with endpoint
    user: process.env.Username,
    password: process.env.Password,
    database: process.env.DBname,
}
var knex=require("knex")({client: "mysql", connection: connect });

const depart=express.Router()                                     
app.use('/', depart);   
require(__dirname +'/database/departments')(depart , knex)

const categories=express.Router()
app.use('/', categories);
require(__dirname +'/database/category')(categories , knex)

const attri=express.Router()
app.use('/', attri);
require(__dirname + '/database/attributes')(attri, knex)

const product_app=express.Router()
app.use('/', product_app);
require(__dirname + '/database/product')(product_app, knex)

const customer_app=express.Router()
app.use('/', customer_app);
require(__dirname + '/database/customer')(customer_app, knex)

const shoppingcart_app=express.Router()
app.use('/', shoppingcart_app);
require(__dirname + '/database/shoppingcart')(shoppingcart_app, knex)

const order_app=express.Router()
app.use('/', order_app);
require(__dirname + '/database/order')(order_app, knex)

const tax_app=express.Router();
app.use('/', tax_app);
require(__dirname + '/database/tax')(tax_app, knex)

const shipping_app=express.Router();
app.use('/', shipping_app);
require(__dirname + '/database/shipping')(shipping_app, knex)


var port=7500;
app.listen(port,()=>{
    console.log("Server is running", port);
})




