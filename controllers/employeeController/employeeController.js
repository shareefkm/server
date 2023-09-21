//imports files
import Employee from "../../models/employee.js";

export const employee = {
  //Employee Registration
  employeeRegister: async (req, res) => {
    try {
      const { Name, Email, Mobile, Password, address, id_Proof } = req.body;
      const existEmployee = await Employee.findOne({ Email });
      if (existEmployee) {
        return res.status(200).send({
          success: false,
          message: "Email Already Exist Please Login",
        });
      }else{
        const employee = await Employee.create({Name, Email, Mobile, Password, address, id_Proof})
        const token = await employee.creatJwt();
        res.status(201).send({
            success: true,
            message: "Registration Success",
            employee: {
              Name: employee.Name,
              Email: employee.Email,
            },
            token
          });
      }
    } catch (error) {
        console.log(error);
        res.status(500).send({
        success: false,
        message: "Error Registration",
        error,
      });
    }
  },

  employeeLogin: async (req,res)=>{
    try {
        const {Email,Password} = req.body
        const employee = await Employee.findOne({Email})
        if(employee){
            const isMatch = await employee.comparePassword(Password)
            if (isMatch) {
                if(!employee.Is_verify){
                  console.log("not vrifyed");
                  res.status(401).send({
                    success: false,
                    message: "Youre account is not verifyed",
                  });
                }else if(employee.Is_blocked){
                    console.log("blocked");
                    res.status(401).send({
                      success: false,
                      message: "Youre account is blocked",
                    });
                }
                else{
                  employee.Password = undefined
                  const token = await employee.creatJwt();
                  res.status(200).send({
                    success: true,
                    message: "Login Success",
                    employee,
                    token,
                  });
                }
              } else {
                res.status(403).send({
                  success: false,
                  message: "Invalid Password",
                });
              }
        }else {
            res.status(403).send({
              success: false,
              message: "Invalid Email",
            });
          }
    } catch (error) {
        console.log(error);
        res.status(500).send({
        success: false,
        message: "Error Login",
        error,
      });
    }
  }
};
