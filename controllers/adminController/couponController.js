import Coupon from "../../models/Coupon.js";

export const coupons = {
    createCoupon: async(req,res)=>{
        try {
            const {couponCode,discountPercentage,expirationDate,usageLimit} = req.body;
            const exisitCoupon = await Coupon.findOne({couponCode})
            if(!exisitCoupon){
                const coupon = await Coupon.create({couponCode,discountPercentage,expirationDate,usageLimit: usageLimit || null})
                res.status(200).send({
                    success:true,
                    coupon,
                    message:"Coupon Created success"
                })
            }else{
                res.status(400).send({
                    success:false,
                    message:"Coupon Code allready exists"
                })
            }

        } catch (error) {
            console.log(error);
            res.status(500).send({
                success:false,
                message:"Server error"
            })
        }
    },
    getCoupons: async(req,res)=>{
        try {
            const coupons = await Coupon.find()
            if(coupons){
                res.status(200).send({
                    success:true,
                    coupons,
                })
            }else{
                res.status(400).send({
                    success:false,
                    message:"Coupon Not Found"
                })
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success:false,
                message:"Server Error"
            })
        }
    },
    deleteCoupon: async(req,res)=>{
        try {
            const { id } = req.query
            await Coupon.deleteOne({_id:id})
            res.status(200).send({
                success:true,
                message:"Coupon Deleted Success",
            })
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success:false,
                message:"Server Error"
            })
        }
    }
}