(function (){ // Inits basic components and starts the website's basic structure.

    let header = $("<div>");
    header.attr("class", "col-xl-12 header");
    $("#form").append(header);

    let navBar = $("<header>");

    let storedCoins = new Array ();

    let container = $("<div>");
    container.attr ("class", "col-xl-12 coinContainer");
    $("#form").append(container);

    createNavBar(navBar, header, storedCoins, container);

    sessionStorage.setItem("counter", 0);

    loadingAnimation(container);

    getCoins(container, storedCoins);
    
})();

function createNavBar(navBar, header, storedCoins, container) { // Creates the navbar through parts.
    let logoLink = $("<a>");
    logoLink.attr("class", "logoText");
    logoLink.attr("href", "#");
    logoLink.html("Coin Vault");

    navBar.append(logoLink);

    let navMenuToggle = $("<div>");
    navMenuToggle.attr("class", "menu-toggle");

    navBar.append(navMenuToggle);

    let nav = $("<nav>");

    navBar.append(nav);

    let navUl = $("<ul>");
    navUl.attr("class", "navUl");
    
    nav.append(navUl);

    createNavHomeComponent(navUl, storedCoins, container);

    createNavLiveReportsComponent(navUl, storedCoins, container);

    createNavAboutComponent(navUl, container);

    createNavSearchComponent(navUl, container, storedCoins);

    let clear = $("<div>");
    clear.attr("class", "clearfix");

    navBar.append(clear);

    header.append(navBar);

    $(".menu-toggle").click (function () {
        $(".menu-toggle").toggleClass("active");
        $("nav").toggleClass("active");
    })

}

function loadingAnimation(currentContainer) { // Loading animation, split into 4 functions.

    let loader = $("<div>");
    loader.attr("class", "loader");

    let row = $("<div>");
    row.attr("class", "row");

    loader.append(row);

    createFirstAnimationRow (row);

    let rowTwo = $("<div>");
    rowTwo.attr("class", "row");

    loader.append(rowTwo);

    createSecondAnimationRow (rowTwo);

    let rowThree = $("<div>");
    rowThree.attr("class", "row");

    loader.append(rowThree);

    createThirdAnimationRow (rowThree);

    let rowFour = $("<div>");
    rowFour.attr("class", "row");

    loader.append(rowFour);

    createFourthAnimationRow (rowFour);

    currentContainer.append(loader);
}

function createFirstAnimationRow (row) { // Loading animation 1
    let loadingOne = $("<div>");
    loadingOne.attr("class" , "arrow up outer outer-18");

    let loadingTwo = $("<div>");
    loadingTwo.attr("class" , "arrow down outer outer-17");

    let loadingThree = $("<div>");
    loadingThree.attr("class" , "arrow up outer outer-16");

    let loadingFour = $("<div>");
    loadingFour.attr("class" , "arrow down outer outer-15");

    let loadingFive = $("<div>");
    loadingFive.attr("class" , "arrow up outer outer-14");

    row.append(loadingOne);
    row.append(loadingTwo);
    row.append(loadingThree)
    row.append(loadingFour);
    row.append(loadingFive);
}

function createSecondAnimationRow (rowTwo) { // Loading animation 2
    let loadingSix = $("<div>");
    loadingSix.attr("class" , "arrow up outer outer-1");

    let loadingSeven = $("<div>");
    loadingSeven.attr("class" , "arrow down outer outer-2");

    let loadingEight = $("<div>");
    loadingEight.attr("class" , "arrow up inner inner-6");

    let loadingNine = $("<div>");
    loadingNine.attr("class" , "arrow down inner inner-5");

    let loadingTen = $("<div>");
    loadingTen.attr("class" , "arrow up inner inner-4");

    let loadingEleven = $("<div>");
    loadingEleven.attr("class" , "arrow down outer outer-13");

    let loadingTwelve = $("<div>");
    loadingTwelve.attr("class" , "arrow up outer outer-12");

    rowTwo.append(loadingSix);
    rowTwo.append(loadingSeven);
    rowTwo.append(loadingEight)
    rowTwo.append(loadingNine);
    rowTwo.append(loadingTen);
    rowTwo.append(loadingEleven);
    rowTwo.append(loadingTwelve);
}

