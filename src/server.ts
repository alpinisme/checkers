import app from "./app";
import config from "config";

const port = config.get("app.port");

app.listen(port, () => {
    console.log(`Checkers app listening at http://localhost:${port}`);
});
