module.exports=(tax_app, knex)=>{
    
    //all tax
    tax_app.get('/all_tax', (req,res)=>{
        knex.select('*').from('tax')
        .then((data)=>{
            console.log(data)
            res.send(data)
        })
        .catch((err)=>{
            console.log(err)
        })
    })

    
    //get tax by tax id
    tax_app.get('/tax/:tax_id', (req,res)=>{
        var tax_id=req.params.tax_id
        knex.select('*').from('tax').where('tax_id', tax_id)
        .then((tax_data)=>{
            console.log(tax_data)
            res.send(tax_data)
        })
        .catch((err)=>{
            console.log(err)
        })
    })
}