function createThirdAnimationRow (rowThree) { // Loading animation 3
    let loadingThirteen = $("<div>");
    loadingThirteen.attr("class" , "arrow down outer outer-3");

    let loadingFourteen = $("<div>");
    loadingFourteen.attr("class" , "arrow up outer outer-4");

    let loadingFifteen = $("<div>");
    loadingFifteen.attr("class" , "arrow down inner inner-1");

    let loadingSixteen = $("<div>");
    loadingSixteen.attr("class" , "arrow up inner inner-2");

    let loadingSeventeen = $("<div>");
    loadingSeventeen.attr("class" , "arrow down inner inner-3");

    let loadingEighteen = $("<div>");
    loadingEighteen.attr("class" , "arrow up outer outer-11");

    let loadingNineteen = $("<div>");
    loadingNineteen.attr("class" , "arrow down outer outer-10");

    rowThree.append(loadingThirteen);
    rowThree.append(loadingFourteen);
    rowThree.append(loadingFifteen)
    rowThree.append(loadingSixteen);
    rowThree.append(loadingSeventeen);
    rowThree.append(loadingEighteen);
    rowThree.append(loadingNineteen);
}

function createFourthAnimationRow (rowFour) { // Loading animation 4
    let loadingTwenty = $("<div>");
    loadingTwenty.attr("class" , "arrow down outer outer-5");

    let loadingTwentyone = $("<div>");
    loadingTwentyone.attr("class" , "arrow up outer outer-6");

    let loadingTwentytwo = $("<div>");
    loadingTwentytwo.attr("class" , "arrow down outer outer-7");

    let loadingTwentythree = $("<div>");
    loadingTwentythree.attr("class" , "arrow up outer outer-8");

    let loadingTwentyfour = $("<div>");
    loadingTwentyfour.attr("class" , "arrow down outer outer-9");

    rowFour.append(loadingTwenty);
    rowFour.append(loadingTwentyone);
    rowFour.append(loadingTwentytwo)
    rowFour.append(loadingTwentythree);
    rowFour.append(loadingTwentyfour);
}

function createNavHomeComponent (navUl, storedCoins, container) { // Creates the Home component in the nav bar.
    let liOne = $("<li>");

    let navHome = $("<a>");
    navHome.attr("class", "active showHome");
    navHome.attr("href", "#");
    navHome.html("Home");
    navHome.click (function (){
        $(".showLiveReports").removeClass("active");
        $(".showAbout").removeClass("active");
        $(".showHome").addClass("active");
        getCoins(container, storedCoins);
    })
    
    liOne.append(navHome);

    navUl.append(liOne);
}

function createNavLiveReportsComponent (navUl, storedCoins, container) { // Creates the Live Reports component in the nav bar.
    let liTwo = $("<li>");

    let navLiveReports = $("<a>");
    navLiveReports.attr("class", "showLiveReports");
    navLiveReports.html("Live Reports");
    navLiveReports.attr("href", "#");
    navLiveReports.click(function () {
        if (storedCoins.length == 0){
        alert ("Please pick atleast 1 coin first");
        }
        else {
            $(".showLiveReports").addClass("active");
            $(".showHome").removeClass("active");
            $(".showAbout").removeClass("active");
            container.empty();
            loadingAnimation(container);
            let allPickedCoins = "";
            for (let i = 0; i < storedCoins.length; i++){
                if (i != storedCoins.length-1){
                    allPickedCoins = allPickedCoins + storedCoins[i].symbol + ","; 
                }
                else {
                    allPickedCoins = allPickedCoins + storedCoins[i].symbol;
                }
            }
        
            let upperCaseSymbols = new Array ();
            let getAllCoinValues = new Array ();
        
            for (let i = 0; i < storedCoins.length; i++) {
                upperCaseSymbols.push(storedCoins[i].symbol.toUpperCase());
                let coinValue = "data." + upperCaseSymbols[i] + ".USD";
                getAllCoinValues.push(coinValue);
            }
            drawGraph(getAllCoinValues, upperCaseSymbols, allPickedCoins);
        }
    });

    liTwo.append(navLiveReports);

    navUl.append(liTwo);
}

