# private-hello

POC (spike 3): a plain FastEdge HTTP app deployed by the org toolkit from `fastedge.jsonc`.
Returns `<GREETING> from v<version>`. Deploys: preprod on merge to `main`, prod on a release tag;
roll back by running **Deploy** from an older `v*` tag.
