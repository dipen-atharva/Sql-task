(async () => {
    for(let i = 0; i < 3 ; i++){
        await run(i);
    }
})()

function run(i){
    return new Promise((res,rej) =>{
        setTimeout(()=>{
            console.log('i = ',i)
            res();
        }, 2000);
    })
}