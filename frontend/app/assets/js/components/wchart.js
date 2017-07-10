define(['jquery','chart'],function($,Chart){
  // plugins
  Chart.plugins.register({
    afterDatasetsDraw: function(chart, easing) {
      var ctx = chart.ctx;
      chart.data.datasets.forEach(function (dataset, i) {
        var meta = chart.getDatasetMeta(i);
        if (!meta.hidden) {
          meta.data.forEach(function(element, index) {
            if(element.hidden){
              return;
            };
            // Draw the text in black, with the specified font
            ctx.fillStyle = 'rgb(68, 68, 68)';

            var fontSize = 12;
            var fontStyle = 'normal';
            var fontFamily = 'Helvetica Neue';
            ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

            // Just naively convert to string for now
            var dataString = dataset.data[index].toString();

            // Make sure alignment settings are correct
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            var padding = 5;
            var position = element.tooltipPosition();
            ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
          });
        }
      });
    }
  });

  // wrapped method
  // colors
  var chartColors = function(data,flag){
    window.chartColors = {
      red: 'rgb(255, 99, 132)',
      green: 'rgb(75, 192, 192)',
      blue: 'rgb(54, 162, 235)',
      purple: 'rgb(153, 102, 255)',
      orange: 'rgb(255, 159, 64)',
      yellow: 'rgb(255, 205, 86)',
      grey: 'rgb(201, 203, 207)'
    };
    var colorNames = Object.keys(window.chartColors);
    if (flag) {
      var newColor =[];
      for (var i = 0; i < data[0].data.length; i++) {
        var colorName = colorNames[i % colorNames.length];
        newColor.push(window.chartColors[colorName]);
        data[0].backgroundColor = newColor;
      }
    }else{
      for (var i = 0; i < data.length; i++) {
        var colorName = colorNames[data.length + i % colorNames.length];
        var newColor = window.chartColors[colorName];
        data[i].backgroundColor = newColor;
        data[i].borderColor = newColor;
        data[i].pointBorderColor = newColor;
        data[i].pointBackgroundColor = newColor;
      }
    }
  };

  // 拆线图表配置
  Chart.defaults.global.elements.line = {
    borderCapStyle: 'butt',
    maintainAspectRatio: false,
    fill: false,
    tension: 0.3,
    pointBorderWidth: 8,
    pointHoverRadius: 5,
    pointHoverBorderWidth: 2,
    pointRadius: 1,
    pointHitRadius: 10,
    borderWidth: 2,
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: 'miter',
  }
  // 定义图表
  function xChart(obj){
    var options = {
      'line': {}
     ,'pie': {
        legend: {
          position: 'right'
        }
      }
     ,'bar': {
        tooltips: {
            mode: 'index',
            intersect: false
        },
        scales: {
          xAxes: [{
            stacked: true
          }],
          yAxes: [{
              stacked: true
          }]
        }
      }
    },
    chartInstance;

    obj.type == 'pie'
        ? chartColors(obj.data.datas, true)
        : chartColors(obj.data.datas, false);

    var ctx = $(obj.elem).get(0).getContext("2d");
    chartInstance = new Chart($(obj.elem), {
      type: obj.type,
      data: {
        labels: obj.data.labels,
        datasets: obj.data.datas
      },
      options: options[obj.type]
    });
    return chartInstance;
  };

  return xChart;
});
