import { createServer } from "node:http";
import { routes } from "./routes.js";
import { json } from "./middlewares/json.js";
import { extractQueryParams } from "./utils/extract-query-params.js";

const server = createServer(async (req, res) => {
  const { method, url: path } = req;

  await json(req, res);

  const route = routes.find(
    (route) => route.method === method && route.path.test(path)
  );

  if (route) {
    const routeParams = path.match(route.path);

    const { query, ...params } = routeParams.groups;

    req.params = { ...params };
    req.query = query ? extractQueryParams(query) : {};

    return route.handler(req, res);
  }

  return res.writeHead(404).end();
});

server.listen(3333, () => console.log("Server listening on port 3333"));
