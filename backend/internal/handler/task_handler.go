package handler

import "github.com/gin-gonic/gin"

type TaskHandler interface {
	CreateTask(*gin.Context)
	GetAllTask(*gin.Context)
	GetTask(*gin.Context)
	UpdateTask(*gin.Context)
	DeleteTask(*gin.Context)
}
