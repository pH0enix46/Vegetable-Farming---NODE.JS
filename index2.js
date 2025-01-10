// // //

// ⏺ run `node index2.js` `nodemon index2.js` `npm run start` `npm start`

// NODE MODULE ----------✅✅✅
// ⏺ core module --1st
const fs = require("fs");
const http = require("http");
const url = require("url");

// ⏺ 3rd part module --2nd
const slugify = require("slugify"); // ⏺ Slugify converts text into a URL-friendly format by making it lowercase, removing special characters and replacing spaces with hyphens

// ⏺ our own module --3rd
const replaceTemplate = require("./modules/replaceTemplate"); // ⏺ In Nodejs actually every single file is treated as a module
// ----------⛔️⛔️⛔️

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8");
const dataObj = JSON.parse(data);
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
// console.log(slugify("Fresh Avocados", { lower: true }));
// console.log(slugs);

const server = http.createServer((request, response) => {
  // console.log(request.url);
  // console.log(url.parse(request.url, true)); // ⏺ parse() method/function takes a URL string and converts it into an object if true, if false then string remains a string

  const { query, pathname: pathName } = url.parse(request.url, true);

  // ⏺ Overview page for routing
  if (pathName === "/" || pathName === "/overview") {
    response.writeHead(200, { "content-type": "text/html" });

    const cardsHtml = dataObj
      .map((element) => replaceTemplate(tempCard, element))
      .join(""); // ⏺ join korlam jate array theke string akare ase
    // console.log(cardsHtml);
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    response.end(output);
  }
  // ⏺ Product page for routing
  else if (pathName === "/product") {
    response.writeHead(200, { "content-type": "text/html" });

    // console.log(query);
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    response.end(output);
  }
  // ⏺ API for routing
  else if (pathName === "/api") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(data);
  }
  // ⏺ Not Found
  else {
    response.writeHead(404, {
      "Content-Type": "text/html",
      "my-own-anyName-header": "Wrong! Wrong! hehe__",
    });
    response.end("<h1>Page not found!</h1>");
  }
});
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to request on port -8000");
});
