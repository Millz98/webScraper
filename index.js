const PORT = 4000;
const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");

const app = express();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/api/crypto", (req, res) => {
  const url = "https://coinmarketcap.com/";
  axios(url)
    .then((response) => {
      const html_data = response.data;
      const $ = cheerio.load(html_data);

      const selectedElem = "tbody tr";
      const keys = [
        "Symbol",
        "Name",
        "MarketCap",
        "Price",
        "Volume",
        "Supply",
        "Change",
        "Change24h",
        "Chart",
        "Trade",
        "TotalSupply",
        "CirculatingSupply",
      ];

      const coinArray = [];

      $(selectedElem).each((parentIndex, parentElem) => {
        const coinDetails = {};

        $(parentElem)
          .find("td")
          .each((childId, childElem) => {
            const value = $(childElem).text().trim();
            coinDetails[keys[childId]] = value;
          });

        coinArray.push(coinDetails);
      });

      console.log(coinArray);
      res.send(coinArray);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred during scraping.");
    });
});
