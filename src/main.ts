import { Lawyer } from "./app";
import { GoogleAPI, KoaModule, Logger, MongoDB, MyDotEnv } from "./modules";

const app = new Lawyer();
app.set(MyDotEnv);
app.continue();
app.use(Logger);
app.use(MongoDB);
app.use(KoaModule, app.routers(), app.unsecuredRoutes);
app.use(GoogleAPI);
app.run();
