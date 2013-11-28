var api = function(db){
    return function(req, res){
		var model = {
		    restaurant:{
				"GET": function(){
				    db.get('restaurant').findOne({},{}, function(e, doc){
				    	res.json(doc);
				    });
				},
				"POST": function(){
				    res.json({'testpost': '123'});
				},
				"InMap": function(){
					var restaurantInMap = db.get('restaurant').find({
						Lat:{
							$gt: req.body.sw.Lat,
							$lt: req.body.ne.Lat
						},
						Lng:{
							$gt: req.body.sw.Lng,
							$lt: req.body.ne.Lng
						}
					}, function(e, doc){
						res.json(doc);
					});
				}
		    }
		};

		if (req.params.act) {
			model[req.params.model][req.params.act]();
		}
		else{	
			model[req.params.model][req.method]();
		}
    };
};

module.exports.api = api;