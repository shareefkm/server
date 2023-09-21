import Restarant from "../../models/restaurant.js";


export const restaurants = {
    getRestaurants:async (req,res)=>{
        try {
            const restaurant = await Restarant.find()
            if(restaurant.length){
                    res.status(200).send({
                    success:true,
                    restaurant,
                })
            }else{
                res.status(404).send({
                    success:false,
                    message:"Restarant Not found"
                })
            }
        } catch (error) {
            console.log(error);
        res.status(500).send({
        success: false,
        message: "Server error",
        error,
      });
        }
    },
    manageRestaurantsStatus:async (req,res)=>{
        try {
            const restaurant = await Restarant.findById(req.body.id)
            if(restaurant){
                if(restaurant.Is_blocked){
                    await Restarant.updateOne({_id:restaurant},{$set:{Is_blocked:false}}).then(()=>{
                        res.status(201).send({
                            success:true,
                            message:"Restarant Unblocked"
                        })
                    })
                }else{
                    await Restarant.updateOne({_id:restaurant},{$set:{Is_blocked:true}}).then(()=>{
                        res.status(201).send({
                            success:true,
                            message:"Restarant Blocked"
                        })
                    })
                }
            }else{
                res.status(404).send({
                    success:false,
                    message:"Restarant not found"
                })
            }
        } catch (error) {
            console.log(error);
        res.status(500).send({
        success: false,
        message: "Server error",
        error,
      });
        }
    }
}