module.exports=(shipping_app, knex)=>{
    
    //all tax
    shipping_app.get('/shipping/region', (req,res)=>{
        knex.select('*').from('shipping_region')
        .then((data)=>{
            console.log(data)
            res.send(data)
        })
        .catch((err)=>{
            console.log(err)
        })
    })

    
    //get tax by tax id
    shipping_app.get('/shipping/region/:shipping_region_id', (req,res)=>{
        var shipping_region_id=req.params.shipping_region_id
        knex.select('*').from('shipping_region').where('shipping_region_id', shipping_region_id)
        .then((shipping_data)=>{
            console.log(shipping_data)
            res.send(shipping_data)
        })
        .catch((err)=>{
            console.log(err)
        })
    })
}