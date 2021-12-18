const express = require('express');

const Rendage = require('../distribution').default;



const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <meta name="description" content="rendage" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="rendage" />
    <meta property="og:title" content="rendage" />

    <title>rendage /</title>
    <style>
        @import url('https://fonts.googleapis.com/css?family=Ubuntu&display=swap');

        html, body {
            margin: 0;
            background: #242b33;
            color: #ddd;
            user-select: none;
            height: 100%;
        }

        /* .p {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: 'Ubuntu', -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto;
        } */
    </style>
</head>
<body>
    <div
        class="p"
    >
        hello
    </div>
</body>
</html>
    `;


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

        response.send(html);
    });


    app.listen(56444, () => {
        console.log('rendage started on localhost:56444');
    });


    process.on('exit', async () => {
        await browser.close();
    });
}


main();
