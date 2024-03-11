import mongoose from "mongoose"

const settingsSchema= new mongoose.Schema({
    SEED:{
        type:Number,
        required:true,
        default:1000.00
    },
    MIN_MINOR:{
        type:Number,
        required:true,
        default:30.00
    },
    MAX_MINOR:{
        type:Number,
        required:true,
        default:500.00
    },
    MIN_MAJOR:{
        type:Number,
        required:true,
        default:500.00
    },
    MAX_MAJOR:{
        type:Number,
        required:true,
        default:2500.00
    },
    JACKPOT_POOL_RATE_PER_SPIN:{
        type:Number,
        required:true,
        default:3
    },
    SYSTEM_BALANCE_LOG_DURATION:{
        type:Number,
        required:true,
        integer:true,
        default:1
    },
    USER_HISTORY_DURATION:{
        type:Number,
        required:true,
        integer:true,
        default:1
    },
    RTP:{
        type:Number,
        required:true,
        default:96
    }
})

export default mongoose.model("Settings",settingsSchema)