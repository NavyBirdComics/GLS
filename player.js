//create style link
var stlink = document.createElement('link');
stlink.rel = "stylesheet";
stlink.href = "https://guidedlearning.oracle.com/player/latest/static/css/stTip.css";
document.getElementsByTagName('head')[0].appendChild(stlink);
// -------
// inject jquery
var jq = document.createElement('script');
jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(jq);
//---
//inject tip script

        $(document).ready(function () {


            $.ajax({
                url: "https://guidedlearning.oracle.com/player/latest/api/scenario/get/v_IlPvRLRWObwLnV5sTOaw/5szm2kaj/?callback=__5szm2kaj&amp;refresh=true&amp;env=dev&amp;type=startPanel&amp;vars%5Btype%5D=startPanel&amp;sid=none&amp;_=1582203987867",
                dataType: "jsonp",
                jsonpCallback: "jsonCallback"
            });
        });


        function jsonCallback(json) {
            let tipContainerHtml = json.data.tiplates.tip;
            let steps = json.data.structure.steps;
            let tipCss = json.data.css;

            //generate every step
            steps.forEach(step => {
                console.log(step);
            });
            // setting variable to save the index of the step & doing the next step
            let nextStepIndex = 0;
            doStep(steps[0], tipContainerHtml, nextStepIndex);

            //setting next button to render next step if exists
            $("body").on("click", ".next-btn", function () {
                if (nextStepIndex < steps.length - 1) {
                    nextStepIndex++;
                    doStep(steps[nextStepIndex], tipContainerHtml, nextStepIndex);
                }
            });
            //setting prev button to render prev step
            $("body").on("click", ".prev-btn", function () {
                nextStepIndex--;
                doStep(steps[nextStepIndex], tipContainerHtml, nextStepIndex);
            });

            console.log(tipContainerHtml);

            //hovertip
            console.log(json.data.tiplates.hoverTip);
            // applyHTML(json.data.tiplates.hovertip);

            //applying css from jsonp
            applyCSS(tipCss);

            //settings
            console.log(json.data.settings);
        }

        //function that applies css
        function applyCSS(cssString) {
            $("<style>" + cssString + "</style>").appendTo("head");
        }
        //function that applies html
        function applyHTML(htmlString) {
            $(htmlString).appendTo(".popover-inner");
        }
        //function that renders step
        function doStep(step, container, index) {

            if (step.action.type == "tip") {
                //removing previously added position
                $('div.sttip').css("position", "");
                $('div.sttip').css("right", "");

                //handling html
                stepHTML = step.action.contents;
                stepHTML = Object.values(stepHTML)[0];
                $(".popover-inner").html(stepHTML);

                //applying the step's classes to show back button if needed
                var stepClass = step.action.classes;
                if (index > 0) {
                    $('.tooltip').addClass(stepClass);
                }
                else {
                    $('.tooltip').removeClass(stepClass);
                }

                //putting the step in its placement
                if (step.action.placement == "right") {
                    $('div.sttip').css("position", "absolute");
                    $('div.sttip').css("right", "300px");
                }


                //rendering step with the the step's index
                let tipStepIndex = container.indexOf('>/');
                let indexString = String(index + 1);
                applyHTML(container.substring(0, tipStepIndex + 1) + indexString + " " + container.substring(tipStepIndex + 2));


            }
        }
