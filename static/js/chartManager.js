function formatYearAndMonth(date){
  return date.getFullYear()+"-"+(date.getMonth() < 10 ? "0"+date.getMonth() : date.getMonth())
}
/*
  chart manager
  attributes :
    - chart (object) : save c3 chart instance
    - sortBy (string) : sort chart by this value if not none (enum : amount,department,none)
    - order (string) : order chart by this value if not none (enum : asc,desc)
    - settings (string dict) : general settings
  methods :
    - bindTo (string) : select the selector of the binded div (#chart by default)
    - sortEventOn (string) : setter for sortBy and order values, called by onclick events
    - sortData () : update data sorting it according to sortBy and order values
    - insertDataInParams (array,array) - [the two arrays should have same size] :
      offer the form of a good params set for the chart loading functions and
      insert data in it,
      -> return chart data ready to be loaded.
    - loadData () : load data in the binded jsdelivr
    - getData () : fetch data.marincounty.org's data with an AJAX request, when
      the data is fetched, it extracts immediatly an aggregated form on it, ready
      to be sorted.
*/
var chartManager = {
  data : [],
  chart : undefined,
  sortBy : 'none',
  order : 'asc',
  settings : {
    bindTo : '#chart',
    defaultText : 'Nothing to display, please choose a(nother) date below',
    xLabel : 'Total contracts amount by department',
    yLabel : 'Contracts amount ($)',
  },
  bindTo : function(id){
    this.settings.bindTo = id
  },
  sortEventOn : function(type){
    this.sortBy = (type === "amount" || type === "department") ? type : "none";
    this.order = (this.order === 'asc') ? 'desc' : 'asc';
    this.sortData();
    this.loadData();
  },
  sortData : function(){
    if(this.sortBy !== 'none'){
      this.data = _.orderBy(this.data, [this.sortBy], [this.order]);
    }
  },
  insertDataInParams : function(depList,amountList){
    return {
      bindto: chartManager.settings.bindTo,
      data : {
        columns : amountList,
        type: 'bar',
      },
      axis: {
          x: {
              type: 'category',
              categories: depList,
              tick : {
                rotate: 60,
                width: 100,
                height: 60,
                multiline:true,
              }
          },
          y: {
            label:{
              text:this.settings.yLabel,
              position:'outer-middle'
            }
          }
      }
    }
  },
  loadData : function(){
    var departmentList = _.concat(_.map(
      this.data,
      function(department){return department.department}))
    var amountList = [
      _.concat(
        [this.settings.xLabel],
        _.map(this.data,function(department){return department.amount})
      )
    ]
    if(departmentList.length === 0){
      $(this.settings.bindTo).html(this.settings.defaultText)
    }else{
      if(this.chart === undefined){
        chartManager.chart = c3.generate(
          this.insertDataInParams(departmentList,amountList)
        )
      }else{
        chartManager.chart = c3.generate(
          this.insertDataInParams(departmentList,amountList)
        )
      }
    }
  },
  getData : function(date){
    var dataQuery =
      "https://data.marincounty.org/resource/mw3d-ud6d.json?\
$where=month_and_year='"+formatYearAndMonth(date)+"'"
    $.ajax({
      url : dataQuery,
      type : 'GET',
      contentType : "application/json",
      dataType: 'json',
      success : function(data, statut){
        /*
           some "optimised" and "pratical" agregation
           The final data array may be use to perform sort, by department or
           amount.
           (use of lodash functions as "optimised" function)
           1st step : group amount defined contracts by department
           2nd step : agregate contract's amount in each department
             there is an integer parsing needed for amount values.
             We note that this parsing can't be done before (it would need
             a Object.assign call which would may not be optimised in this
             context)
        */
        var groupedData = _.groupBy(
          _.filter(data,function(contract){
            return contract.amount !== undefined
          }),
          function(contract){return contract.department}
        )
        console.log(groupedData)
        chartManager.data = _.map(
          Object.keys(groupedData),
          function(department){
            return {
                department : department,
                amount : _.sum(
                  _.map(
                    groupedData[department],
                    function(contract){return parseInt(contract.amount)}
                  )
                )
              }
            }
        )
        chartManager.sortData()
        chartManager.loadData()
      } // success end
    });
  }
}
