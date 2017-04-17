FROM golang

ADD . /go/src/github.com/sjsu-sushant/starbucks/

RUN  go get "github.com/gorilla/mux"
RUN  go get "github.com/satori/go.uuid"
RUN  go get "gopkg.in/couchbase/gocb.v1"

RUN  go install github.com/sjsu-sushant/starbucks

ENTRYPOINT /go/bin/starbucks

EXPOSE 9090