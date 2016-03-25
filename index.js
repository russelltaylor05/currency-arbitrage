var Bluebird      = require('bluebird');
var request       = Bluebird.promisify(require('request'));

var API_URL = 'http://fx.priceonomics.com/v1/rates/';


/* 
 * Run 
 */ 
request({ url: API_URL, method: "GET" })
.then(function (response) {  
  
  var matrix    = createMatrix(JSON.parse(response.body));  
  var start     = kickOff(matrix);
  var results   = traverse(matrix, start);  
  var best      = results[0];

  console.log('All possibilities: \n');
  
  results.forEach(function (node, index) {    
    console.log('Path: ' +  node.path + '\t\t Arbitrage: ' + node.arbValue);
    if (node.arbValue > best.arbValue) {
      best = node;
    }    
  });
  console.log('\n\nBest Path: ' +  best.path + '->' + best.first);
  console.log('Arbitrage Value: ' +  best.arbValue);
});


/* 
 * Transform JSON data into multi-dim array notation
 * EX: matrix['USD']['JPY'] = 0.88
 */ 
var createMatrix = function (data) {
  var matrix = {}; 
  var curFrom, curTo;
  for (i in data) {
    curFrom = i.match(/^[\w]{3}/, i)[0];
    curTo = i.match(/[\w]{3}$/, i)[0];        
    if (!matrix[curFrom]) {
      matrix[curFrom] = {};
    }
    matrix[curFrom][curTo] = data[i];    
  }
  return matrix;
}

/* 
 * Take our currency matrix and calculate all arbitrage possibilities of length 1 
 * EX: (USD -> EUR -> USD)
 */
var kickOff = function (matrix) {

  var results = [];

  for (var i in matrix) {    
    for (var j in matrix[i]) {    
      if ( i != j) {
        
        var remaining = JSON.parse(JSON.stringify(matrix[i])); // Clone 
        delete remaining[i];
        delete remaining[j];
        
        results.push({
          path: i + '->' + j,       
          value: matrix[i][j],        
          arbValue: matrix[i][j] * matrix[j][i],
          remaining: remaining,
          first: i,
          last: j
        });
      }
    }
  }
  return results;
}

/* 
 * Recursivly find all arbitrage paths from remaining currencies
 */
var traverse = function (matrix, results) {

  var newResults = [];
  var remaining, tempPath;

  for (var i in results) {
    for (var j in results[i].remaining) {

      remaining = JSON.parse(JSON.stringify(results[i].remaining)); // Clone      
      delete remaining[j];

      tempPath = {
        path: results[i].path + '->' + j, 
        value: matrix[results[i].last][j] * results[i].value,
        remaining: remaining,
        first: results[i].first,
        last: j
      };
      tempPath.arbValue = tempPath.value * matrix[tempPath.last][tempPath.first];        
      newResults.push(object);
    
    }
  }
  return (newResults.length) ? results.concat(traverse(matrix, newResults)) : results;
}


/****************************
All Arbitrage possibilities starting with a single currency

               USD
            /   |   \
         /      |      \      
      /         |         \
   EUR         BTC         JPY
  /   \       /   \      /    \
BTC   JPY   EUR   JPY   BTC   EUR
 |     |     |     |     |     |
JPY   BTC   JPY   EUR   EUR   BTC
 
****************************/
