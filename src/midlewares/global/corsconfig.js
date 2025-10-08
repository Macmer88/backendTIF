import cors from 'cors';

const allowedOrigin = 'http://localhost:3000';

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || origin === allowedOrigin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
};

export default cors(corsOptions);
