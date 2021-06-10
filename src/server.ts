import app from "./app";
import config from "config";

const port = config.get("app.port");

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
