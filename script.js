var ctx = document.getElementById("scatterChart");
var cty = document.getElementById("gradientDescentChart");
var ts_plot = [];
var gd_plot = [];
var theta = [0.0, 0.0];
var J = 0.0;

for (var i = 0; i < trainingSet.length; i++) {
    ts_plot.push({
        x: trainingSet[i][0],
        y: trainingSet[i][1]
    });
}

var datasets = [
    {
        label: "Housing Prices",
        backgroundColor: '#2196F3',
        borderColor: '#ffbb00',
        data: ts_plot
      }
    ];
var gdatasets = [
    {
        label: "Iterations v J (Cost)",
        backgroundColor: '#2196F3',
        borderColor: '#ffbb00',
        data: gd_plot
      }
    ];
var scatterChart = new Chart(ctx, {
    type: 'scatter',
    data: {
        datasets: datasets
    },
    options: {
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom'
            }]
        }
    }
});
var gradientDescentChart = new Chart(cty, {
    type: 'scatter',
    data: {
        datasets: gdatasets
    },
    options: {
        showLine: true,
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom'
            }]
        }
    }
});

scatterChart.update();

function startTimer() {
    // window.setInterval(console.log('hello'),1000);
    gradientDescent();
}

function plotRLine(ts_plot, theta, datasets) {
    let theta_0 = theta[0];
    let theta_1 = theta[1];
    let rg_plot = [];
    let x = 0;
    let hyp = theta_0 + theta_1 * x;
    let xmax = Math.max.apply(Math, ts_plot.map(function (o) {
        return o.x;
    }));
    let xmin = Math.min.apply(Math, ts_plot.map(function (o) {
        return o.x;
    }));
    for (var i = xmin; i <= xmax; i += 0.1) {
        h = theta[0] + (theta[1] * i);
        rg_plot.push({
            x: i,
            y: h
        });
    }
    let rdatasets = {};
    let temp = datasets.indexOf(getDatagraph(datasets, 'Regression Line'));

    if (temp == -1) {
        rdatasets.label = 'Regression Line';
        rdatasets.data = rg_plot;
        rdatasets.backgroundColor = '#ff0000';
        rdatasets.borderColor = '#4e00ff';
        datasets.push(rdatasets);
    } else {
        rdatasets = getDatagraph(datasets, 'Regression Line');
        datasets.splice(temp, 1);
        rdatasets.data = [];
        rdatasets.backgroundColor = '#ff0000';
        rdatasets.borderColor = '#4e00ff';
        rdatasets.data = rg_plot;
        datasets.push(rdatasets);
    }

    scatterChart.update();
}

function plotDataGD(iter, J) {
    gd_plot.push({
        x: iter,
        y: J
    });

    let gd_datasets = {};
    let temp = gdatasets.indexOf(getDatagraph(gdatasets, 'Iterations v J (Cost)'));

    if (temp == -1) {
        gd_datasets.label = 'Iterations v J (Cost)';
        gd_datasets.data = gd_plot;
        gd_datasets.backgroundColor = '#2196F3';
        gd_datasets.borderColor = '#ffbb00';
        gdatasets.push(gd_datasets);
    } else {
        gd_datasets = getDatagraph(gdatasets, 'Iterations v J (Cost)');
        gdatasets.splice(0);
        gd_datasets.data = [];
        gd_datasets.backgroundColor = '#2196F3';
        gd_datasets.borderColor = '#ffbb00';
        gd_datasets.data = gd_plot;
        gdatasets.push(gd_datasets);
    }

    /*if (gradientDescentChart == undefined) {
        gradientDescentChart = new Chart(cty, {
            type: 'scatter',
            data: {
                datasets: gdatasets
            },
            options: {
                showLine: true,
                scales: {
                    xAxes: [{
                        type: 'linear',
                        position: 'bottom'
            }]
                }
            }
        });
    
       gradientDescentChart.update(); 
    }*/
    //gdatasets[0].data = gd_plot;
    gradientDescentChart.update();
}

function clearPlots() {

    let temp = datasets.indexOf(getDatagraph(datasets, 'Regression Line'));
    if (temp != -1) {
        datasets.splice(temp, 1);
        scatterChart.update();
    }
    let temp2 = gdatasets.indexOf(getDatagraph(gdatasets, 'Iterations v J (Cost)'));
    if (temp2 != -1) {
        gdatasets.splice(0);
        gradientDescentChart.clear();
    }
    J = 0.0;
    theta = [0.0, 0.0];
    output.innerHTML = '';
}

function computeCost() {
    let m = ts_plot.length;
    let prediction = 0;
    let sqrE = 0;
    J = 0;
    let theta_zero = parseFloat(theta[0]);
    let theta_one = parseFloat(theta[1]);
    let x = 0;
    let y = 0;

    for (var i = 0; i < m; i++) {
        x = parseFloat((ts_plot[i].x).toFixed(3));
        y = parseFloat((ts_plot[i].y).toFixed(3));
        prediction = theta_zero + (theta_one * x);
        sqrE += Math.pow((prediction - y), 2);
    }
    J = sqrE / (2 * m);
    return J.toFixed(3);
}

function gradientDescent() {

    let t0Sum = 0; // sum of theta0
    let t1Sum = 0; // sum of theta1
    let theta_zero = 0;
    let theta_one = 0;
    let alpha = document.getElementById("alpha").value;
    let iterations = document.getElementById("iter").value;
    let output = document.getElementById("output");
    let m = ts_plot.length;
    let h = 0;
    let J = 0;
    output.innerHTML = '';
    gd_plot = [];
    let x = 0;
    let y = 0;

    for (var j = 0; j < iterations; j++) {
        t0Sum = 0;
        t1Sum = 0;
        for (var i = 0; i < m; i++) {
            x = ts_plot[i].x;
            y = ts_plot[i].y;
            h = theta[0] + (theta[1] * x);

            t0Sum += (h - y);
            t1Sum += ((h - y) * x);
        }
        theta_zero = theta[0] - ((alpha / m) * t0Sum); //
        theta_one = theta[1] - ((alpha / m) * t1Sum); //
        theta[0] = theta_zero;
        theta[1] = theta_one;
        J = computeCost();
        plotDataGD(j, J);
        plotRLine(ts_plot, theta, datasets);
    }
    output.innerHTML += '<br>J after ' + j + ' iterations : ' + J;
    output.innerHTML += '<br>h(x) : ' + (theta[0]).toPrecision(3) + ' + ' + (theta[1]).toPrecision(3) + 'x';
}

function getDatagraph(datasets, label) {
    for (let item of datasets) {
        if (item.label == label) return item;
    }
    return "Plot does not exist";
}
