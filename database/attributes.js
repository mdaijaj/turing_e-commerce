module.exports=(attri, knex)=>{
    attri.get("/attributes", (req,res)=>{
        knex
        .select("*")
        .from("attribute")
        .then((data)=>{
            res.send(data);
        })
        .catch((err)=>{
            res.send(err)
        })
    })

    attri.get("/attributes/:attribute_id", (req,res)=>{
        var attribute_id=req.params.attribute_id
        knex    
        .select("*")
        .from("attribute")
        .where("attribute_id",attribute_id)
        .then((data)=>{
            res.send(data)
        })
        .catch((err)=>{
            res.send(err.message)
        })
    })

    attri.get("/attributes/values/:attribute_id", (req,res)=>{
        var attribute_id=req.params.attribute_id;
        knex
        .select("*")
        .from("attribute_value")
        .where("attribute_id", attribute_id)
        .then((data)=>{
            res.send(data);
        })
        .catch((err)=>{
            res.send(err);
        })
    })

    attri.get("/attributes/inProduct/:product_id", (req,res)=>{
        var product_id=req.params.product_id;
        knex
        .select("name as attribute_name", "value as attribute_value", "attribute_value.attribute_value_id")
        .from("product_attribute")
        .join("attribute_value",{"product_attribute.attribute_value_id":"attribute_value.attribute_value_id"})
        .join("attribute", {"attribute_value.attribute_id":"attribute.attribute_id"})
        .where("product_id",product_id)
        .then((data)=>{
            res.send(data)
        })
        .catch((err)=>{
            res.send(data)
        })
    })

}   