function createNavAboutComponent (navUl, container) { // Creates the About component in the nav bar.
    let liThree = $("<li>");

    let navAbout = $("<a>");
    navAbout.attr("class", "showAbout");
    navAbout.html("About");
    navAbout.attr("href", "#");
    navAbout.click(function () {
        $(".showAbout").addClass("active");
        $(".showHome").removeClass("active");
        $(".showLiveReports").removeClass("active");
        printAbout(container);
    })

    liThree.append(navAbout);

    navUl.append(liThree);
}

function createNavSearchComponent (navUl, container, storedCoins) { // Creates the search bar in the nav bar.
    let liFour = $("<li>");
    liFour.attr("class", "liFour");

    let navSearch = $("<input>");
    let navSearchButton = $("<button>");
    navSearchButton.attr("class", "showSearch");
    navSearchButton.html("Search");

    navSearchButton.click (function () {
        container.empty();
        $(".showLiveReports").removeClass("active");
        $(".showAbout").removeClass("active");
        $(".showHome").removeClass("active");
        if (checkInput(navSearch.val())) {
            loadingAnimation(container);
            searchForCoin(navSearch.val(), container, storedCoins);
            navSearch.val("");
        }
        else {
            let error = $("<div>");
            error.attr("class", "alert alert-danger");
            error.append("Please make sure to enter a coin's name. Make sure to use letters only.");
            container.append(error);
            navSearch.val("");
        }
    })

    liFour.append(navSearch);
    liFour.append(navSearchButton);
    navUl.append(liFour);
}

function checkInput (navSearch) { // Checks the input inserted into the search bar.
    if (navSearch == "") {
        return false;
    }
    else if (!doesStringContainDigits(navSearch)) {
        return false;
    }
    return true;
}

function doesStringContainDigits(navSearch) { // Regex that checks if the input contains only letters.
    var regex = /^[a-zA-Z]+$/;
    return regex.test(String(navSearch).toLowerCase());
}

function getCoins (container, storedCoins) { // Gets coins from the first API.
    console.log("Start");
    $.ajax({
        type: 'GET',
        url: "https://api.coingecko.com/api/v3/coins/",
        }).done(function (data) {
                console.log(data);
                revealCoins(data, container, storedCoins);
        }).fail(function (msg) {
            console.log("Failure!");
        }).always(function (msg) {
        console.log("Mission complete!");
    });
    console.log("End");
}

function searchForCoin (navSearch, container, storedCoins) { // Searches for a specific coin.
    console.log("Start");   
    $.ajax({
        type: 'GET',
        url: "https://api.coingecko.com/api/v3/coins/" + navSearch,
        }).done(function (data) {
            console.log(data);
            revealCoins(data, container, storedCoins);
        }).fail(function (msg) {
            container.empty();
            let error = $("<div>");
            error.attr("class", "alert alert-danger");
            error.append("Name not found. Please try another one or use another function.");
            container.append(error);
            console.log("Failure!");
        }).always(function (msg) {
        console.log("Mission complete!");
    });
    console.log("End");

}

async function getMoreDetails (id) { // Grabs more details with a promise function.
    console.log("Start");   
    let result = await $.ajax({
        type: 'GET',
        url: "https://api.coingecko.com/api/v3/coins/" + id,
        }).done(function (data) {
            console.log(data);
            let coinData = new Array ();
            coinData.push(data.image.small);
            coinData.push(data.market_data.current_price.usd);
            coinData.push(data.market_data.current_price.eur);
            coinData.push(data.market_data.current_price.ils);
            sessionStorage.setItem("" + data.symbol, JSON.stringify(coinData));
            setTimeout(function(){
                sessionStorage.removeItem("" + data.symbol);
            }, 120000);
        }).fail(function (msg) {
            console.log("Failure!");
        }).always(function (msg) {
        console.log("Mission complete!");
    });
    console.log("End");

                return result;
}

