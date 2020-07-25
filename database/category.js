module.exports=(categories,knex)=>{
    categories.get("/category", (req,res)=>{
        knex
        .select("*")
        .from("category")
        .then((data)=>{
            res.send(data)
        })
        .catch(()=>{
            res.send("an error object")
        })
    })
    
    categories.get("/category/:category_id", (req,res)=>{
        knex
        .select("*")
        .from("category")
        .where('category_id',category_id=req.params.category_id)
        .then((data)=>{
            res.send(data)
        })
        .catch(()=>{
            res.send(err);
        })
    })

    categories.get("/category/inProduct/:product_id", (req,res)=>{
        var product_id=req.params.product_id;
        knex
        .select("*")
        .from("category")
        .join("product_category",{"category.category_id":"product_category.category_id"})
        .where("product_id",product_id)
        .then((data)=>{
            res.send(data); 
        })
        .catch((err)=>{
            res.send(err);
        })  
    })

    categories.get("/category/inDepartment/:department_id", (req,res)=>{
        var department_id=req.params.department_id;
        knex
        .select("*")
        .from("category")
        .where("department_id",department_id)
        .then((data)=>{
            res.send(data);
        })
        .catch((err)=>{
            res.send(err)
        })
    })
}

