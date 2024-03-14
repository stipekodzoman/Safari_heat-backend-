
export default async function updateSenderRun(socket, balance) {
    try{
        await socket.emit("update", JSON.stringify({balance:balance}))
    }catch(e){
        console.log(e)
    }
    
}
