
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

            // setting variable to save the index of the step & doing the next step
            let nextStepIndex = 0;
            doStep(steps[0], tipContainerHtml, nextStepIndex);

            //setting next button to render next step if exists
            $("body").on("click", '.next-btn:contains("Next")', function () {
                if (nextStepIndex < steps.length - 2) {
                    //clearing selector
                    $(steps[nextStepIndex].action.selector).css({ 'box-shadow': 'none', 'border': 'none' });
                    //getting next index
                    nextStepIndex++;
                    //fades out for the fade in
                    $("div.sttip").fadeOut(10);
                    doStep(steps[nextStepIndex], tipContainerHtml, nextStepIndex);
                }
            });
            //setting prev button to render prev step
            $("body").on("click", '.prev-btn:last', function () {
                //clearing selector
                $(steps[nextStepIndex].action.selector).css({ 'box-shadow': 'none', 'border': 'none' });
                //getting next index
                nextStepIndex--;
                //fades out for the fade in
                $("div.sttip").fadeOut(10);
                doStep(steps[nextStepIndex], tipContainerHtml, nextStepIndex);
            });
            //setting button to close the tips
            $("body").on("click", 'button:contains("✕"),.next-btn:contains("Done")', function () {
                closeTip(steps[nextStepIndex]);
            });
            //setting up remind me later button
            $("body").on("click", ".default-later-btn", function () {
                //clearing the selector and setting the div's display to none
                if (confirm("Are you sure you want to be reminded of the tips in 5 seconds?")) {
                    $(steps[nextStepIndex].action.selector).css({ 'box-shadow': 'none', 'border': 'none' });
                    $('div.sttip').css("display", "none");
                    setTimeout(function () {
                        //in 5 seconds, will show div and go back to the first step
                        alert("reminding you of the tips!")
                        $('div.sttip').css("display", "inline");
                        nextStepIndex = 0;
                        doStep(steps[0], tipContainerHtml, nextStepIndex);
                    }, 5000);
                }
            });

            //applying css from jsonp
            applyCSS(tipCss);

        }

        //function that applies css
        function applyCSS(cssString) {
            $("<style>" + cssString + "</style>").appendTo("head");
        }
        //function that applies html
        function applyHTML(htmlString) {
            $(htmlString).appendTo(".popover-inner");
        }
        //function that closes tips by un-highlighting the elements and replacing tip div with empty string
        function closeTip(step) {
            if (confirm("Are you sure you want to close the tips?")) {
                $(step.action.selector).css({ 'box-shadow': 'none', 'border': 'none' });
                $('div.sttip').html("");
            }
        }
        //function that renders step
        function doStep(step, container, index) {

            if (step.action.type == "tip") {
                //fade in
                $("div.sttip").fadeIn(step.action.wdInterval);
                //removing previously added position
                $('div.sttip').css("position", "");
                $('div.sttip').css("right", "");
                $('div.sttip').css("bottom", "");
                $('div.sttip').css("top", "");

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
                //showLaterBt
                $('.tooltip').addClass("showLaterBt");
                //putting the step in its placement
                let placementAmount = "";
                if (step.action.placement == "right") { placementAmount = "300px"; $('div.sttip').css("top", "50px"); }
                else { placementAmount = "150px"; }
                $('div.sttip').css("position", "absolute");
                $('div.sttip').css(step.action.placement, placementAmount);



                //renders tip container, if its the last tip will switch next button text with 'done'
                let tipStepIndex = container.indexOf('>Next');
                if (step.action.roleTexts.nextBt) {
                    applyHTML(container.substring(0, tipStepIndex + 1) + step.action.roleTexts.nextBt + container.substring(tipStepIndex + 5));
                }
                else {
                    applyHTML(container);
                }

                //selects the tip
                setTimeout(function () {
                    $(step.action.selector).css({ 'box-shadow': '4px 4px 4px 4px lightblue', 'border': '1px solid lightgray' })
                    }, step.action.wdInterval);
            }
        }