function revealCoins (data, container, storedCoins) { // Prints the coins into cards into the container.

    container.empty();

    if (sessionStorage.getItem("coinsData") == null) {
        sessionStorage.setItem("coinsData", data);
    }

    $(data).each (function (i, coin){
            let coinCard = $("<div>");
            coinCard.attr ("class", "col-xs-12 col-sm-6 col-md-4 col-lg-3 coinCard");
            let coinInfo = $("<div>");
            coinInfo.attr ("class", "coinInfo");
            let coinCheck = $("<div>");
            coinCheck.attr("class", "coinCheck");

            createCoinToggleCheckBox (coin, storedCoins, coinCheck);

            addCoinInformation (coinInfo, coin, container, coinCheck, coinCard);

            addMoreCoinInformation (coinInfo, coin);
    });

}

function createCoinToggleCheckBox (coin, storedCoins, coinCheck) { // Creates the toggle button.

    let labelCheckBox = $("<label>")
    labelCheckBox.attr("class", "switchBox");
    let checkBox = $("<input>");
    checkBox.attr("type", "checkbox");
    checkBox.attr("id", coin.symbol);
    if (storedCoins.length > 0) {
        for (let j = 0; j < storedCoins.length; j++) {
                if ((storedCoins[j]).symbol == coin.symbol) {
                    checkBox.prop("checked", true);
            }
        }       
    }
    let spanCheckBox = $("<span>");
    spanCheckBox.attr("class", "check");
    let buttonCheckBox = $("<span>");
    buttonCheckBox.attr("class", "btn");
    labelCheckBox.append(checkBox);
    labelCheckBox.append(spanCheckBox);
    labelCheckBox.append(buttonCheckBox);
    checkBox.change (function() {
        if (checkBox.prop("checked") == true) {
            if (storedCoins.length < 5) {
                pushCoinIntoArray (coin, storedCoins);
            }
            else {
                    tooManyPickedCoinsModal(coin, storedCoins);
                    updateModal(coin, storedCoins);
                    $('#tooManyCoins').modal({
                        backdrop: 'static',
                        keyboard: false
                    })
            }
        }
        else {
            storedCoins = removePreviouslyPickedCoin (coin, storedCoins);
        }
    })
    coinCheck.append(labelCheckBox);
}

function addCoinInformation (coinInfo, coin, container, coinCheck, coinCard) { // Adds the information to the coin card.
    let coinHeader = $("<div>");
    coinHeader.attr("class", "coinHeader");
    coinHeader.html(coin.symbol);
    coinHeader.append(coinCheck);
    coinInfo.append(coinHeader);
    coinInfo.append("<br>");
    coinInfo.append(coin.name);
    coinInfo.append("<br>");
    coinCard.append(coinInfo);
    container.append(coinCard);
}

function addMoreCoinInformation (coinInfo, coin) { // Creates the button with the toggle option for additional information.
    let moreInfoDetails = $("<div>");
    moreInfoDetails.attr("class", "moreInfo");
    let moreInfo = $("<button>");
    moreInfo.attr("class", "btn btn-dark");
    moreInfo.html("More Info");
    moreInfo.click(function() {
        if (sessionStorage.getItem("" + coin.symbol) == null)
        {
            loadingAnimation(coinInfo);
            getMoreDetails(coin.id).then(function(
            ) {
                coinInfo.find(".loader").remove();
                displayMoreInfo(moreInfoDetails, coin);
            });
        }
        else {
            displayMoreInfo(moreInfoDetails, coin);
        }
        });
        coinInfo.append("<br>");
    coinInfo.append(moreInfo);
    coinInfo.append(moreInfoDetails);

}

function displayMoreInfo (moreInfoDetails, coin){ // Displays more information after getting it from the API.
    moreInfoDetails.empty();
    let moreInfoData = JSON.parse(sessionStorage.getItem("" + coin.symbol));
    let coinImg = $("<img>");
    coinImg.attr ("src", moreInfoData[0]);
    moreInfoDetails.append("<br>"); 
    moreInfoDetails.append(coinImg);
    moreInfoDetails.append("<br>");
    moreInfoDetails.append(moreInfoData[1] + "&dollar;");
    moreInfoDetails.append("<br>");
    moreInfoDetails.append(moreInfoData[2] + "&euro;");
    moreInfoDetails.append("<br>");
    moreInfoDetails.append(moreInfoData[3] + "&#8362;");
    moreInfoDetails.collapse("toggle");
}

