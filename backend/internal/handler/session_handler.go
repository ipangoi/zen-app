package handler

import "github.com/gin-gonic/gin"

type SessionHandler interface {
	CreateSession(c *gin.Context)
	GetSessionByTask(c *gin.Context)
	GetAllSession(c *gin.Context)
	GetSession(c *gin.Context)
	UpdateSession(c *gin.Context)
	DeleteSession(c *gin.Context)
}
