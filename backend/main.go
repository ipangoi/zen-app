package main

import (
	"os"
	"zen/internal/database"
	"zen/internal/router"
)

func main() {
	database.StartDB()
	r := router.StartApp()
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}