function pushCoinIntoArray (coin, storedCoins) { // Pushes a picked coin into an array - a form of cache.
    let counter = sessionStorage.getItem("counter");
    let pickedCoin = {
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        identification : counter,
    }
    storedCoins.push(pickedCoin);
    console.log(JSON.stringify(storedCoins));
    counter++;
    sessionStorage.setItem("counter", counter);
}

function removePreviouslyPickedCoin (coin, storedCoins) { // Removes a previously picked coin if the user decided to remove it, either through the modal or regularly.
    let id;
    for (let i = 0; i < storedCoins.length; i++) {  
        if (coin.id == storedCoins[i].id) {
            id = i;
        }
    }
    if (id != null)
    {
        storedCoins.splice ($.inArray(storedCoins[id], storedCoins), 1);
    }

    console.log (JSON.stringify(storedCoins));
    return storedCoins;
}

function tooManyPickedCoinsModal (coin) { // Modal opens once a user picked more than 5 coins.

    let modalFade = $("<div>");
    modalFade.attr("class", "modal fade modalAttributes");
    modalFade.attr("id", "tooManyCoins");

    let modalDialog = $("<div>");
    modalDialog.attr("class", "modal-dialog");

    modalFade.append(modalDialog);

    let modalContent = $("<div>");
    modalContent.attr("class", "modal-content");
    
    modalDialog.append(modalContent);

    let modalHeader = $("<div>");
    modalHeader.attr("class", "modal-header modalCoins modal-bg");

    modalContent.append(modalHeader);

    let modalTitle = $("<h5>");
    modalTitle.attr("class", "modal-title modalCoins");
    modalTitle.attr("id", "exampleModalLabel");
    modalTitle.html("Pick a coin you'd like to remove");

    let closeButton = $("<button>");
    closeButton.attr("class", "close closingModal");
    closeButton.attr("data-dismiss", "modal");
    closeButton.click (function () {
        $("#" + coin.symbol).prop("checked", false);
    })

    modalHeader.append(modalTitle);
    modalHeader.append(closeButton);

    let closeIcon = $("<span>");
    closeIcon.attr("aria-hidden", "true");
    closeIcon.html("&times;");

    closeButton.append(closeIcon);

    let modalBody = $("<div>");
    modalBody.attr("class", "modal-body modalCoins modal-bg");

    modalContent.append(modalBody);

    let modalFooter = $("<div>");
    modalFooter.attr("class", "modal-footer modal-bg");

    modalContent.append(modalFooter);

    $("#form").append(modalFade);
}

function updateModal (coin, storedCoins) { // Updates the modal constantly with each use, according to the picked coins stored in the cache array.

    sessionStorage.setItem("isCoinGoingToBeRemoved", "false");

    $(".modal-body").empty();
    $(".modal-footer").empty();

    $(".modal-body").html("Newly picked coin: <br>");
    let sixthCoin = true;

    createCoinCardForModal(coin, sixthCoin, storedCoins);

    $(".modal-body").append("<br>Already picked coins:<br>"); 

    sixthCoin = false;
    for (let i = 0; i < storedCoins.length; i++)
    {
        createCoinCardForModal(storedCoins[i], sixthCoin, storedCoins);
    }

    modalCancelButton(coin);

    modalSaveButton(storedCoins, coin);

}

function modalCancelButton (coin) { // Creates the modal cancel button.
    let cancelButton = $("<button>");
    cancelButton.attr("class", "btn btn-secondary closingModal");
    cancelButton.attr("data-dismiss", "modal");
    cancelButton.html("Cancel");
    cancelButton.click (function () {
        $("#" + coin.symbol).prop("checked", false);
    })

    $(".modal-footer").append(cancelButton);
}

