const runner = require('@plurid/runner').default;

const express = require('express');

const Rendage = require('../distribution').default;



runner(
    async (
        check,
    ) => {
        const app = express();
        const rendage = new Rendage();

        app.get('/', async (request, response) => {
            const handled = await rendage.handle(request, response);
            if (handled) {
                return;
            }

            response.send('works');
        });
    },
);
