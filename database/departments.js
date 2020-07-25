module.exports=(depart,knex)=>{
    depart.get("/departments", (req, res)=>{
        knex
        .select("*")
        .from("department")
        .then((data)=>{
            res.send(data)
        })
        .catch(()=>{
            res.send("an object is empty.")
        })
    })
    
    
    depart.get("/departments/:department_id", (req,res)=>{
        var department_id=req.params.department_id;
        knex
        .select("*")
        .from("department")
        .where("department_id",department_id)
        .then((data)=>{
            res.send(data)
        })
        .catch((err)=>{
            res.send("there is no available data from this id")
        })
    })
}
