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
computeCost();

function startTime() {
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
    let gdatasets = {};
    let temp = datasets.indexOf(getDatagraph('Regression Line'));

    if (temp == -1) {
        gdatasets.label = 'Regression Line';
        gdatasets.data = rg_plot;
        gdatasets.backgroundColor = '#ff0000';
        gdatasets.borderColor = '#4e00ff';
        datasets.push(gdatasets);
    } else {
        gdatasets = getDatagraph('Regression Line');
        datasets.splice(temp, 1);
        gdatasets.data = [];
        gdatasets.backgroundColor = '#ff0000';
        gdatasets.borderColor = '#4e00ff';
        gdatasets.data = rg_plot;
        datasets.push(gdatasets);
    }

    scatterChart.update();
}

function plotDataGD(iter, J) {
    gd_plot.push({
        x: iter,
        y: J
    });

    gdatasets[0].data = gd_plot;
    gradientDescentChart.update();
}

function clearPlots() {
    let rdatasets = {};
    let temp = datasets.indexOf(getDatagraph(datasets,'Regression Line'));
    //console.log(datasets);
   // console.log(getDatagraph('Regression Line'));
    if (temp != -1) {
        rdatasets = getDatagraph(datasets,'Regression Line');
        datasets.splice(temp, 1);
        scatterChart.update();
    }
    
    /*let temp2 = gdatasets.indexOf(getDatagraph(gdatasets,'Iterations v J (Cost)'));
    if (temp2 != -1) {
        gdatasets = getDatagraph(gdatasets,'Iterations v J (Cost)');
        gradientDescentChart.destroy();        
        gradientDescentChart.update();
    }*/
}

function computeCost() {
    let m = ts_plot.length;
    let prediction = 0;
    let sqrE = 0;
    J = 0;
    for (var i = 0; i < m; i++) {
        prediction = theta[0] + (theta[1] * ts_plot[i].x);
        sqrE += Math.pow((prediction - ts_plot[i].y), 2);
    }
    J = sqrE / (2 * m);
    return J;
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
    let J = computeCost();
    output.innerHTML = '';
    gd_plot = [];
    for (var j = 0; j < iterations; j++) {
        for (var i = 0; i < m; i++) {
            h = theta[0] + (theta[1] * ts_plot[i].x);
            t0Sum += (h - ts_plot[i].y);
            t1Sum += (h - ts_plot[i].y) * ts_plot[i].x;
        }

        theta_zero = theta[0] - ((alpha / m) * t0Sum);
        theta_one = theta[1] - ((alpha / m) * t1Sum);
        theta = [theta_zero, theta_one];
        J = computeCost();
        //console.log('J in GD: ' + J);
        plotDataGD(j, J);
    }
    output.innerHTML += 'J : ' + J;
    output.innerHTML += '<br>theta : ' + theta;
    output.innerHTML += '<br>h(x) : ' + theta[0] + ' + ' + theta[1] + 'x';

    plotRLine(ts_plot, theta, datasets);
}

function getDatagraph(datasets,label) {
    for (let item of datasets) {
        if (item.label == label) return item;
    }
    return "Plot does not exist";
}
