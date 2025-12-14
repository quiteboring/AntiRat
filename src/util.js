import forgeflower from "forgeflower";
import fetch from "node-fetch";
import { mkdirSync, rmdirSync, rmSync, writeFileSync } from "fs";
import { readdir, readFile } from 'fs/promises';
import { dirname, extname, join, relative } from "path";
import { fileURLToPath } from "url";

const findWebhooks = async (dir, options = {}) => {
  const { exclude = ['node_modules', '.git'], extensions = null } = options;
  const results = [];
  
  const scan = async (currentPath) => {
    const entries = await readdir(currentPath, { withFileTypes: true });
    for (const entry of entries) {
      if (exclude.includes(entry.name)) continue;
      
      const fullPath = join(currentPath, entry.name);
      if (entry.isDirectory()) {
        await scan(fullPath);
      } else if (shouldCheckFile(entry.name)) {
        await checkFile(fullPath);
      }
    }
  };
  
  function shouldCheckFile(filename) {
    return !extensions || extensions.includes(extname(filename));
  }
  
  const checkFile = async (filePath) => {
    try {
      const content = await readFile(filePath, 'utf8');
      const matches = content.match(/https:\/\/discord(?:app)?\.com\/api\/webhooks\/\d+\/[\w-]+/g);
      
      if (matches) {
        [...new Set(matches)].forEach(webhook => {
          results.push({
            webhook,
            file: relative(dir, filePath)
          });
        });
      }
    } catch (err) {}
  };
  
  await scan(dir);
  return results;
};

const deleteWebhook = async (webhookUrl) => {
  try {
    const response = await fetch(webhookUrl, {
      method: "DELETE",
    });

    if (response.status === 204 || response.status === 200) {
      console.log("Webhook deleted successfully!");
      return true;
    }
  } catch (error) {
    console.error(`Failed to delete webhook :(`);
    return false;
  }

  console.error(`Failed to delete webhook :(`);
  return false;
};

export const decompileJarAndDeleteWebhooks = async (inputJar) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const outputDir = join(__dirname, "../output");

  mkdirSync(outputDir, {
    recursive: true,
  });

  await forgeflower(inputJar, outputDir);

  rmSync(inputJar, {
    recursive: true, 
    force: true
  });
  
  await findWebhooks(join(__dirname, "../output/decompiled"), { 
    extensions: ['.java']
  }).then((webhooks) => {
    webhooks.forEach(async (webhook) => {
      console.log(`Deleting webhook found in ${webhook.file}: ${webhook.webhook}`);
      await deleteWebhook(webhook.webhook);
    });
  });

  rmSync(outputDir, {
    recursive: true,
    force: true,
  });
};


export const isJar = (attachment) => {
  return attachment?.name?.toLowerCase().endsWith(".jar") ?? false;
};

export const downloadJar = async (url, fileName) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const outputDir = join(__dirname, "../jars");

  mkdirSync(outputDir, {
    recursive: true,
  });

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download: ${response.statusText}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const filePath = join(outputDir, fileName);
  writeFileSync(filePath, buffer);

  return filePath;
};