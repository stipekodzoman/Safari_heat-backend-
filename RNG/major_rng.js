import { MIN_MAJOR,MAX_MAJOR } from "../constants/settings.js";

const generate_major=()=>{
    const random_major = (Math.random() * (MAX_MAJOR-MIN_MAJOR) + MIN_MAJOR).toFixed(2);
    return random_major
}

export default generate_major;