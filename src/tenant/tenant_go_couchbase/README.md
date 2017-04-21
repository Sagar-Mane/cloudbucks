# Starbucks

# Abstract
  - Create REST API to do order management
  - Setup up NoSQL DB cluster with replication factor of 2
  - Deploy the application to AWS VPC (public an private subnet)

# REST API
- CURD operations to get, place, update and cancel orders
  - ###### GET : http://<<HOST_IP>>:90/v3/starbucks/order/{order_id}
  - ###### POST : http://<<HOST_IP>>:90/v3/starbucks/order
  - ###### UPDATE : http://<<HOST_IP>>:90/v3/starbucks/order/{order_id}
  - ###### DELETE : http://<<HOST_IP>>:90/v3/starbucks/order/{order_id}
  - ###### GET : http://<<HOST_IP>>:90/v3/starbucks/orders
###### PS: Last resource will get the lsit of all the orders
    
# How to
     Prerequisites 
        - Go
        - Couchbase
        - Docker
- Build docker image:
    - By git clone: https://github.com/sjsu-sushant/starbucks
        ```sh
            $ docker build -t starbucks .
        ```
    ## OR
- Get Docker image from Docker hub
    - Docker login
        ```sh
            $ docker login
        ```
    - Pull image form Docker hub
        ```sh
            $ docker pull sushantsjsu\starbucks
        ```
    - For AWS
        ```sh
            $ docker build -t starbucks .
        ```
- Strart container
    - Local
        ```sh
         $ docker run --name starbucks -p 90:9090 -e DB_IP=<<DB host ip>> -e HOST_IP=127.0.0.1 -e STORE_NAME=store1 -td starbucks
        ```
    - AWS
        ```sh
         $ docker run --name starbucks -p 90:9090 -e DB_IP=<<couchbase host ip>> -e HOST_IP=<<AWS host ip>> -e STORE_NAME=store1 -td starbucks
        ```
