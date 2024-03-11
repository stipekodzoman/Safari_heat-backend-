export const isTestUser=(username)=>{
    const regex = /^test\d{1,4}$/;
    return regex.test(username);
}

