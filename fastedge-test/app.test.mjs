import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import {
  defineTestSuite, runAndExit, runHttpRequest, assertHttpStatus, assertHttpBodyContains,
} from '@gcoredev/fastedge-test/test';

const here = dirname(fileURLToPath(import.meta.url));
const version = readFileSync(resolve(here, '../Cargo.toml'), 'utf8').match(/^version = "([^"]+)"/m)[1];

await runAndExit(defineTestSuite({
  wasmPath: resolve(here, '../target/wasm32-wasip1/release/hello.wasm'),
  // Env loaded once at start from env/default/.env. Two fastedge-test 0.2.6
  // gaps (FUTURE F-10): the README's `dotenvEnabled` key is ignored — the code
  // reads `dotenv: { enabled, path }`; and applyDotenv() on the HTTP runner
  // restarts fastedge-run, so the next request fails with "fetch failed".
  runnerConfig: { dotenv: { enabled: true, path: resolve(here, 'env/default') } },
  tests: [
    {
      name: 'GET / greets via gdr-lib with GREETING and reports the crate version',
      async run(runner) {
        const res = await runHttpRequest(runner, { path: '/', method: 'GET' });
        assertHttpStatus(res, 200);
        assertHttpBodyContains(res, `hi from gdr-lib (hello v${version})`);
      },
    },
  ],
}));
