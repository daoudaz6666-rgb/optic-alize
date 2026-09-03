/* Lance une tâche Gradle du projet android/ en réglant le SDK Android. */
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const ANDROID = join(ROOT, "android");

const sdk =
  process.env.ANDROID_HOME ||
  process.env.ANDROID_SDK_ROOT ||
  join(process.env.LOCALAPPDATA || join(homedir(), "AppData", "Local"), "Android", "Sdk");

if (!existsSync(ANDROID)) {
  console.error("Le dossier android/ n'existe pas. Lance d'abord : npx cap add android");
  process.exit(1);
}

const lp = join(ANDROID, "local.properties");
if (!existsSync(lp)) {
  writeFileSync(lp, "sdk.dir=" + sdk.replace(/\\/g, "\\\\") + "\n");
  console.log("local.properties créé -> " + sdk);
}

const task = process.argv[2] || "assembleDebug";
const isWin = process.platform === "win32";
const env = { ...process.env, ANDROID_HOME: sdk, ANDROID_SDK_ROOT: sdk };

// Node >= 20 refuse d'exécuter un .bat sans passer par cmd.exe.
const res = isWin
  ? spawnSync("cmd.exe", ["/c", join(ANDROID, "gradlew.bat"), task, "--no-daemon"], {
      cwd: ANDROID,
      stdio: "inherit",
      env,
    })
  : spawnSync(join(ANDROID, "gradlew"), [task, "--no-daemon"], {
      cwd: ANDROID,
      stdio: "inherit",
      env,
    });

if (res.error) {
  console.error(res.error.message);
  process.exit(1);
}
process.exit(res.status ?? 1);
