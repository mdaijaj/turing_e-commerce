module.exports=(order_app, knex)=>{
    
    //order any product not signing an login
    order_app.post('/orders/:product_id', (req,res)=>{
        // var cart_id= req.body.cart_id
        var product_id=req.params.product_id

        //issue of req.body
        const tax_id= "1000"
        const shipping_id= "2000"
        const status="1"  //binary answer
        const quantity="2"
        var review= "hello e-commerce"
        
        knex.select('product.product_id', 'product.name', 'product.price', 'shopping_cart.item_id', 'shopping_cart.cart_id', 'shopping_cart.quantity').from('product')
        .leftJoin('shopping_cart', 'product.product_id', 'shopping_cart.product_id')
        .where('product.product_id', product_id)
        .then((data)=>{
            console.log(data)
            knex.select('customer_id').from('customer').then((cus_id)=>{
                // console.log(cus_id)
                
                //insert into orders table
                knex('orders').insert({
                    "total_amount": data[0].price * quantity,
                    "created_on": new Date(),
                    "shipped_on": new Date(),
                    "status": status,
                    "customer_id": cus_id[0].customer_id,
                    "shipping_id": shipping_id,
                    "tax_id": tax_id,
                }).then((datas)=>{
                    // console.log(datas)
                    console.log("insert successfully order table")

                    //insert into review table
                    knex('review').insert({
                        "customer_id": cus_id[0].customer_id,
                        "product_id": product_id,
                        "review": review,
                        "rating":5,
                        "created_on": new Date()
                    })
                    .then((all_data)=>{
                        console.log("inserted successfully review table!", all_data)

                        //insert into ordered_datail table
                        knex("order_detail").insert({
                            "order_id":datas[0],
                            "attributes":"hello guys nice product",
                            "product_id":product_id,
                            "product_name":data[0].name,
                            "quantity": quantity,
                            "unit_cost":data[0].price
                        })
                        .then((order_detail)=>{
                            console.log("inserted successfully into order detail table", order_detail)
                            res.send("inserted successfully into order detail table")
                        })
                        .catch((err)=>{
                            console.log("error while insert order_details table")
                        })
                    })
                    .catch((err)=>{
                        console.log("error while insert review table....")
                    })
                }).catch((err)=>{
                    console.log("error while insert ordered.....", err)
                })
            })
        })
        .catch((err)=>{
            console.log("err", err)
        })
    })


    //track orders by order id
    order_app.get('/orders/:order_id', (req,res)=>{
        var order_id=req.params.order_id
        knex.select(
            'orders.order_id',
            'product.product_id',
            'order_detail.attributes',
            'product.name',
            'order_detail.quantity',
            'product.price',
            'order_detail.unit_cost'
        ).from('orders')
        .leftJoin('order_detail', 'orders.order_id','order_detail.order_id')
        .leftJoin('product', 'order_detail.product_id','product.product_id')
        .where('orders.order_id', order_id)
        .then((data)=>{
            console.log(data)
            res.send(data)
        })
        .catch((err)=>{
            console.log("error while get data", err)
        })
    })


    // all detail orders by customer_id
    order_app.get('/inCustomer',  (req,res)=>{
        knex.select('*').from('orders').where('customer_id', 1)
        .then((customer_orders)=>{
            console.log(customer_orders)
            res.send(customer_orders)
        })
        .catch((err)=>{
            console.log(err)
        })
    })


    //order details by order id
    order_app.get('/short_details/:order_id', (req,res)=>{
        var order_id=req.params.order_id
        knex.select(
            'orders.order_id',
            'orders.total_amount',
            'orders.created_on',
            'orders.shipped_on',
            'orders.status',
            'order_detail.product_name'
            ).from('order_detail')
            .leftJoin('orders', 'orders.order_id','order_detail.order_id')
            .where('orders.order_id', order_id)
            .then((order_data)=>{
            if(order_data.length>0){
                console.log(order_data)
                res.send(order_data)
            }else{
                console.log("please enter correct order id")
            }
        })
        .catch((err)=>{
            console.log(err)
        })
    })
}