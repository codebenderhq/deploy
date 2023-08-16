//https://deno.land/x/compress@v0.4.5
import { tgz } from "https://deno.land/x/compress@v0.4.4/mod.ts";
import { readableStreamFromReader } from "https://deno.land/std@0.193.0/streams/mod.ts";

const compress = async (path, name, deployPath) => {
  const filePath = `./${name}.tar.gz`;
  await tgz.compress(`${path}`, filePath);
  const src = await Deno.open(filePath);
  const size = (await Deno.stat(filePath)).size;
  const f = readableStreamFromReader(src);

  fetch(deployPath, {
    method: "POST",
    headers: {
      "content-length": `${size}`,
      "content-type": "application/tar",
    },
    body: f,
  });
};

/**
 * Deploy, to VM
 * deplpoy [name of app] [build directory] [vm host url] [version]
 */
if (import.meta.main) {
  const [name, path, deploy, version] = Deno.args;
  console.log("begin deployment");
  const versionQuery = version ? `&version=${version}` : '';
  const deployTo = `${Deno.env.get("deploy") ? Deno.env.get("deploy") : deploy}?name=${name}${versionQuery}`;
  await compress(path, name, deployTo);
  console.log("deployment done");
}
