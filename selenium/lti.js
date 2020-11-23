const webdriver = require('selenium-webdriver');
const { By } = require('selenium-webdriver');
const assert = require('assert');

const EMULATOR_URL = process.env.CYPRESS_LTI_TOOL_CONSUMER_EMULATOR_URL;
const LTI_LAUNCH_URL = process.env.CYPRESS_LTI_LAUNCH_URL;
const CONSUMER_KEY = process.env.CYPRESS_LTI_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.CYPRESS_LTI_CONSUMER_SECRET;

describe('LTI', () => {
  let driver;
  beforeEach(() => {
    driver = new webdriver.Builder().forBrowser('chrome').build();
  });

  after(async () => {
    await driver.quit();
  });

  it('Launching collections', async (done) => {
    await driver.get(EMULATOR_URL);

    replaceText(driver, By.name('key'), CONSUMER_KEY);
    replaceText(driver, By.name('secret'), CONSUMER_SECRET);
    replaceText(driver, By.name('endpoint'), `${LTI_LAUNCH_URL}/collections`);

    await driver.findElement(By.id('save_top')).click();
    await driver.findElement(By.id('launch_top')).click();
    await driver.switchTo().frame(0);

    const collectionTileVisible = await driver
      .findElement(By.css('.collectionTile'))
      .isDisplayed();
    assert.isTrue(collectionTileVisible);

    await driver
      .findElement(By.css('.collectionTile'))
      .click()
      .then(async () => {
        await driver.sleep(2000);
        const videoTileVisible = await driver
          .findElement(By.css('.videoTile'))
          .isDisplayed();
        assert.isTrue(videoTileVisible);
      })
      .catch((e) => {
        console.error(e.message);
        assert.fail();
      });
  });

  const replaceText = (driver, selector, text) => {
    driver.findElement(selector).clear();
    driver.findElement(selector).sendKeys(text);
  };
});
