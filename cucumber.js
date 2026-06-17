module.exports = {
  default: "--require-module ts-node/register --require features/**/*.ts --format json:reports/cucumber.json --format progress"
};