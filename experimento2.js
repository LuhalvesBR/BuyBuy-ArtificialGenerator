module.exports = function(app){

    app.get("/experimento2/:id/:noise", function(req, res){
        var id = parseInt(req.params.id);
        var noise = parseInt(req.params.noise);

        var randomQuantityProductBuy = function(currentDay, daysInterval){
            var seed;
            if(Number.isInteger(currentDay/daysInterval)){
                seed = gaussian(15, noise);
                //seed = Math.floor((Math.random() * 10) + 1);
            } else{
                seed = 0;
            }
            return seed;
        }
        //usar um vetor de 0 a 100 para colocar porcentagem de todos valores da gaussiana

        var gaussian = function (peakValue, sigma){
            var maximum = {};
            var minimum = {};
            var peak = {};

            peak.value = peakValue;
            maximum.value = peak.value + (parseInt(3 * sigma));
            minimum.value = peak.value - (parseInt(3 * sigma));
            
            if(minimum.value < 0 )
                minimum.value == 0;
            
            //distributing the percentage roulette
            var percentages = [];
            for(var i=maximum.value; i>=peak.value; i--){
                percentages.unshift(Math.pow(i,25));
            }
 
            peak.percentage = maximum.value;
            var ggEasy = 0;
            var ggEasy1 = 0;
            var allValues = [];


            for(var i = minimum.value; i <= peak.value; i++){
                var teste = {
                    "value": i,
                    "percentage": percentages[ggEasy]
                }
                ggEasy++;
                allValues.push(teste)
            }
            
            for(var i = maximum.value; i > peak.value; i--){
                var teste = {
                    "value": i,
                    "percentage": percentages[ggEasy1]
                }
                ggEasy1++;
                allValues.push(teste)
            }


            var normalizationFactor = 0;
            
            for(var pos in allValues){
                normalizationFactor = normalizationFactor + allValues[pos].percentage;
            }

            normalizationFactor = 1 / normalizationFactor;

            for(var pos in allValues){
                allValues[pos].percentage = normalizationFactor * allValues[pos].percentage;
            }
            
            var sortVector = [];
            for(var pos in allValues){
                for(var i=0; i<=(allValues[pos].percentage * 100); i++){
                    sortVector.push(allValues[pos].value)
                }
            }
            //PRINTAR A PORCENTAGEM E VALOR DA GAUSSIANA
            //res.json(allValues);
            
            
            //res.json(sortVector);
            return sortVector[ Math.floor((Math.random() * 100)) ]

        }

        var shopping = { buy: [] }
        ,  collection = DATABASE.collection("shopping")
        ,  seed
        , unitBuy
        , product = {};

        for(var day = 1; day < 91; day++){
            //for(var buy = 0; buy <= 30; buy++){

                seed = randomQuantityProductBuy(day, app.products.stock[id].daysIntervalNearly)    
                
                product.produto_id = app.products.stock[id].id;
                product.produto_name = app.products.stock[id].name;

                unitBuy = {
                    "consumidor": app.costumers.base[0].id,
                    "produto_id": app.products.stock[id].id,
                    "quantidade": seed,
                    "data_lista": moment().subtract(day, 'days').format("YYYY-MM-DD")
                }

                shopping.buy.push(unitBuy);    
                //collection.insert(unitBuy, function(err, result){});
            //}
        }
        res.json(shopping);

    });
}   