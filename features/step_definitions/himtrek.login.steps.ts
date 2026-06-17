import { Given, When, Then } from '@cucumber/cucumber';
import { HimTrekHomePage } from '../../pages/himtrek/himtrekHome';
import { HimTrekAuthPage } from '../../pages/himtrek/himtrekAuth';
import { world } from '../support/world';

Given('I open the HimTrek home page', async () => {
  const home = new HimTrekHomePage(world.page!);
  await home.himtrekURL();
});

When('I login with username {string} and password {string}', async (user, pass) => {
  const home = new HimTrekHomePage(world.page!);
  await home.openLogin();

  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;

  const auth = new HimTrekAuthPage(world.page!);
  await auth.login(username!, password!);
});

// support the non-parameterized step used in the feature files
When('I login with username and password', async () => {
  const username = process.env.USERNAME!;
  const password = process.env.PASSWORD!;

  const home = new HimTrekHomePage(world.page!);
  await home.openLogin();

  const auth = new HimTrekAuthPage(world.page!);
  await auth.login(username, password);
});

Then('I should see the home page', async () => {
  const home = new HimTrekHomePage(world.page!);
  const text = await home.nameLoggedin.innerText();
  if (!text.includes('Hi')) {
    throw new Error(`Expected greeting to include "Hi", got "${text}"`);
  }
});