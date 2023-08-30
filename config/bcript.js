import bcrypt from "bcryptjs"

export const genPass = {
    password:async function (pass){
        const salt = await bcrypt.genSalt(10)
        const newPass = await bcrypt.hash(pass,salt)
        return newPass
    },
    compairePass:async function(bodyPass,pass){
        const isMatch = await bcrypt.compare(bodyPass,pass)
        return isMatch
    }
}
