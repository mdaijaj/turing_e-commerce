module.exports=(shoppingcart_app, knex)=>{
   
    // //generate id_cart
    shoppingcart_app.get('/shoppingcart/generate_unique_id', (req,res)=>{
        var random_id=Math.floor(Math.random()*9999999999999999)             //generate cart id like form "1234 5678 9123 4567"
        var data=random_id.toString()
        var cart_id="";
        for (var i=0; i<data.length; i++){
            if((i+1)%4==0){
                var b=data[i] + " ";
                cart_id+=b;
            }else{
                cart_id+=data[i]
            }
        }
        console.log("generate cart_id")
        res.send({"cart_id": cart_id}) 
    }) 				


    //add product in shopping cart  
    shoppingcart_app.post('/shoppingcart/add', (req, res)=>{
        var cart_id=req.body.cart_id
        var product_id=req.body.product_id
        var attributes=req.body.attributes

        knex
        .select("*") .from("shopping_cart") .where("product_id", product_id)        // select data from shopping cart
        .then((data)=>{
            if(data.length<1){
                var body=req.body;
                // console.log(body)
                body["added_on"]= new Date()
                body["quantity"]= 1

                knex("shopping_cart") .insert(body)                                 //add a product in shopping cart 
                .then((result)=>{       
                    console.log("data inserted successfully!")
                    
                    knex
                    .select("*") .from("shopping_cart") .join("product", {"shopping_cart.product_id": "product.product_id"}) 
                    .where("cart_id", cart_id)                                      
                    .then((data)=>{                                                //join table shopping cart and product 
                        // console.log(data)
                        var subtotal=data[0].quantity * data[0].price              //total price
                        data["subtotal"]=subtotal; 
                        res.send([{                                                //show details which you want to show
                            "item_id":data[0].item_id,
                            "name": data[0].name,   
                            "attributes": data[0].attributes,
                            "cart_id": data[0].cart_id,
                            "product_id": data[0].product_id,
                            "price": data[0].price,
                            "quantity": data[0].quantity,
                            "image": data[0].image,
                            "subtotal": subtotal
                        }])
                    })
                    .catch((err)=>{
                        res.send({"eror": "error while get data with join"})
                    })
                })
                .catch((err)=>{
                    console.log(err)
                    res.send(err)
                })

            }else{                                                               // if product same than quentity increment
                var body=req.body
                body["added_on"]= new Date()                                     // update date

                knex.select("*") .from("shopping_cart") .where("cart_id", req.body.cart_id)
                .then((data)=>{                                                  //select data from shopping cart
                // console.log(data)
                    data[0].quantity=data[0].quantity+1                      //
                    // res.send(data[0])

                    knex("shopping_cart"). update({quantity:data[0].quantity, added_on: data[0].added_on }). where("cart_id",req.body.cart_id)
                    .then((data)=>{                                          //update quatity and date

                        knex.select("*") .from("shopping_cart")
                        .join("product", {"shopping_cart.product_id": "product.product_id"}).where("cart_id", req.body.cart_id)
                        .then((detail)=>{                                    // join shopping cart and product table
                            console.log(detail)
                            // res.send(detail[0])
                            var subtotal=detail[0].quantity * detail[0].price;  // net price with quantity and price
                            detail["subtotal"]=subtotal;                       //add key and value of subtotal
                            res.send([{
                                "item_id":detail[0].item_id,                   // details show which you want to show
                                "name": detail[0].name,   
                                "attributes": detail[0].attributes,
                                "cart_id": detail[0].cart_id,
                                "product_id": detail[0].product_id,
                                "price": detail[0].price,
                                "quantity": detail[0].quantity,
                                "image": detail[0].image,
                                "subtotal": subtotal
                            }])
                        })
                        .catch((err)=>{
                            console.log(err)
                        })
                    })
                    .catch((err)=>{
                        res.send({"err": "error while update data"})
                    })              
                })
                .catch((err)=>{
                    res.send(err)
                })
            }
        })
        .catch((err)=>{
            res.send({"err": "error detail while select from shopping cart"})
        })
    })

    
    //get all product list when you insert shopping cart
    shoppingcart_app.get('/shoppingcart/:cart_id', (req,res)=>{
        var cart_id=req.params.cart_id
        knex .select("*") .from("shopping_cart") .join("product", {"shopping_cart.product_id": "product.product_id"}) .where("cart_id", cart_id)
        .then((data)=>{
            var total=data[0].price * data[0].quantity;
            data[0]["subtotal"]=total
            console.log(data)
            res.send(data)
        })
        .catch((err)=>{
            console.log(err)
        })
    })

    
    // update quantity and total price by item id
    shoppingcart_app.put('/shoppingcart/update/:item_id', (req,res)=>{
        var item_id=req.params.item_id;
        var quantity=req.body.quantity;

        knex.select("*").from("shopping_cart") .join("product", {"shopping_cart.product_id": "product.product_id"}) .where("item_id",item_id)
        .then((data)=>{
            data[0].quantity=quantity
            var total=data[0].price * data[0].quantity;
            data[0]["subtotal"]=total;
            console.log(data)
            res.send(data)  
        })
        .catch((err)=>{
            res.send(err)
        })
    })


    //remove all product from shopping cart
    shoppingcart_app.delete('/shoppingcart/empty/:cart_id', (req,res)=>{
        var cart_id=req.params.cart_id

        knex("shopping_cart") .where("cart_id", cart_id).del()
        .then((data)=>{
            res.send([])
            console.log("Deleted successfully!")
        })
        .catch((err)=>{
            console.log(err)
            res.send(err)
        })
    })  


    //total amount of each product
    shoppingcart_app.get('/shoppingcart/totalAmount/:cart_id', (req,res)=>{
        var cart_id=req.params.cart_id
        knex .select("*") .from("shopping_cart") .join("product", {"shopping_cart.product_id": "product.product_id"}) .where("cart_id", cart_id)
        .then((data)=>{
            // console.log(data)
            for (var i of data){
                var total=i.price * i.quantity
                var a={"Total_amount": total}
                console.log(a)
            } 
            res.send(a)
        })
        .catch((err)=>{
            res.send(err)
        })
    })
}
