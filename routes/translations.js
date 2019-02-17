const express = require("express");
const router = express.Router();
const { data } = require("../data/flashcardData.json");
const { dictionaries } = data; //  data.cards
const request = require("request");

// http://bis.babylon.com/?rt=ol&tid=pop&mr=2&term=cat&tl=he

function getClosedDiv(markup, index) {
  const tmp = markup.slice(index, markup.length);
  offset = tmp.indexOf("</div>");
  const val = index + offset;
  return val;
}

function getTranslationDiv(markup) {
  const index = markup.indexOf("translation_he heTrans");
  const divElement = markup
    .substring(
      index - `<div class="translation translation_he heTrans`.length,
      getClosedDiv(markup, index) + "</div>".length
    )
    .trim();
  return divElement;
}

function getPromise(word, url) {
  let promise1 = new Promise(function(resolve, reject) {
    request(url, function(error, response, body) {
      // request(`http://www.morfix.co.il/${word}`, function(error, response, body) {
      const trans = getTranslationDiv(body);
      resolve(trans);
      console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
    });
  });
  return promise1;
}

router.get("/:word", parseHttpReq, function(req, res) {
  const { word } = req.params;
  console.log(`searching for: ${word}`);
  res.setHeader("Content-Type", "application/json");
  res.json({ morfix_trans: req.arr });
});

function Dictionary(req, next) {
  const arr = [];
  let len = 0;
  function checkFetchedAll() {
    return len == 2;
  }
  function addToDic(translation) {
    arr[len++] = translation;
    if (checkFetchedAll()) {
      req.arr = arr;
      next();
    }
  }
  const api = {
    addToDic
  };
  return api;
}

function parseHttpReq(req, res, next) {
  const { word } = req.params;
  const dictionary = Dictionary(req, next);
  console.log(dictionary);
  const url1 = "http://www.morfix.co.il/car";
  const url2 = "http://www.morfix.co.il/cat";
  let p1 = getPromise(word, url1, dictionary);
  let p2 = getPromise(word, url2, dictionary);
  p1.then(function(value, res) {
    dictionary.addToDic(value);
  });
  p2.then(function(value, res) {
    dictionary.addToDic(value);
  });
}

router.get("/", function(req, res) {
  const id = getRrandomId(cards.length - 1);
  res.redirect(`/cards/${id}/card-front`);
});

function getRrandomId(max) {
  return Math.round(max * Math.random());
}

module.exports = router;
