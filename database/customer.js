var jwt=require("jsonwebtoken")                             //modules
var jwt_decode=require("jwt-decode")
module.exports=(customer_app, knex)=>{                      //export data in main server


    //customer register yourself                            
    customer_app.post('/customers', (req,res)=>{
        var name=req.body.name;                             
        var email=req.body.email;
        var password=req.body.password;
                                                        
        var token=jwt.sign({email:req.body.email},"shhhh", {expiresIn:"24hr"})          //token generate
        // console.log(token)

        knex("customer")
        .insert({"name":name, "email":email, "password":password })
        .then((data)=>{
            knex
            .select("*")
            .from("customer")
            .where("email",email)
            .then((data)=>{
                // console.log(data)
                res.cookie(token)
                console.log(token)
                res.send(data)
            })
            .catch((err)=>{
                res.send(err)
            })
        })
        .catch((err)=>{
            res.send(err)
    })
    })


    //customer login username and password
    customer_app.post('/customers/login', (req,res)=>{
        var email=req.body.email;
        var password=req.body.password;
        knex
        .select("*")
        .from("customer")
        .where("email",email).andWhere("password", password)
        .then((data)=>{
            var customer_id=data[0].customer_id
            var token=jwt.sign({customer_id: customer_id}, "shhhh", {expiresIn: "24hr"})    //token generate by customer id secure
            res.cookie(token)                                                               //get cookie 
            console.log("login is successfully!") 
            res.send(data)          
        })
        .catch((err)=>{
            res.send(err)
        })
    })


    //get customer id by using token
    customer_app.get('/customers', (req,res)=>{
        var cook=req.headers.cookie;                                    //get cookie from headers
        if(cook!==undefined){                   
            var bearer=cook.split(" ");                                 //get cookies how many times you sent request
            var get_cookie=bearer[bearer.length-1].slice(0,-10)
            var verified=jwt.verify(get_cookie, "shhhh")                //verify secure key or confirmation
            console.log(verified)
            var customer_id=verified.customer_id;

            knex("customer")
            .where("customer_id", customer_id)
            .then((data)=>{
                console.log(data)
                res.send(data)
            })
            .catch((err)=>{
                res.send(data)
            })
        }else{
            res.send(err.message)
        } 
    })

        //get customer id by using token
        customer_app.get('/customers', (req,res)=>{
            var cook=req.headers.cookie;                                    //get cookie from headers
            if(cook!==undefined){                   
                var bearer=cook.split(" ");                                 //get cookies how many times you sent request
                var get_cookie=bearer[bearer.length-1].slice(0,-10)
                var verified=jwt.verify(get_cookie, "shhhh")                //verify secure key or confirmation
                console.log(verified)
                var customer_id=verified.customer_id;
    
                knex("customer")
                .where("customer_id", customer_id)
                .then((data)=>{
                    console.log(data)
                    res.send(data)
                })
                .catch((err)=>{
                    res.send(data)
                })
            }else{
                res.send(err.message)
            } 
        })


    //update data of customer by customer_id
    customer_app.put('/customers', (req,res)=>{
        var cook=req.headers.cookie;                                    //get cookie from hearders
        if(cook!==undefined){      
            var bearer=cook.split(" ");                                 //get cookies how many times you sent request
            get_cookie=bearer[bearer.length-1].slice(0,-10)
            var verified=jwt.verify(get_cookie, "shhhh")                //verify secure key or confirmation
            var customer_id=verified.customer_id

            knex("customer")                                            //firsty get data and find customer_id
            .where("customer_id",customer_id)
            .then((result)=>{
                // console.log(result)
                knex("customer")                                
                .where("customer_id", customer_id)                      //update data using get-id
                .update(req.body)
                .then((data)=>{
                    console.log("updated is successfully!")
                    knex
                    .select("*")
                    .from("customer")                                   //show all data
                    .where("email", req.body.email)
                    .then((user_data)=>{
                        console.log(user_data)
                        res.send(user_data)
                    })
                    .catch((err)=>{
                        res.send(err.message)
                    })
                })
                .catch((err)=>{
                    res.send(err.message)
                })
            })
            .catch((err)=>{
                res.send(err.message)
            })
        }else{
            res.send("please first you have to login");
        }
    })


    //update customer details using token by customer id
    customer_app.put('/customers/address' , (req, res)=>{
        var cook=req.headers.cookie;                             //get cookie from hearders
        // console.log(cook)  
        if(cook!==undefined){
            var bearer=cook.split(" ")                           //get cookies how many times you sent request
            var get_cookie=bearer[bearer.length-1].slice(0,-10)
            var token_verify=jwt.verify(get_cookie, "shhhh")     //verify secure key or confirmation
            var customer_id=token_verify.customer_id;

            knex("customer")                                        //firsty get data and find customer_id
            .where("customer_id", customer_id)
            .then((data)=>{
                console.log(data)
                
                knex("customer")
                .where("customer_id", data[0].customer_id)           //update data using get-id
                .update(req.body)
                .then((result)=>{
                    console.log("data update successfully!")
                    
                    knex("customer")
                    .where("customer_id", customer_id)              //show all data
                    .then((data)=>{
                        res.send(data)
                    })
                    .catch((err)=>{
                        res.send(err)
                    })
                })
                .catch((err)=>{
                    res.send(err)
                })
            })
            .catch((err)=>{
                res.send(err)
            })
        }else{
            console.log("please first you have to login")
        }
    })


    // update credit card using token by customer id
    customer_app.put('/customer/credit_card', (req,res)=>{
        var cook=req.headers.cookie                                                  //get cookie from hearders
        if(cook!==undefined){
            var bearer=cook.split(" ")                                               //get cookies how many times you sent request
            var get_cookie=bearer[bearer.length-1].slice(0,-10)
            var token_verify=jwt.verify(get_cookie, "shhhh")                         //verify secure key or confirmation
            var customer_id=token_verify.customer_id;

            knex("customer")                                                         //firsty get data and find customer_id
            .where("customer_id", customer_id)  
            .then((data)=>{
                // console.log(data)
                knex("customer")    
                .where("customer_id", customer_id)                                  //update data using get-id
                .update(req.body)
                .then((data)=>{
                    console.log("credit_card details updated successfully.")
                    
                    knex("customer")
                    .where("customer_id", customer_id)                               //show all data
                    .then((data)=>{
                        console.log(data)
                        res.send(data)
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
                })
                .catch((err)=>{
                    console.log(data)
                })
            })
            .catch((err)=>{
                console.log(err)
            })
        }else{
            res.send("Please first you have to login")
        }
    })    

}

