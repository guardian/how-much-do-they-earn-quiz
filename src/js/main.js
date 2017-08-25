import reqwest from 'reqwest'
import mainHTML from './text/main.html!text'
import d3 from './lib/d3'
import noUiSlider from './lib/nouislider'

export function init(el, context, config, mediator) {

    el.innerHTML = mainHTML.replace(/%assetPath%/g, config.assetPath);

    reqwest({
        url: 'https://interactive.guim.co.uk/docsdata/1iEeDMzQ3Ra7cMHsHc9TKMch0X8CD13Wq-uLaMuims20.json',
        type: 'json',
        crossOrigin: true,
        success: (resp) => {

            app.database = resp.sheets.income
            console.log(app.database)
            app.initialize()
        }
    });

    var app = {

        database: null,

        sliders: null,

        range: [20000,21000,22000,23000,24000,25000,26000,27000,28000,29000,30000,31000,32000,33000,34000,35000,36000,37000,38000,39000,40000,41000,42000,43000,44000,45000,46000,47000,48000,49000,50000,51000,52000,53000,54000,55000,56000,57000,58000,59000,60000,61000,62000,63000,64000,65000,66000,67000,68000,69000,70000,71000,72000,73000,74000,75000,80000,90000,100000,110000,120000,130000,140000,150000,160000,170000,180000,190000,200000,210000,220000,230000,240000,250000,300000,350000,400000,450000,500000,600000,700000,800000,900000,1000000,1500000,2000000,2500000,3000000,3500000,4000000,4500000,5000000,6000000,7000000,8000000,9000000,10000000,20000000,30000000,40000000,50000000,55000000,60000000],

        initialize: function() {

            var html = '';

            app.database.forEach( (item, index)  => {

                if (index < 11) {

                    html += '<div class="question-container">';

                    html += '<div class="job-box"><div class="job-image" style="background-color: ' + item.background + ';background-image: url(' + config.assetPath + '/assets/imgs/' + item.img + ');"></div></div>';

                    html += '<div class="header-box">' + item.job + '</div>';

                    html += '<div class="question-group">';

                    html += '<div class="question-box">How much do you think ' + item.job.toLowerCase() + ' <strong>should</strong> earn annually?</div>';

                    html += '<input class="amount-box" type="number" pattern="[0-9]*"><div class="answer-box"><div class="slider"></div></div>';

                    html += '</div><div class="question-group">';

                    html += '<div class="question-box">How much do you think ' + item.job.toLowerCase() + ' <strong>actually</strong> earn?</div>';

                    html += '<input class="amount-box" type="number" pattern="[0-9]*"><div class="answer-box"><div class="slider"></div></div>';

                    html += '</div></div></div>';

                }

            })

            d3.select('#quiz-container').html(html)

            app.compile();

        },

        compile: function() {

            app.sliders = document.getElementsByClassName('slider');

            for (var i = 0; i < app.sliders.length; i++) {

                let target = i

                noUiSlider.create(app.sliders[i], {
                    start: 0,
                    step: 1,
                    range: {
                        'min': 0,
                        'max': 500
                    }
                });

                app.sliders[i].noUiSlider.on('slide', function( values, handle, unencoded, tap, positions ) {

                    let amounts = document.getElementsByClassName("amount-box")[target];
                    amounts.value = app.makeItLookNice(values[0]);

                });

            }

            d3.select('#quiz-submit').on("click", function() {
                app.precheck();
            });

        },

        precheck: function() {

            d3.select('#quiz-prompt').html('')

            var proceed = true

            d3.selectAll(".amount-box").each(function(d) {

                if (d3.select(this).value == '') {

                    d3.select('#quiz-prompt').html('You need to answer all the questions before viewing the results')

                    proceed = false

                }

            })

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

        },

        formulate: function() {

            
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
                "entry.821059558": document.getElementsByClassName("amount-box")[14].value,
                "entry.1599655770": document.getElementsByClassName("amount-box")[15].value,
                "entry.635215666": document.getElementsByClassName("amount-box")[16].value,
                "entry.1588745032": document.getElementsByClassName("amount-box")[17].value,
                "entry.1265338617": document.getElementsByClassName("amount-box")[18].value,
                "entry.564887023": document.getElementsByClassName("amount-box")[19].value,
                "entry.955565170": document.getElementsByClassName("amount-box")[20].value,
                "entry.639595039": document.getElementsByClassName("amount-box")[21].value,
            }, 'post','hiddenForm')
        },

        makeItLookNice: function(num) {

            var digit = parseFloat(num).toFixed()

            //var boom = app.range[digit]

            var multiplier = 10000

            var result = parseFloat(digit * multiplier).toFixed();

            return result
        }

    }

}




