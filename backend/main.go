package main

import (
	"zen/internal/database"
	"zen/internal/router"
)

func main() {
	database.StartDB()
	r := router.StartApp()
	r.Run(":8080")
}
