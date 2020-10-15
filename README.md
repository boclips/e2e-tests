# E2E tests

[![concourse](https://concourse.devboclips.net/api/v1/pipelines/boclips/jobs/end-to-end-tests/badge)]()

One day we will [do without them](https://medium.com/@bengro/end-to-end-test-are-dead-long-lives-testing-in-production-fdff46f6eefe), because we test in production and we have the most amazing canary releasing.

Until them, this is where the action is happening. They are never flaky, as fast as light.

# Debugging runs

## How to debug red tests

Video recordings of failed E2E test runs on CI are saved to Google Cloud storage.

To watch the videos:

1. Find the archive URL from the `test-results` step of the E2E CI job
   - The URL will look like
     `gs://boclips-test-results/hq/results.tar#xyz`
1. Use `bo show test-results <% archive URL %>` to fetch the archive
   - On provisioned machines [`bo`] should be on the PATH
1. Locate the MP4 for the failed test

[`bo show test-results`]: https://github.com/boclips/infrastructure/blob/master/bin/bo-commands/show/test-results

# Tips & Tricks running e2e locally

```
./run
```

Cypress can crash if running a long journey, for now the number of tests kept in memory is set to 0
so cypress doesn't crash chrome. However this can be annoying when you want to see test state for small
tests.

If you want to have this functionality in `cypress.json` remove `numTestsKeptInMemory` field.

Also you can use `specify.only` to only run one test, that can be super useful so you don't have to
run the whole journey each time.
