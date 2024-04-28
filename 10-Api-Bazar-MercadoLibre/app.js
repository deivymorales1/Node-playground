// Import dependencies
import express, {json} from "express";
import cors from 'cors';
const app = express();
const port = 3000;

// Configure cors
app.use(cors());

// Load routes



// Listen port
app.listen(port, () =>{
  console.log('Listen');
})

