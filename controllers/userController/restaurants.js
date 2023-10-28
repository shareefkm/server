import Restarant from "../../models/restaurant.js"

export const restaurants = {
    getRestaurants: async(req,res)=>{
        try {
            const restaurants = await Restarant.find({Is_blocked:false,Is_verify:true}).populate('product')
        if(restaurants){
            res.status(200).send({
                success:true,
                restaurants
            })
        }else{
            res.status(404).send({
                success:false,
                message:"Restaurants Not Available"
            })
        }
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success:false,
                message:"Server Error"
            })
        }
    }
}