function modalSaveButton (storedCoins, coin) { // Creates the modal save button.
    let saveButton = $("<button>");
    saveButton.attr("class", "btn btn-dark saveChanges");
    saveButton.html("Save changes");
    saveButton.click (function () {
        if (sessionStorage.getItem("isCoinGoingToBeRemoved") == "true") {
            let coinsChangedAfterModal = storedCoins;
            for (let i = storedCoins.length -1; i >= 0; i--) {
                if ($("#" + storedCoins[i].identification).prop("checked") == false) {
                        $("#" + storedCoins[i].symbol).prop("checked", false);
                        coinsChangedAfterModal = removePreviouslyPickedCoin(storedCoins[i], storedCoins);
                    }
                    storedCoins = coinsChangedAfterModal;
                }
    
            if (storedCoins.length < 5) {
                pushCoinIntoArray(coin, storedCoins);
            }    
        }
        else {
            alert ("Please pick a coin first or press on the cancel button");
        }
    })

    $(".modal-footer").append(saveButton);
}

function createCoinCardForModal (coin, sixthCoin, storedCoins) { // Prints the coin cards in the modal.

    let pickedCoin = $("<div>");
        pickedCoin.attr ("class", "col-xl-12 card coinCard coinInfoModal");
        let coinInfoModal = $("<div>");
        coinInfoModal.attr ("class", "card-body");

        let coinHeaderModal = $("<div>");
        coinHeaderModal.html (coin.name);

        let labelCheckBoxModal = $("<label>");
        labelCheckBoxModal.attr("class", "switchBox");
        let checkBoxModal = $("<input>");
        checkBoxModal.attr("class", "checkbox checkBox checkBoxModal");
        checkBoxModal.attr("type", "checkbox");
        checkBoxModal.prop("checked", true);
        if (sixthCoin) {
            checkBoxModal.attr("disabled", true);
        }
        else {
            checkBoxModal.attr("id", coin.identification);
        }
        
        checkBoxModal.change (function() {
            disableOtherOptions(checkBoxModal, storedCoins);
        }); 

        let spanCheckBoxModal = $("<span>");
        spanCheckBoxModal.attr("class", "check");
        let buttonCheckBoxModal = $("<span>");
        buttonCheckBoxModal.attr("class", "btn");

        labelCheckBoxModal.append(checkBoxModal);
        labelCheckBoxModal.append(spanCheckBoxModal);
        labelCheckBoxModal.append(buttonCheckBoxModal);
            
        let newCoinCheckModal = $("<div>");
        newCoinCheckModal.attr("class", "coinCheck");
        newCoinCheckModal.append(labelCheckBoxModal);

        coinInfoModal.append(newCoinCheckModal);
        coinInfoModal.append(coinHeaderModal);

        pickedCoin.append(coinInfoModal);

        $(".modal-body").append(pickedCoin);
}

function disableOtherOptions(checkBoxModal, storedCoins) { // Disables other options in the modal once one of the coins is picked. Reverses the disable option if a user re-clicks the already picked coin.
    if (checkBoxModal.click()) {
        if (checkBoxModal.prop("checked") == false) {
            sessionStorage.setItem("isCoinGoingToBeRemoved", "true");
            for (let i = 0; i < storedCoins.length; i++) {
                if ($("#" + storedCoins[i].identification).prop("checked") == true) {
                    $("#" + storedCoins[i].identification).attr("disabled", true);
                }
            }
            $(".saveChanges").attr("data-dismiss", "modal");

        }
        else {
            sessionStorage.setItem("isCoinGoingToBeRemoved", "false");
            for (let i = 0; i < storedCoins.length; i++) {
                if ($("#" + storedCoins[i].identification).prop("checked") == true) {
                    $("#" + storedCoins[i].identification).attr("disabled", false);
                }
            }
            $(".saveChanges").removeAttr("data-dismiss");
        }
    };

}

