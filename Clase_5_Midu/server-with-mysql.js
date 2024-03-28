import { createApp } from "./app";

import { MovieModel } from "./models/mysql/movie";

createApp({ movieModel: MovieModel })