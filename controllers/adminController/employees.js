import Employee from '../../models/employee.js'

export const employees = {
    getEmployees:async (req,res)=>{
        try {
            const employees = await Employee.find()
            if(employees.length){
                    res.status(200).send({
                    success:true,
                    employees,
                })
            }else{
                res.status(404).send({
                    success:false,
                    message:"Employees Not found"
                })
            }
        } catch (error) {
            console.log(error);
        res.status(500).send({
        success: false,
        message: "Error finding",
        error,
      });
        }
    },
    manageEmployeeStatus:async (req,res)=>{
        try {
            const employeeId = await Employee.findById(req.body.id)
            if(employeeId){
                if(employeeId.Is_blocked){
                    await Employee.updateOne({_id:employeeId},{$set:{Is_blocked:false}}).then(()=>{
                        res.status(201).send({
                            success:true,
                            message:"Employee Unblocked"
                        })
                    })
                }else{
                    await Employee.updateOne({_id:employeeId},{$set:{Is_blocked:true}}).then(()=>{
                        res.status(201).send({
                            success:true,
                            message:"Employee Blocked"
                        })
                    })
                }
            }else{
                res.status(404).send({
                    success:false,
                    message:"Employee not found"
                })
            }
        } catch (error) {
            console.log(error);
        res.status(500).send({
        success: false,
        message: "Error finding",
        error,
      });
        }
    }
}