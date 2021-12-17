// #region imports
    // #region libraries
    import {
        Request,
        Response,
    } from 'express';

    import puppeteer, {
        Browser,
    } from 'puppeteer';

    import {
        strings,
    } from '@plurid/plurid-functions';
    // #endregion libraries
// #endregion imports



// #region module
class Rendage {
    private browser: Browser | null = null;


    constructor() {
        this.load();
    }


    private async load() {
        this.browser = await puppeteer.launch();
    }


    public async handle(
        request: Request,
        response: Response,
    ) {
        if (!this.browser) {
            return false;
        }

        if (request.query.rendage) {
            return false;
        }


        const page = await this.browser.newPage();
        await page.goto(request.originalUrl + '?rendage');

        const head = await page.$('head');
        const content = await page.$('body');
        if (!content) {
            return false;
        }

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

        const html = strings.removeWhitespace(`
            <html>
                <head>
                    ${head || ''}

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
        `);

        response.send(html);

        return true;
    }

    public async close() {
        if (!this.browser) {
            return;
        }

        await this.browser.close();

        return true;
    }
}
// #endregion module



// #region exports
export default Rendage;
// #endregion exports
