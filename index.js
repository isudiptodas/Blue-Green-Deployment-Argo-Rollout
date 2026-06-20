import express from 'express'

const PORT = 5000;

const app = express();
let currentLoad = 0;
let loadRunning = false;
let interval = null;

function consumeCpu() {

    function cycle() {

        if (!loadRunning) return;

        const workTime = currentLoad;
        const idleTime = 100 - currentLoad;

        const start = Date.now();

        while (Date.now() - start < workTime) {
            Math.sqrt(Math.random());
        }

        setTimeout(cycle, idleTime);
    }

    cycle();
}

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: `Backend running on port ${PORT}`,
        version: `blue`
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: `Backend is healthy & running`,
        version: `blue`
    });
});

app.get('/error', (req, res) => {

    if (!loadRunning) {
        loadRunning = true;
        let increasing = true;

        consumeCpu();

        interval = setInterval(() => {

            if (increasing) {
                currentLoad += 10;

                if (currentLoad >= 80) {
                    currentLoad = 80;

                    if (currentLoad >= 80) {
                        currentLoad = 80;

                        setTimeout(() => {
                            increasing = false;
                        }, 60000); // stay at 80% for 1 minute
                    }
                }
            } else {
                currentLoad -= 10;

                if (currentLoad <= 0) {
                    currentLoad = 0;
                    loadRunning = false;
                    clearInterval(interval);
                    interval = null;
                }
            }
            console.log(`Current Load: ${currentLoad}%`);
        }, 5000);
    }

    res.status(200).json({
        success: true,
        message: 'CPU load cycle started',
        currentLoad: `${currentLoad}%`
    });
});