package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/satori/go.uuid"

	"crypto/md5"
	"encoding/hex"

	gocb "gopkg.in/couchbase/gocb.v1"
)

var bucket *gocb.Bucket

//OrderStatus (Enums in Go) https://andrey.nering.com.br/2016/constants-and-enums-in-go-lang/
type OrderStatus string

var (
	PLACED    OrderStatus = "PLACED"
	PAID      OrderStatus = "PAID"
	PREPARING OrderStatus = "PREPARING"
	SERVED    OrderStatus = "SERVED"
	COLLECTED OrderStatus = "COLLECTED"
)

type OrderItems []struct {
	Quantity int    `json:"qty,omitempty"`
	Name     string `json:"name,omitempty"`
	Milk     string `json:"milk,omitempty"`
	Size     string `json:"size,omitempty"`
}

type Links struct {
	Payment string `json:"payment,omitempty"`
	Order   string `json:"order,omitempty"`
}

type Order struct {
	ID       string       `json:"id,omitempty"`
	Location string       `json:"location,omitempty"`
	Items    *OrderItems  `json:"items,omitempty"`
	Status   *OrderStatus `json:"status,omitempty"`
	Links    *Links       `json:"links,omitempty"`
	Message  string       `json:"message,omitempty"`
}

type OrderRow struct {
	Order Order `json:"ordr"`
}

type HttpError struct {
	Status  string `json:"status,omitempty"`
	Message string `json:"message,omitempty"`
}

// https://github.com/satori/go.uuid
func GenerateUUID() string {
	return uuid.NewV4().String()
}

func GetLocalIP() string {
	ifaces, err := net.Interfaces()
	if err != nil {
		return ""
	}
	for _, iface := range ifaces {
		if iface.Flags&net.FlagUp == 0 {
			continue // interface down
		}
		if iface.Flags&net.FlagLoopback != 0 {
			continue // loopback interface
		}
		addrs, err := iface.Addrs()
		if err != nil {
			return ""
		}
		for _, addr := range addrs {
			var ip net.IP
			switch v := addr.(type) {
			case *net.IPNet:
				ip = v.IP
			case *net.IPAddr:
				ip = v.IP
			}
			if ip == nil || ip.IsLoopback() {
				continue
			}
			ip = ip.To4()
			if ip == nil {
				continue // not an ipv4 address
			}
			return ip.String()
		}
	}
	return ""
}

func GetMD5Hash(text string) string {
	hasher := md5.New()
	hasher.Write([]byte(text))
	return hex.EncodeToString(hasher.Sum(nil))
}

func GetOrdersEndpoint(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	var orders []Order
	query := gocb.NewN1qlQuery("SELECT * FROM starbucks AS ordr")
	if bucket == nil {
		w.WriteHeader(http.StatusInternalServerError)
		httpError := HttpError{Status: "error", Message: "Server Error, Try Again Later."}
		json.NewEncoder(w).Encode(httpError)
		return
	}
	rows, err := bucket.ExecuteN1qlQuery(query, nil)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		httpError := HttpError{Status: "error", Message: "Server Error, Try Again Later."}
		json.NewEncoder(w).Encode(httpError)
		return
	}

	var row OrderRow
	for rows.Next(&row) {
		orders = append(orders, row.Order)
		row = OrderRow{}
	}
	json.NewEncoder(w).Encode(orders)

}

func GetOrderEndpoint(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	var n1qlParams []interface{}
	query := gocb.NewN1qlQuery("SELECT * FROM starbucks AS ordr WHERE META(ordr).id = $1")
	params := mux.Vars(req)
	n1qlParams = append(n1qlParams, params["id"])
	if bucket == nil {
		w.WriteHeader(http.StatusInternalServerError)
		httpError := HttpError{Status: "error", Message: "Server Error, Try Again Later."}
		json.NewEncoder(w).Encode(httpError)
		return
	}
	rows, err := bucket.ExecuteN1qlQuery(query, n1qlParams)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		httpError := HttpError{Status: "error", Message: "Server Error, Try Again Later."}
		json.NewEncoder(w).Encode(httpError)
		return
	}
	var orderRow OrderRow
	rows.One(&orderRow)
	if orderRow.Order.ID != "" {
		json.NewEncoder(w).Encode(orderRow.Order)
		return
	}

	w.WriteHeader(http.StatusNotFound)
	httpError := HttpError{Status: "error", Message: "Order not found."}
	json.NewEncoder(w).Encode(httpError)
}

