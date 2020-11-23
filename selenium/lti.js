const webdriver = require('selenium-webdriver'),
  By = webdriver.By;

const driver = new webdriver.Builder().forBrowser('chrome').build();

try {
  driver.get(process.env.CYPRESS_LTI_TOOL_CONSUMER_EMULATOR_URL);

  driver.findElement(By.name('key')).clear();
  driver
    .findElement(By.name('key'))
    .sendKeys(process.env.CYPRESS_LTI_CONSUMER_KEY);

  driver.findElement(By.name('secret')).clear();
  driver
    .findElement(By.name('secret'))
    .sendKeys(process.env.CYPRESS_LTI_CONSUMER_SECRET);

  driver.findElement(By.name('endpoint')).clear();

  const checkCollections = async () => {
    driver
      .findElement(By.name('endpoint'))
      .sendKeys(`${process.env.CYPRESS_LTI_LAUNCH_URL}/collections`);

    await driver.findElement(By.id('save_top')).click();
    await driver.findElement(By.id('launch_top')).click();
    await driver.switchTo().frame(0);
    const collectionTileVisible = await driver
      .findElement(By.css('.collectionTile'))
      .isDisplayed();
    if (collectionTileVisible) {
      await driver
        .findElement(By.css('.collectionTile'))
        .click()
        .then(async () => {
          await driver.sleep(2000);
          driver
            .findElement(By.css('.videoTile'))
            .isDisplayed()
            .then((visible) => {
              visible ? console.log('Test passed') : console.log('Test failed');
              driver.quit();
            });
        });
    } else {
      console.log('Test failed');
      driver.quit();
    }
  };

  checkCollections();
} catch (e) {
  console.error(e);
  driver.quit();
}
