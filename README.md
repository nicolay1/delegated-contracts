## Delegated contracts

### What is this app for

This project gives access to the contracts under 50,000$ in Marin County, CA, that are approved by a County Official delegated by the Board of Supervisors. It take part of a coding challenge by Bouquet.ai.

### launching

```
git clone https://github.com/nicolay1/delegated-contracts
cd delegated-contracts
npm install
node index.js
```

PORT env var is available to choose port (3000 by default)

### chartManager

This object which can be found in `/static/js/chartManager.js`.

- attributes :
  - chart (object) : save c3 chart instance
  - sortBy (string) : sort chart by this value if not none (enum : amount,department,none)
  - order (string) : order chart by this value if not none (enum : asc,desc)
  - settings (string dict) : general settings
- methods :
  - bindTo (string) : select the selector of the binded div (#chart by default)
  - sortEventOn (string) : setter for sortBy and order values, called by onclick events
  - sortData () : update data sorting it according to sortBy and order values
  - insertDataInParams (array,array) - [the two arrays should have same size] :
    offer the form of a good params set for the chart loading functions and
    insert data in it,
    -> return chart data ready to be loaded.
  - loadData () : load data in the binded jsdelivr
  - getData (date) : fetch data.marincounty.org's data with an AJAX request, when
    the data is fetched, it extracts immediatly an aggregated form on it, ready
    to be sorted. It takes in param a date, the data retrieved will be the data
    associated to the month of this date.

### Libraries used

- Jquery (+ui) (CDN)
- C3.js (CDN)
- D3.js (CDN)
- lodash (CDN)