func PlaceOrderEndpoint(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	var order Order
	_ = json.NewDecoder(req.Body).Decode(&order)
	UUID := GenerateUUID()
	URI := "http://" + GetLocalIP() + ":9090/v3/starbucks/order/" + UUID
	order.ID = UUID
	order.Links = &Links{Payment: URI + "/pay", Order: URI}
	order.Status = &PLACED
	order.Message = "Order has been placed."
	orderJSON, err := json.Marshal(order)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		httpError := HttpError{Status: "error", Message: "Server Error, Try Again Later."}
		json.NewEncoder(w).Encode(httpError)
		return
	}

	w.Header().Set("ETag", GetMD5Hash(string(orderJSON)))
	_, err = bucket.Insert(UUID, string(orderJSON), 0)
	if err != nil {
		fmt.Println("ERRROR CREATING DOCUMENT:", err)
	}
	json.NewEncoder(w).Encode(order)
}

func UpdateOrderEndpoint(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	var n1qlParams []interface{}
	query := gocb.NewN1qlQuery("SELECT * FROM starbucks AS ordr WHERE META(ordr).id = $1")
	params := mux.Vars(req)
	n1qlParams = append(n1qlParams, params["id"])
	rows, _ := bucket.ExecuteN1qlQuery(query, n1qlParams)
	var orderRow OrderRow
	rows.One(&orderRow)
	if orderRow.Order.ID != "" {
		if *orderRow.Order.Status == PLACED {
			var newOrder Order
			_ = json.NewDecoder(req.Body).Decode(&newOrder)
			newOrder.ID = orderRow.Order.ID
			URI := "http://" + GetLocalIP() + ":9090/v3/starbucks/order/" + newOrder.ID
			newOrder.Links = &Links{Payment: URI + "/pay", Order: URI}
			newOrder.Status = &PLACED
			newOrder.Message = "Order has been placed."
			newOrderJSON, err := json.Marshal(newOrder)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				httpError := HttpError{Status: "error", Message: "Server Error, Try Again Later."}
				json.NewEncoder(w).Encode(httpError)
				return
			}
			w.Header().Set("ETag", GetMD5Hash(string(newOrderJSON)))
			_, err = bucket.Replace(newOrder.ID, string(newOrderJSON), 0, 0)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				httpError := HttpError{Status: "error", Message: "Server Error, Try Again Later."}
				json.NewEncoder(w).Encode(httpError)
				return
			}
			json.NewEncoder(w).Encode(newOrder)
		} else {
			w.WriteHeader(http.StatusPreconditionFailed)
			httpError := HttpError{Status: "error", Message: "Order Update Rejected."}
			json.NewEncoder(w).Encode(httpError)
		}
	} else {
		w.WriteHeader(http.StatusNotFound)
		httpError := HttpError{Status: "error", Message: "Order not found."}
		json.NewEncoder(w).Encode(httpError)
	}
}

