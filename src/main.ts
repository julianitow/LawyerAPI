import { Lawyer } from "./app";
import { MongoDB } from "./modules/MongoDB";
import { KoaModule } from "./modules/MyKoa";
import { Logger } from "./modules/logger";
import { MyDotEnv } from "./modules/my_dotenv";

const app = new Lawyer();
app.use(MyDotEnv);
app.use(Logger);
app.use(MongoDB);
app.use(KoaModule, app.routers());
app.run();