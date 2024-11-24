import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler(req, res) {
      const { title, description } = req.body;

      database.insert("tasks", {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      res.writeHead(201).end();
    },
  },
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler(req, res) {
      const { search } = req.query;

      const data = database.select(
        "tasks",
        search
          ? {
              title: search,
              description: search,
            }
          : null
      );

      res.end(JSON.stringify(data));
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler(req, res) {
      const { id } = req.params;
      try {
        database.update("tasks", id, {
          updated_at: new Date().toISOString(),
          ...req.body,
        });

        res.end();
      } catch (e) {
        res.writeHead(400).end(
          JSON.stringify({
            error: "DatabaseError",
            message: e.message,
          })
        );
      }
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler(req, res) {
      const { id } = req.params;
      try {
        database.delete("tasks", id);

        res.writeHead(204).end();
      } catch (e) {
        res.writeHead(400).end(
          JSON.stringify({
            error: "DatabaseError",
            message: e.message,
          })
        );
      }
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler(req, res) {
      const { id } = req.params;
      try {
        database.update("tasks", id, {
          updated_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        });

        res.end();
      } catch (e) {
        res.writeHead(400).end(
          JSON.stringify({
            error: "DatabaseError",
            message: e.message,
          })
        );
      }
    },
  },
];