func CancelOrderEndpoint(w http.ResponseWriter, req *http.Request) {
	var n1qlParams []interface{}
	query := gocb.NewN1qlQuery("SELECT * FROM starbucks AS ordr WHERE META(ordr).id = $1")
	params := mux.Vars(req)
	n1qlParams = append(n1qlParams, params["id"])
	rows, _ := bucket.ExecuteN1qlQuery(query, n1qlParams)
	var orderRow OrderRow
	rows.One(&orderRow)
	if orderRow.Order.ID != "" {
		if *orderRow.Order.Status == PLACED {
			var n1qlParams []interface{}
			query := gocb.NewN1qlQuery("DELETE FROM starbucks WHERE META(starbucks).id=$1")
			params := mux.Vars(req)
			n1qlParams = append(n1qlParams, params["id"])
			_, err := bucket.ExecuteN1qlQuery(query, n1qlParams)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				httpError := HttpError{Status: "error", Message: "Server Error, Try Again Later."}
				json.NewEncoder(w).Encode(httpError)
				return
			}
			json.NewEncoder(w).Encode(&Order{})
		} else {
			w.WriteHeader(http.StatusPreconditionFailed)
			httpError := HttpError{Status: "error", Message: "Order Cancelling Rejected."}
			json.NewEncoder(w).Encode(httpError)
		}

	} else {
		w.WriteHeader(http.StatusNotFound)
		httpError := HttpError{Status: "error", Message: "Order not found."}
		json.NewEncoder(w).Encode(httpError)
	}
}


func OrderPaymentEndpoint(w http.ResponseWriter, req *http.Request) {
	var n1qlParams []interface{}
	query := gocb.NewN1qlQuery("SELECT * FROM starbucks AS ordr WHERE META(ordr).id = $1")
	params := mux.Vars(req)
	n1qlParams = append(n1qlParams, params["id"])
	rows, _ := bucket.ExecuteN1qlQuery(query, n1qlParams)
	var orderRow OrderRow
	rows.One(&orderRow)
	if orderRow.Order.ID != "" {
		if *orderRow.Order.Status == PLACED {
			URI := "http://" + GetLocalIP() + ":9090/v3/starbucks/order/" + orderRow.Order.ID
			orderRow.Order.Links = &Links{Order: URI}
			orderRow.Order.Status = &PAID
			orderRow.Order.Message = "Payment Accepted." 
			orderJSON, err := json.Marshal(orderRow.Order)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				httpError := HttpError{Status: "error", Message: "Server Error, Try Again Later."}
				json.NewEncoder(w).Encode(httpError)
				return
			}
			w.Header().Set("ETag", GetMD5Hash(string(orderJSON)))
			_, err = bucket.Replace(orderRow.Order.ID, string(orderJSON), 0, 0)
			if err != nil {
				fmt.Println("ERRROR UPDATING DOCUMENT:", err)
				w.WriteHeader(http.StatusInternalServerError)
				httpError := HttpError{Status: "error", Message: "Server Error, Try Again Later."}
				json.NewEncoder(w).Encode(httpError)
				return
			}
			json.NewEncoder(w).Encode(orderRow.Order)
		} else {
			w.WriteHeader(http.StatusPreconditionFailed)
			httpError := HttpError{Status: "error", Message: "Order Payment Rejected"}
			json.NewEncoder(w).Encode(httpError)
		}

	} else {
		w.WriteHeader(http.StatusNotFound)
		httpError := HttpError{Status: "error", Message: "Order not found."}
		json.NewEncoder(w).Encode(httpError)
	}
}

func main() {

	// Connect to Cluster
	cluster, err := gocb.Connect("couchbase://127.0.0.1")
	if err != nil {
		fmt.Println("ERRROR CONNECTING TO CLUSTER:", err)
	}
	// Open Bucket
	bucket, err = cluster.OpenBucket("starbucks", "")
	if err != nil {
		fmt.Println("ERRROR OPENING BUCKET:", err)
	}

	router := mux.NewRouter()
	router.HandleFunc("/v3/starbucks/orders", GetOrdersEndpoint).Methods("GET")
	router.HandleFunc("/v3/starbucks/order/{id}", GetOrderEndpoint).Methods("GET")
	router.HandleFunc("/v3/starbucks/order", PlaceOrderEndpoint).Methods("POST")
	router.HandleFunc("/v3/starbucks/order/{id}", UpdateOrderEndpoint).Methods("PUT")
	router.HandleFunc("/v3/starbucks/order/{id}", CancelOrderEndpoint).Methods("DELETE")
	router.HandleFunc("/v3/starbucks/order/{id}/pay", OrderPaymentEndpoint).Methods("POST")
	
	log.Fatal(http.ListenAndServe(":9090", router))

}
