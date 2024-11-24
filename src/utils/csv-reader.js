import fs from "node:fs";
import { parse } from "csv-parse";

const filePath = new URL("../../tasks.csv", import.meta.url);

const readableStream = fs.createReadStream(filePath);

(async () => {
  const parser = readableStream.pipe(parse());

  let count = 0;

  for await (const chunk of parser) {
    if (count === 0) {
      count++;
      continue;
    }

    const [title, description] = chunk.toString().split(",");

    const body = {
      title,
      description,
    };

    await fetch("http://localhost:3333/tasks", {
      method: "POST",
      body: JSON.stringify(body),
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    count++;
  }
})();
