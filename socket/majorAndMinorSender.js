
import generate_major from "../RNG/major_rng.js"
import generate_minor from "../RNG/minor_rng.js"
export default async function majorAndMinorSenderRun(socket) {
    try{
        const major=await generate_major()
        const minor=await generate_minor()
        socket.emit("major_minor",JSON.stringify({major:major,minor:minor}))
        setInterval(async ()=>{
            const major=await generate_major()
            const minor=await generate_minor()
            socket.emit("major_minor",JSON.stringify({major:major,minor:minor}))
        },1000)
        
    }catch(error){
        console.log(first)
    }
    
}