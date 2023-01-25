import { createRemultServer } from "remult/server";
import { Task } from "../shared/Task";
import { createPostgresConnection } from "remult/postgres";

export const api = createRemultServer({
  dataProvider: createPostgresConnection({
    connectionString: "postgres://postgres:MASTERKEY@localhost/postgres"
  }),
  entities: [Task]
});
