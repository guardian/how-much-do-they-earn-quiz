import reqwest from 'reqwest'
import mainHTML from './text/main.html!text'
import $ from './lib/jquery'
import * as d3 from 'd3'
import * as d4 from 'd3-svg-annotation'

export function init(el, context, config, mediator) {

    el.innerHTML = mainHTML.replace(/%assetPath%/g, config.assetPath);

    reqwest({
        url: 'https://interactive.guim.co.uk/docsdata/1iEeDMzQ3Ra7cMHsHc9TKMch0X8CD13Wq-uLaMuims20.json',
        type: 'json',
        crossOrigin: true,
        success: (resp) => {

            app.database = resp.sheets.income
            app.initialize()
        }
    });

    var app = {

        database: null,

        sliders: null,

        humanoids: null,

        amounts: null,

        responses: null,

        isolated: [],

        toggles: null,

        initialize: function() {

            var html = '';

            app.database.forEach( (item, index)  => {

                app.database[index]["jid"] = index

                if (index < 7) {

                    html += '<div class="question-container">';

                    html += '<div class="job-box"><div class="job-image" style="background-color: ' + item.background + ';background-image: url(' + config.assetPath + '/assets/imgs/' + item.img + ');"></div></div>';

                    html += '<div class="header-box">' + item.job + '</div>';

                    html += '<div class="question-group">';

                    html += '<div class="question-box">How much do you think ' + item.label + ' <strong>actually</strong> ' + ((index==0)?'makes':'make') +' annually?</div>';

                    html += '<div class="answer-box"><div class="label-container"><div class="label1">Input</div><div class="label2">Amount</div></div><div class="humanised_number"></div><input value class="amount-box" type="number" max="100000000" pattern="[0-9]*"></div>';

                    html += '</div><div class="question-group">';

                    html += '<div class="question-box">How much do you think ' + item.label + ' <strong>should</strong> make annually?</div>';

                    html += '<div class="answer-box"><div class="label-container"><div class="label1">Input</div><div class="label2">Amount</div></div><div class="humanised_number"></div><input value class="amount-box" type="number" max="100000000" pattern="[0-9]*"></div>';

                    html += '</div></div></div>';

                }

            })

            d3.select('#quiz-container').html(html)

            app.scroller()

            app.compile();

        },

        scroller: function() {

            var $question_block = $('.question-container');

            $question_block.each(function(){
                if($(this).offset().top > $(window).scrollTop()+$(window).height()*0.9) {
                    $(this).addClass('is-hidden');
                }
            });

            $(window).on('scroll', function(){
                $question_block.each(function(){
                    if( $(this).offset().top <= $(window).scrollTop()+$(window).height()*0.9 && $(this).hasClass('is-hidden') ) {
                        $(this).removeClass('is-hidden').addClass('bounce-in');
                    }
                });
            });
        },

        multiplier: function(num,target,multiplier) {

            let amounts = document.getElementsByClassName("amount-box")[target];
            
            var digit = parseFloat(num).toFixed()

            var result = parseFloat(digit * multiplier).toFixed();

            amounts.value = result;

        },

        compile: function() {

            app.amounts = document.getElementsByClassName('amount-box');

            app.humanoids = document.getElementsByClassName('humanised_number');

            for (var i = 0; i < app.amounts.length; i++) {

                let obj = {}

                let target = i

                obj["id"] = target

                app.isolated.push(obj)

                document.getElementsByClassName("amount-box")[target].oninput = function() {

                    var max = parseInt($(this).attr('max'));

                    if (document.getElementsByClassName("amount-box")[target].value > max) {
                        document.getElementsByClassName("amount-box")[target].value = max;
                    }

                    var isNumber =  /^\d+$/.test(document.getElementsByClassName("amount-box")[target].value);

                    if (isNumber==false) {
                        document.getElementsByClassName("amount-box")[target].value = ''
                    }

                    let amounts = document.getElementsByClassName("humanised_number")[target];
                    amounts.innerHTML = '$' + app.formatValue(document.getElementsByClassName("amount-box")[target].value);

                };

            }

            d3.select('#quiz-submit').on("click", function() {
                app.precheck();
            });

        },

        precheck: function() {

            d3.select('#quiz-prompt').html('')

            var proceed = true

            var checklist = document.getElementsByClassName('amount-box');

            for (var i = 0; i < checklist.length; i++) {

                if (checklist[i].value == '') {

                    d3.select('#quiz-prompt').html('You need to answer all the questions before viewing the results')

                    proceed = false

                } else {

                    app.isolated[i]["estimate"] = checklist[i].value

                }
            }

            if (proceed) {

                app.formulate()

            }

        },

        transit: function(path, params, method, target) {

            method = method || "post";

            var form = document.createElement("form");
            form.setAttribute("method", method);
            form.setAttribute("action", path);
            form.setAttribute("target", target);
            
            for(var key in params) {
                if(params.hasOwnProperty(key)) {
                    var hiddenField = document.createElement("input");
                    hiddenField.setAttribute("type", "hidden");
                    hiddenField.setAttribute("name", key);
                    hiddenField.setAttribute("value", params[key]);

                    form.appendChild(hiddenField);
                 }
            }

            document.body.appendChild(form);
            form.submit();
            app.prepare();

        },

        formulate: function() {

            d3.select('#quiz-submit').style('display','none')

            d3.select('#loading-container').style('display','block')

            document.getElementById('loading-container').scrollIntoView();
            
            app.transit('https://docs.google.com/a/guardian.co.uk/forms/d/1tPxmo15nt_CpidQac9d5n6A6LYwcFx7qXpK_0kbYlZs/formResponse', {

                "entry.931701662": document.getElementsByClassName("amount-box")[0].value,
                "entry.55003727": document.getElementsByClassName("amount-box")[1].value,

                "entry.513278287": document.getElementsByClassName("amount-box")[2].value,
                "entry.144292002": document.getElementsByClassName("amount-box")[3].value,

                "entry.574180580": document.getElementsByClassName("amount-box")[4].value,
                "entry.232131579": document.getElementsByClassName("amount-box")[5].value,

                "entry.1396463126": document.getElementsByClassName("amount-box")[6].value,
                "entry.769270270": document.getElementsByClassName("amount-box")[7].value,

                "entry.1214910253": document.getElementsByClassName("amount-box")[8].value,
                "entry.1391783442": document.getElementsByClassName("amount-box")[9].value,

                "entry.791161495": document.getElementsByClassName("amount-box")[10].value,
                "entry.1741030491": document.getElementsByClassName("amount-box")[11].value,

                "entry.759942158": document.getElementsByClassName("amount-box")[12].value,
                "entry.1900681485": document.getElementsByClassName("amount-box")[13].value,

            }, 'post','hiddenForm')
        },

        JSONize: function(str) {
          return str
            // wrap keys without quote with valid double quote
            .replace(/([\$\w]+)\s*:/g, function(_, $1){return '"'+$1+'":'})    
            // replacing single quote wrapped ones to double quote 
            .replace(/'([^']+)'/g, function(_, $1){return '"'+$1+'"'})         
        },

        prepare: function() {

            reqwest({
                url: 'https://interactive.guim.co.uk/2017/08/ceo-results/ceo-results.json',
                crossOrigin: true,
                success: (resp) => {

                    app.responses = resp;

                    app.resizer()

                    app.assemble()

                }

            });

        },

        resizer: function() {

            $(window).resize(function() {
                clearTimeout($.data(this, 'resizeTimer'));
                $.data(this, 'resizeTimer', setTimeout(function() {
                    app.assemble()
                }, 200));
            });

        },

        assemble: function() {

            // Request the data
            var html = "<p class='quizSans'>Here, you can see your <span class='magenta'>guess or suggestion</span> against the <span class='dark_purple'>actual average salary</span> for that job, based on on figures from the ATO for 2014-15. You can also see how it compares with other <span class='light_blue'>readers' responses</span>. Smaller circles indicate fewer responses, with all responses rounded to the nearest 1000.</p>";

            var tally = 0;

            app.database.forEach( (item, index)  => {

                if (index < 7) {

                    html += '<div class="question-container">';

                    html += '<div class="job-box"><div class="job-image" style="background-color: ' + item.background + ';background-image: url(' + config.assetPath + '/assets/imgs/' + item.img + ');"></div></div>';

                    html += '<div class="header-box">' + item.job + '</div>';

                    html += '<div class="question-group">';

                    html += '<div class="question-box">How much do ' + item.label + ' earn annually?</div>';

                    html += '<div id="viz_' + tally + '" class="visualization-container"></div>';

                    html += '<div style="margin-top:20px"></div>';

                    tally++

                    html += '<div class="question-box">How much should ' + item.label + ' really earn annually?</div>';

                    html += '<div id="viz_' + tally + '" class="visualization-container"></div>';

                    tally++

                    html += '</div></div>';

                }

            })

            d3.select('#viz-container').html(html)

            app.vizualize();


        },

        preview: function() {

            var temp = []

            for (var i = 0; i < 6; i++) {
                var obj = {}
                obj["estimate"] = 100000
                obj["id"] = i
                temp.push(obj)
            }

            app.isolated = temp
            app.assemble()

        },

        vizualize: function() {

            d3.select('#loading-container').style('display','none')

            var questions = ["Question_1a","Question_1b",
                    "Question_2a","Question_2b",
                    "Question_3a","Question_3b",
                    "Question_4a","Question_4b",
                    "Question_5a","Question_5b",
                    "Question_6a","Question_6b",
                    "Question_7a","Question_7b",
                    "Question_8a","Question_8b",
                    "Question_9a","Question_9b",
                    "Question_10a","Question_10b",
                    "Question_11a","Question_11b"]

            var payslips = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11]

            var width = document.querySelector("#viz-container").getBoundingClientRect().width, 
            height = 150,
            centre = height / 2, padding = 2, margin = 40;

            var viz = document.getElementsByClassName('visualization-container');

            for (var i = 0; i < viz.length; i++) {

                let target = i

                let data = app.responses[questions[i]].data;

                let average = app.responses[questions[i]].average;

                let estimate = parseInt(app.isolated[i].estimate)

                let reality = payslips[target] ; 

                let pay = parseInt(app.database[reality].pay)

                let desc = app.database[reality].job

                let svg = d3.select("#viz_"+target)
                    .append('svg')
                    .attr('class', 'chart')
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", `translate(0,0)`);

                // Set the X a axis min value
                let xMin = d3.min(data, function (d) { return d.number; });

                // If the users estimate is less than the min value, reset the min value to their estimate
                (estimate <= xMin) ? xMin = estimate : '' ;

                (pay <= xMin) ? xMin = pay : '' ;

                // Set the X a axis max value
                let xMax = d3.max(data, function (d) { return d.number; });

                // If the users estimate is more than the max value, reset the max value to their estimate
                (estimate >= xMax) ? xMax = estimate : '' ;

                (pay >= xMax) ? xMax = pay : '' ;

                //console.log(desc + ' | '  + xMin +   ' | '  +  xMax +   ' | '  +  pay +   ' | '  +  estimate)

                let xRange = xMax - xMin;

                var totals = data.map( (value) => { return value.count });

                var total = totals.reduce( (a, b) => { return a + b; }, 0);
                                    
                let x = d3.scaleLinear() //d3.scale.linear()
                    .domain([xMin - (xRange * .05), xMax + (xRange * .05)])
                    .range([0, width]);

                let y = d3.scaleLinear() //d3.scale.linear()
                    .domain([0, height])
                    .range([height, 0]);

                let scale = d3.scaleSqrt() //d3.scale.sqrt()
                    .domain([d3.min(data, function (d) { return d.count; }), d3.max(data, function (d) { return d.count; })])
                    .range(ranger(total));

                let opacity = d3.scaleSqrt() //d3.scale.sqrt()
                    .domain([d3.min(data, function (d) { return d.count; }), d3.max(data, function (d) { return d.count; })])
                    .range(render(total));


                function ranger(x) {

                    return (x > 1000) ? [1,9] : [5,9]

                }  


                function render(x) {

                    return (x > 1000) ? [.01, .2] :
                        (x > 100) ? [.02, .3] : [0.3, 0.4]

                }  

                // V3
                //let xAxis = d3.svg.axis().scale(x).orient("bottom");

                let xAxis = d3.axisBottom()
                    .scale(x)
                    .ticks((width < 500) ? 2 : 10)
                    .tickFormat (function (d) { return app.formatValue(d) })
                
                svg.append("g")
                  .attr("class", "x axis")
                  .attr("transform", `translate(0,${height-20})`)
                  .call(xAxis)
                  .append("text")
                        .attr("x", width + 20)
                        .attr("y", margin - 10)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .style("font-size", "0.7px")


                 //d3.max(data, function (d) { return d.count; })

                if (total > 5) {

                    // Display the average if we have enough responses
                    svg.append("line")
                        .attr("x1", () => { return x(average) })
                        .attr("y1", (height/3) - 50)
                        .attr("x2", () => { return x(average) })
                        .attr("y2", (height/3) + 50)
                        .attr("stroke", "#b5b2af")
                        .attr("stroke-width", "1")
                        .attr("stroke-dasharray","2,1")

                    svg.append("text")
                        .attr("x", () => { return x(average) })
                        .attr("y", (height/3) + 60)
                        .text("Response average: ")
                        .attr("text-anchor",(x(average) < (width/2)) ? "start" : "end")

                    svg.append("text")
                        .attr("x", () => { return x(average) })
                        .attr("y", (height/3) + 70)
                        .text("$"+app.formatValue(average))
                        .attr("text-anchor",(x(average) < (width/2)) ? "start" : "end")


                }

                svg.selectAll("circle")
                    .data(data)
                    .enter()
                    .insert("circle")
                    .attr("cx", function (d) { return x(d.number); })
                    .attr("cy", height/3)
                    .attr("opacity", function (d) { return opacity(d.count); })
                    .attr("r", function (d) { return scale(d.count); })
                    .style("fill", "#35a4e6")

                // What the Guardian reader answered

                svg.append("circle")
                    .attr("cx", () => { return x(estimate); })
                    .attr("cy", height/3)
                    .attr("r", 10)
                    .attr("fill", "#dc2a7d")

                let notes1 = [{
                    note: {
                      label: "Your answer: $" + app.formatValue(estimate),
                      wrap: 190
                    },
                    subject: {
                      radius: 15
                    },
                    x: x(estimate),
                    y: height/3,
                    dy: -30,
                    dx: (x(estimate) < (width/2)) ? 30 : -30,
                }]

                let makeAnnotations1 = d4.annotation()
                    .type(d4.annotationCalloutCircle)
                    .annotations(notes1)

                svg.append("g")
                    .attr("class", "annotation-group first")
                    .call(makeAnnotations1)

                // What they actually earn

                svg.append("circle")
                    .attr("cx", () => { return x(pay); })
                    .attr("cy", height/3)
                    .attr("r", 10)
                    .attr("fill", "#4e0375")

                let notes2 = [{
                    note: {
                      label: "Actual average salary: $" + app.formatValue(pay),
                      wrap: 190
                    },
                    subject: {
                      radius: 15
                    },
                    x: x(pay),
                    y: height/3,
                    dy: 30,
                    dx: (x(pay) < (width/2)) ? 30 : -30
                }]

                let makeAnnotations2 = d4.annotation()
                    .type(d4.annotationCalloutCircle)
                    .annotations(notes2)

                svg.append("g")
                    .attr("class", "annotation-group first")
                    .call(makeAnnotations2)

            }

        },

        formatValue: function(num) {

            return (num > 999999) ? parseFloat(num / 1000000).toFixed(1) + 'm' :
                (num > 999) ? parseFloat(num / 1000).toFixed(1) + 'k' : num

        },

        humanize: function(num) {
            var result = parseFloat(num).toFixed();
            result = result.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
            return '$' + result
        },

        makeItLookNice: function(num, target) {

            let digit = parseFloat(num).toFixed()

            let toggle = document.getElementsByClassName("switch-toggle")[target];

            let inputs = toggle.getElementsByTagName('input');

            let multiplier = 1000

            for (let i = 0; i < inputs.length; ++i) {

                if (inputs[i].checked) {
                  multiplier = inputs[i].value
                }

            }

            let result = parseFloat(digit * multiplier).toFixed();

            return result
        }

    }

}




