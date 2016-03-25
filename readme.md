# Currency Arbitrage

### Example Exchange Matrix

|   | USD | EUR | JPY | BTC |
|---|---|---|---|---|
| USD | - | 0.7779 | 102.4590 | 0.0083 |
| EUR | 1.2851 | - | 131.7110 | 0.01125 |
| JPY | 0.0098 | 0.0075 | - | 0.0000811 |
| BTC | 115.65 | 88.8499 | 12325.44 | - |



### Single Currency

All possible arbitrage paths starting with a single currency.

```
               USD
            /   |   \
         /      |      \      
      /         |         \
   EUR         BTC         JPY
  /   \       /   \      /    \
BTC   JPY   EUR   JPY   BTC   EUR
 |     |     |     |     |     |
JPY   BTC   JPY   EUR   EUR   BTC
 ```

 ### Approach

My solution is a brute force approach that will calculate every possible arbitrage path for each currency in the matrix. 

All possible solutions are stored in a `results` array where each object represents a possible arbitrage path. Each possible path also contains information on the first and last currency in the path, as well as an array of remaining currencies to explore.

Since the state of each arbitrage path is stored in the results, our `traverse()' function can be called recursivly for any number of currencies present in the matrix.
