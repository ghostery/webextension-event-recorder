import path from "node:path";
import url from "node:url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

export const PROJECT_ROOT_PATH = path.resolve(path.join(__dirname, '..'));
