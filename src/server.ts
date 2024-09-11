import app from "./app.js";
import { serverVars } from "./config/env.js";
import appDataSource from "./config/dataSource.js";

appDataSource
  .initialize()
  .then((dataSource) => {
    console.log("[Database] Successful database connection");
    app.listen(serverVars.PORT, () => {
      console.log(`[Server] Server running at localhost:${serverVars.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
