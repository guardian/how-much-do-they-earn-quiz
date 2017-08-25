import iframeMessenger from 'guardian/iframe-messenger'
import reqwest from 'reqwest'
import embedHTML from './text/embed.html!text'
import d3 from './lib/d3'
import './lib/d3.slider'

window.init = function init(el, config) {
    iframeMessenger.enableAutoResize();

    el.innerHTML = embedHTML;

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

        questions: [],

        results: [],

        initialize: function() {

            var html = '';

            app.database.forEach( (item, index)  => {

                if (index < 10) {

                    app.questions.push(index + 'a');
                    app.questions.push(index + 'b');

                    html += '<div class="question-container">';

                    html += '<div class="header-box">' + item.job + '</div>';

                    html += '<div class="question-group">';

                    html += '<div class="question-box">How much do you think ' + item.job.toLowerCase() + ' <strong>should</strong> earn annually?</div>';

                    html += '<div class="answer-box"><div id="slider' + index + 'a" class="slider"></div></div>';

                    html += '<div id="amount' + index + 'a" class="amount-box"></div></div>';

                    html += '<div class="question-group">';

                    html += '<div class="question-box">How much do you think ' + item.job.toLowerCase() + ' <strong>actually</strong> earn?</div>';

                    html += '<div class="answer-box"><div id="slider' + index + 'b" class="slider"></div></div>';

                    html += '<div id="amount' + index + 'b" class="amount-box"></div></div></div>';

                }

            })

            d3.select('#quiz-container').html(html)

            app.compile();

        },

        compile: function() {

            for (var i = 0; i < app.questions.length; i++) {

                let slider = '#slider' + app.questions[i];
                let amount = '#amount' + app.questions[i];


                d3.select(slider).call(d3.slider().min(20000).max(500000).on("slide", function(evt, value) {

                    d3.select(amount).html(app.makeItLookNice(value));

                }));

            }

            d3.select('#quiz-submit').on("click", function() {
                app.precheck();
            });


        },

        precheck: function() {

            d3.select('#quiz-prompt').html('')

            var proceed = true

            d3.selectAll(".amount-box").each(function(d) {

                if (d3.select(this).html()=='') {

                    d3.select('#quiz-prompt').html('You need to answer all the questions before viewing the results')

                    //proceed = false

                }

            })

            if (proceed) {
                app.formulate()
            }


        },

        formulate: function() {

            //                url: 'https://docs.google.com/a/guardian.co.uk/forms/d/1tPxmo15nt_CpidQac9d5n6A6LYwcFx7qXpK_0kbYlZs/formResponse',

            //https://interactive.guim.co.uk/embed/aus/2016/sep/saving-time

            reqwest({
                crossOrigin: false,
                url: 'https://docs.google.com/a/guardian.co.uk/forms/d/1tPxmo15nt_CpidQac9d5n6A6LYwcFx7qXpK_0kbYlZs/formResponse',
                type: 'POST',
                dataType: 'XML',
                data: {
                    "entry.931701662": "Boom",
                    "entry.55003727": "Boom",
                    "entry.513278287": "Boom",
                    "entry.144292002": "Boom",
                    "entry.574180580": "Boom",
                    "entry.232131579": "Boom",
                    "entry.1396463126": "Boom",
                    "entry.769270270": "Boom",
                    "entry.1214910253": "Boom",
                    "entry.1391783442": "Boom"
                },
                success: (resp) => {

                    console.log(resp)
                },
                error: (resp) => {

                    console.log(resp)
                }

            });

            /*
            d3.selectAll(".slider").each(function(d) {

                console.log(d3.select(this).data(dx))

            })
            */

        },

        makeItLookNice: function(num) {
            var result = parseFloat(num).toFixed();
            result = result.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
            return '$' + result
        }

    }
};
