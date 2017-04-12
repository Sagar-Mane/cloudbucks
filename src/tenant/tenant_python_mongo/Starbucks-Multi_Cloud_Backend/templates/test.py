#collection.insert_one(order)    #inserting json object order
"""get_order=collection.find_one({"status":"Placed"})
print get_order['status']       #accessing key and values
get_order['status']="invalid"
collection.save(get_order)
print get_order['status']
collection.update({'_id':"58ea889c4399413f64282191"}, {"$set": get_order}, upsert=False)    #updating the order
"""
#pprint.pprint(collection.find_one({"status":"Placed"})) #Querying the order

