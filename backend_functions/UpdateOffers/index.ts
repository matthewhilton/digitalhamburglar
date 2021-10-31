import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CosmosClient } from "@azure/cosmos";
import { login } from "../src/McdApi";
import { Profile } from "../src/interfaces";

const client = new CosmosClient(process.env['CosmosDbConnectionString']);

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

  const accountId = req.query.accountId;

  if (!accountId) {
    context.res = {
      status: 400,
      body: "No account ID given"
    }
    return;
  };

  const { database } = await client.databases.createIfNotExists({ id: "Accounts" });
  const { container } = await database.containers.createIfNotExists({ id: "Accounts" });

  // Lookup account by ID
  const querySpec = {
    query: "SELECT * FROM Accounts a WHERE a.id = @accountid",
    parameters: [
      {
        name: "@accountid",
        value: accountId
      }
    ]
  };
  const { resources: results } = await container.items.query(querySpec).fetchAll();

  if (results.length === 0) {
    context.res = {
      status: 400,
      body: "No account found for the given ID"
    }
    return;
  }

  const profile = results[0] as Profile;

  // Login to account
  const accessToken = await login(profile);

  // TODO login, etc...

  // DEBUG  - return account info
  context.res = {
    body: accessToken
  }
};

export default httpTrigger;