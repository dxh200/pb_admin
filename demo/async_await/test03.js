function sleep(second) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('request done! ' + Math.random());
        }, second);
    })
}

async function bugDemo() {
    await sleep(1000);
    await sleep(1000);
    await sleep(1000);
    console.log('clear the loading~');
}

bugDemo();