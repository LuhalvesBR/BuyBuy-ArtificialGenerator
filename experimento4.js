module.exports = function(app){

    app.get("/experimento4/:id/:quantityNoise/:timeNoise/:intervalDay", function(req, res){
        var id = parseInt(req.params.id)
        , quantityNoise = parseFloat(req.params.quantityNoise)
        , timeNoise = parseFloat(req.params.timeNoise)
        , intervalDayReceived = parseFloat(req.params.intervalDay)
        , media = 50
        , Xvalues = []
        , Xtimes = []
        , vectorZAO = []
        , shopping = { buy: [] }
        , quantityOfBuy
        , unitBuy
        , product = {};
             
        var randomQuantityProductBuy = function(currentDay, daysInterval){
            var quantityOfBuy;
            
            for(var X=media-35; X != media+35   ; X++){
                normalDistribution(X, media, quantityNoise, 'quantity');                    
            }

            if(Number.isInteger(currentDay/daysInterval)){
                //quantityOfBuy = media;
                quantityOfBuy = sortValue(Xvalues);
            }
            else
                quantityOfBuy = 0;
            
            return quantityOfBuy;
        }

        var sortValue = function(probabilities){
            var sumPercentages = 0 ;

            if(!vectorZAO.length){
                for(pos in probabilities){                    
                    var spaceOnVector = probabilities[pos].percentage * 5000;
                    if(spaceOnVector > 1){
                        for(i = spaceOnVector; i >= 1; i--){
                            vectorZAO.push(probabilities[pos].value);
                        }
                    }
                }
            }
            
            return vectorZAO[ Math.floor(Math.random() * (vectorZAO.length) )];
        }

        var normalDistribution = function(X, media, sigma, experiment){
            if(X < 0) X = 0;
            
            //Gaussian count:
            var firstPart =  1 / (Math.pow (2 * Math.PI * (Math.pow(2, sigma)) , 1/2) );
            var potentiatesE = -( (Math.pow(( X - media ), 2)) / (2*(Math.pow(sigma, 2))) );
            var secondPart = Math.pow(Math.exp(1), potentiatesE);
            var result = firstPart * secondPart;
            
            if(experiment == 'quantity'){
                Xvalues.push( {"value": X, "percentage": result} );
            } else if (experiment == 'time'){
                Xtimes.push( {"value": X, "percentage": result} );
            }

            return result;
        };

        var neighborIndexSortedFunction = function(pos, mediaTeste, callback){

            var neighborIndexSorted = -1;
            var ending = function () {
                if(neighborIndexSorted < 0 || neighborIndexSorted > 363){
                    neighborIndexSorted = parseInt(pos) + (sortValue(Xtimes) - mediaTeste);
                    ending();
                } else {
                    callback(neighborIndexSorted);
                }
            };

            ending();
        };

        var shakeTime = function(){
            var mediaTeste = 50;
            vectorZAO = [];

            for(var X=mediaTeste-29; X != mediaTeste+30; X++){
                normalDistribution(X, mediaTeste, timeNoise, 'time');
            }
            var historySaved = shopping.buy;
            for(pos in historySaved){

                if(historySaved[pos].quantidade > 0){ //Troca só os dias de compras pra evitar swap.

                    neighborIndexSortedFunction(pos, mediaTeste, function (neighborIndexSorted) {
                        console.log(pos +' - ' + neighborIndexSorted);
                        var temp = shopping.buy[pos].quantidade;
                        shopping.buy[pos].quantidade = shopping.buy[neighborIndexSorted].quantidade;
                        shopping.buy[neighborIndexSorted].quantidade = temp;
                    });
                }

            }
        };
        for(var day = 1; day < 365; day++){
            quantityOfBuy = randomQuantityProductBuy(day, intervalDayReceived)

            unitBuy = {
                "consumidor": 1,
                "produto_id": app.products.stock[id].id,
                "quantidade": quantityOfBuy,
                "data_lista": moment().subtract(day, 'days').format("YYYY-MM-DD")
            }

            shopping.buy.push(unitBuy);    
        }
        
        shakeTime();
        res.json(shopping.buy);
    });
}   
