const express = require('express');
const puppeteer = require('puppeteer');



const main = async () => {
    const browser = await puppeteer.launch();
    const app = express();

    let cache;

    app.get('/', async (request, response) => {
        if (cache) {
            const start = Date.now();

            const end = Date.now();
            console.log(`Served / in ${end - start}ms`);

            response.send(cache);

            return;
        }


        const start = Date.now();

        const page = await browser.newPage();

        await page.goto('http://localhost:56444/renderer');

        const content = await page.$('body');
        const imageBuffer = await content.screenshot({
            clip: {
                height: 821,
                width: 1440,
                x: 0,
                y: 0,
            },
            // fullPage: true,
            type: 'webp',
        });
        const imageBase64 = imageBuffer.toString('base64');

        const html = `
            <html>
                <head>
                    <title>rendage /</title>
                    <style>
                        html, body {
                            margin: 0;
                        }

                        img {
                            width: 100%;
                            height: 100%;
                            pointer-events: none;
                            user-select: none;
                        }
                    </style>
                </head>
                <body>
                    <img src="data:image/png;base64,${imageBase64}" />
                </body>
            </html>
        `;

        cache = html;

        const end = Date.now();
        console.log(`Served / in ${end - start}ms`);

        response.send(html);
    });

    app.get('/renderer', (request, response) => {
        const start = Date.now();

        const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta name="description" content="renderer" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="renderer" />
        <meta property="og:title" content="renderer" />

        <title>rendage /renderer</title>
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

        const end = Date.now();
        console.log(`Served /renderer in ${end - start}ms`);

        response.send(html);
    });


    const server = app.listen(56444, () => {
        console.log('localhost:56444');
    });


    server.on('close', async () => {
        console.log('closed se');
        await browser.close();
    });
}

main();
