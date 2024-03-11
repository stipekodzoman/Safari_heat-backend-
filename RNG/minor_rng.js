import { MIN_MINOR,MAX_MINOR } from "../constants/settings.js";

const generate_minor=()=>{
    const random_minor = (Math.random() * (MAX_MINOR-MIN_MINOR) + MIN_MINOR).toFixed(2);
    return random_minor
}

export default generate_minor