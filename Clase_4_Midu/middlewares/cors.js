import cors from 'cors'

const ACCEPTED_ORIGINS = [
    'http://localhost:8080',
    'http://localhost:1234',
    'https://movies.com',
    'https://midu.dev'
];

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
    origin: (origin, callback ) => {

        
        if(!origin || ACCEPTED_ORIGINS.includes(origin)){
            return callback(null, origin)
        }
    
        return callback(new Error('Not allowed by CORS'));
    }
})