function drawGraph (getAllCoinValues, upperCaseSymbols){ // Creates all the required graph elemenets.
    
    sessionStorage.setItem("firstChartAjax", "true");

    let chartContainer = $("<div>");
    chartContainer.attr("id", "chartContainer");
    chartContainer.attr("class", "coinGraph");

    let graphTitle = "";

    for (let i = 0; i < upperCaseSymbols.length; i++) {
        graphTitle = graphTitle + upperCaseSymbols[i];
        if (i < upperCaseSymbols.length-1){
            graphTitle = graphTitle + ",";
        }
    }

    let coinNames = graphTitle + ",";

    let dataPoints = [];

    if (dataPoints.length == 0) {
        for (let i = 0; i < upperCaseSymbols.length; i++) {
            dataPoints.push([]);
        }
    }


    let data = [];
    
    if (data.length == 0) {
        for (let i = 0 ; i < upperCaseSymbols.length; i++){
            let coinGraph = {
                        type: "spline",
                        name: upperCaseSymbols[i],
                        showInLegend: true,
                        dataPoints: dataPoints[i],
    
            }
    
            data.push(coinGraph);
        }
    }
    
    let options = {
        exportEnabled: true,
        animationEnabled: true,
        title:{
            text: graphTitle + " to USD"
        },
        subtitles: [{
            text: "Click Legend to Hide or Unhide Data Series"
        }],
        axisX: {
            title: "Current time",
            labelFormatter: function (e) {
                return CanvasJS.formatDate (e.value, "mm:ss");
            }
        },
        axisY: {
            title: "Coin Value",
            titleFontColor: "#4F81BC",
            lineColor: "#4F81BC",
            labelFontColor: "#4F81BC",
            tickColor: "#4F81BC",
            includeZero: false,
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries
        },
        data: data
    };

    (chartContainer).CanvasJSChart(options);

    updateData(coinNames, upperCaseSymbols, dataPoints, getAllCoinValues, chartContainer);

    let chartInterval = setInterval(function () { updateData(coinNames, upperCaseSymbols, dataPoints, getAllCoinValues, chartContainer); }, 2000);

    $(".showHome").click(function() {
        clearInterval(chartInterval);
    });
    $(".showLiveReports").click(function() {
        clearInterval(chartInterval);
    });
    $(".showAbout").click(function() {
        clearInterval(chartInterval);
    });
    $(".showSearch").click(function() {
        clearInterval(chartInterval);
    });
}


function updateData(coinNames, upperCaseSymbols, dataPoints, getAllCoinValues, chartContainer) { // Updates the graph with ajax calls to the second API. An interval asks for an Ajax call every 2 seconds.
    if (!$.active){
       $.getJSON("https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + coinNames + "&tsyms=USD", function (data) {
           addData(data, upperCaseSymbols, dataPoints, getAllCoinValues, chartContainer);
        });
    }   
} 

function addData(data, upperCaseSymbols, dataPoints, getAllCoinValues, chartContainer) { // Adds the data to the graph once data is received from the API.

    for (let i = 0; i < upperCaseSymbols.length; i++) {
        dataPoints[i].push ({
            x: new Date (),
            y: (eval(getAllCoinValues[i]))
        })


        if (dataPoints[i].length > 10) {
            dataPoints[i].shift();
        }

    }
    if (sessionStorage.getItem("firstChartAjax") == "true") {
        $(".coinContainer").empty();
        $(".coinContainer").append(chartContainer);    
        $("#chartContainer").CanvasJSChart().render(); 
        sessionStorage.setItem("firstChartAjax", "false"); 
    }
    else {
        $("#chartContainer").CanvasJSChart().render();  
    }
    
}



function toggleDataSeries(e) { // The ability to remove and re-add coin graphs on click on the graph itself.
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
    } else {
        e.dataSeries.visible = true;
    }
    e.chart.render();
}

function printAbout(container) { // The about function.
    container.empty();

    let aboutDiv = $("<div>");
    aboutDiv.attr("class", "aboutDiv");
    aboutDiv.html("Hello, my name is Guy Rozen and I am currently a student at JB. <br> This is my Jquery project, hope you like it. <br>");
    container.append(aboutDiv);
}


// The second API is kind of problematic, in order to approach its data it requires every time to go through "data.(coin symbol in capslock).USD". 
// In order to make the process automatic, I created a couple of for loops and arrays, in order to create an array of strings, and use the eval function
// in order to appraoch the API accordingly in a dynamic way.
// Just leaving it here incase its not clear why did I create certain arrays.
// Also, as I was asked to rework the entire code and split it into shorter functions, I didn't really pay too much attention to the "About" section.
// As it has nothing to do with actual programming, I hope that the fact I didn't have time to "renovate" it a little and make it more eye-pleasing wouldn't harm this project's final grade.