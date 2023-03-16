    var today = $("#today")
    var forecast = $("#forecast")
    var searchField = $("#search-input")
    var searchButton = $("#search-button")
    var historyArea = $(".list-group")
    var newDiv = $("<div>");
    newDiv.addClass("")
    var Container = $(".form-inline")
    Container.append(newDiv);
    var lon = 0;
    var lat = 0;
    var apiKey = "11c698b900bcca165ef3054ac3254c35";
    var storedCity = [];
    

searchButton.on("click", function(e){
    e.preventDefault()
    
    city = searchField.val()
    
    console.log(city)

    ShowWeatherForecast(city)
})

historyArea.on("click", function(e){

    e.preventDefault()

    city = $(e.target).text()

    console.log($(e.target).text())

    ShowWeatherForecast(city)
})

function Displayhistory() { 

    historyArea.empty()

    var listgroupEL = $("<ul>").addClass("list-group")

    var city = JSON.parse(localStorage.getItem("city")) || [];
    
    for(let prevCity of city ){

    var historyDiv = $("<li>").addClass("list-group-item m-2")

    var historytext = $("<p>").text(prevCity)

    console.log(city)

    console.log(city)

    historyDiv.append(historytext)

    listgroupEL.append(historyDiv)

    historyArea.append(listgroupEL)

}

}

function ShowWeatherForecast(city){

    var apiURL2 = "https://api.openweathermap.org/geo/1.0/direct?q="+ city +"&limit=1&appid="+ apiKey;

    $.ajax({
        url: apiURL2,
        method: "GET"

    }).then(function(result){

        console.log(result)

        if(JSON.parse(localStorage.getItem("city"))){

            storedCity = JSON.parse(localStorage.getItem("city")) || [];

            storedCity.unshift(result[0].name)

            if(storedCity.length > 5){

                storedCity.splice(-1)
            }

            console.log(storedCity)

            localStorage.setItem("city", JSON.stringify(storedCity))
            
        }
        
        else{

            storedCity.unshift(result[0].name)

            
            if(storedCity.length > 5){
                
                storedCity.splice(-1)
            }

            console.log(storedCity)

            localStorage.setItem("city", JSON.stringify(storedCity))

        }
            
        lat = result[0].lat;
        lon = result[0].lon

        var apiURL ="https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;

        $.ajax({
            url: apiURL,
            method: "GET"
        }).then(function (result) {
            console.log(result)
            today.empty();
            forecast.empty();
            var todayDiv = $("<div>").addClass("card border-dark p-3")
            //console.log(result[0].dt_txt)
            var todaydate = moment(result.list[0].dt_txt).format("DD/MM/YYYY")
            var name = $("<h3>").addClass("card-title").text(result.city.name + " (" + todaydate + ")")
            var weathericon = $("<img>").attr("src", "http://openweathermap.org/img/w/" + result.list[0].weather[0].icon + ".png")
            name.append(weathericon)
            var temperature = $("<p>").text("Temperature: " + Math.round((result.list[0].main.temp-273)* 10)/ 10 +"°C")
            var wind = $("<p>").text("Wind: " + result.list[0].wind.speed + " KPH")
            var humidity = $("<p>").text("Humidity: " + result.list[0].main.humidity + "%")
            todayDiv.append(name, temperature, wind, humidity);
            today.append(todayDiv);

            var forecastheader = $("<h3>").text(" 5 Day Forecast:").addClass("w-100")

            forecast.append(forecastheader)

            for (let i = 0; i < 40; i++){

                i += 6;
                var forecastDiv = $("<div>").addClass("card text-white bg-dark m-2 p-3")
                var date = $("<h5>").text(moment(result.list[i].dt_txt).format("DD/MM/YYYY"))
                var weathericon = $("<img>").attr("src", "http://openweathermap.org/img/w/" + result.list[i].weather[0].icon + ".png")
                var temperature = $("<p>").text("Temperature: " + Math.round((result.list[i].main.temp-273)* 10)/ 10 +"°C")
                var wind = $("<p>").text("Wind: " + result.list[i].wind.speed + " KPH")
                var humidity = $("<p>").text("Humidity: " + result.list[i].main.humidity + "%")

                forecastDiv.append(date, weathericon, temperature, wind, humidity)


                forecast.append(forecastDiv)
            }


        

        })

        Displayhistory();
    
    })

    


}
