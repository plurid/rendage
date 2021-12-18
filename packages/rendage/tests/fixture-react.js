const fs = require('fs');
const express = require('express');

const Rendage = require('../distribution').default;



const reactBuildDirectory = '../../fixtures/fixture-rendage-react/build/';
const reactAppHTML = fs.readFileSync(reactBuildDirectory + 'index.html', 'utf-8');


const main = async () => {
    const app = express();

    const rendage = new Rendage({
        serverURL: 'http://localhost:56444',
    });


    app.get('/', async (request, response) => {
        const start = Date.now();

        const handled = await rendage.handle(request, response);
        if (handled) {
            const end = Date.now();
            console.log(`Served rendage / in ${end - start}ms`);
            return;
        }

        const end = Date.now();
        console.log(`Served html / in ${end - start}ms`);

        response.send(reactAppHTML);
    });

    app.use(express.static(reactBuildDirectory));


    app.listen(56444, () => {
        console.log('rendage started on localhost:56444');
    });


    process.on('exit', async () => {
        await browser.close();
    });
}


main();
