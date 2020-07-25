module.exports=(product_app,knex)=>{
    product_app.get('/products', (req,res)=>{
        var num=req.body;
        knex
        .select("*")
        .from("product")
        // .limit("num")
        .then((data)=>{
            res.send(data)
        })
        .catch((err)=>{
            res.send((err))
        })
    })

    product_app.get('/products/search', (req,res)=>{
        var find=req.query.find;
        var page_limit=req.query.page_limit;
        // find postman?find=anythingwhich product you find
        knex
        .select("*")
        .from("product")
        // .limit("page_limit")
        .where("name","like","%"+find+"%")
        .then((data)=>{
            var len=data.length
            console.log(len)
            res.send(data)
        })
        .catch((err)=>{
            res.send(err)
        })
    })

    product_app.get('/products/:product_id',(req,res)=>{
        var product_id=req.params.product_id;
        knex
        .select("*")
        .from("product")
        .where("product_id",product_id)    
        .then((data)=>{
            res.send(data)
        })
        .catch((err)=>{
            res.send(err)
        })
    })

    product_app.get('/products/category/:category_id', (req,res)=>{
        var category_id=req.params.category_id
        knex
        .select("*")
        .from("product_category")
        .join("product", {"product.product_id" : "product_category.product_id"})
        .where("category_id", category_id)
        .then((data)=>{
            console.log(data)
            res.send(data)
        })
        .catch((err)=>{
            res.send(err)
        })
    })

    product_app.get('/products/inDepartments/:department_id', (req,res)=>{
        var department_id=req.params.department_id;
        knex
        .select("*")
        .from("product")
        .join("product_category", {"product_category.product_id" : "product.product_id"})
        .join("category", {"category.category_id" : "product_category.category_id"})
        .where("department_id",department_id)
        .then((data)=>{
            console.log(data)
            res.send(data)
        })
        .catch((err)=>{
            res.send(err)
        })
    })

    product_app.get('/products/:product_id/details', (req,res)=>{
        var product_id=req.params.product_id;
        knex
        .select("*")
        .from("product")
        .where("product_id",product_id)
        .then((data)=>{
            console.log(data)
            res.send(data)
        })
        .catch((err)=>{
            res.send(err)
        })
    })  

    //doubt here
    product_app.get('/products/:product_id/locations', (req,res)=>{
        var product_id=req.params.product_id;
        knex
        .select("department.department_id", "department.name as  department_name", "category.category_id", "category.name as  category_name")
        .from("category")
        .join("department", {"department.department_id": "category.department_id"})
        .join("product_category", {"product_category.category_id" : "category.category_id"})
        .where("product_id", product_id)
        .then((data)=>{
            console.log(data)
            res.send(data)
        })
        .catch((err)=>{
            console.log(err)
            res.send(err)
        })
    })

    // product_app.post('/products/:product_id/reviews', (req,res)=>{
    //     var product_id=req.params.product_id;
    //     var review=req.body.review;
    //     var rating=req.body.rating;
    //     knex
    // })
    
}

