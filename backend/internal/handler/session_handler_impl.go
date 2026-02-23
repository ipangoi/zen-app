package handler

import (
	"net/http"
	"strconv"
	"zen/internal/model"
	"zen/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type SessionHandlerImpl struct {
	sessionService service.SessionService
}

func NewSessionHandlerImpl(service service.SessionService) SessionHandler {
	return &SessionHandlerImpl{
		sessionService: service,
	}
}

// CreateSession implements [SessionHandler].
func (s *SessionHandlerImpl) CreateSession(c *gin.Context) {
	userData := c.MustGet("userData").(jwt.MapClaims)

	userID := uint(userData["id"].(float64))

	session := model.Session{}

	if err := c.ShouldBindJSON(&session); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid Format",
			"message": err.Error(),
		})
		return
	}

	session.UserID = userID

	err := s.sessionService.CreateSession(&session, userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Bad Request",
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"id":         session.ID,
		"start_time": session.StartTime,
		"created_at": session.CreatedAt,
	})
}

// GetSessionByTask implements [SessionHandler].
func (s *SessionHandlerImpl) GetSessionByTask(c *gin.Context) {
	userData := c.MustGet("userData").(jwt.MapClaims)

	userID := uint(userData["id"].(float64))

	taskIDStr := c.Param("id")

	taskIDInt, err := strconv.Atoi(taskIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid Format",
			"message": err.Error(),
		})
		return
	}

	taskID := uint(taskIDInt)

	session, err := s.sessionService.GetSessionsByTaskID(taskID, userID)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Bad Request",
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"session": session,
	})
}

// GetSessionByTask implements [SessionHandler].
func (s *SessionHandlerImpl) GetAllSession(c *gin.Context) {
	userData := c.MustGet("userData").(jwt.MapClaims)

	userID := uint(userData["id"].(float64))

	session, err := s.sessionService.GetAllSession(userID)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Bad Request",
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"session": session,
	})
}

// GetSession implements [SessionHandler].
func (s *SessionHandlerImpl) GetSession(c *gin.Context) {
	userData := c.MustGet("userData").(jwt.MapClaims)

	userID := uint(userData["id"].(float64))

	sessionIDStr := c.Param("id")

	sessionIDInt, err := strconv.Atoi(sessionIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid Format",
			"message": err.Error(),
		})
		return
	}

	sessionID := uint(sessionIDInt)

	session, err := s.sessionService.GetSessionByID(sessionID, userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Bad Request",
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":         session.ID,
		"user_id":    session.UserID,
		"task_id":    session.TaskID,
		"start_time": session.StartTime,
		"end_time":   session.EndTime,
		"duration":   session.Duration,
		"created_at": session.CreatedAt,
	})
}

// UpdateSession implements [SessionHandler].
func (s *SessionHandlerImpl) UpdateSession(c *gin.Context) {
	userData := c.MustGet("userData").(jwt.MapClaims)

	userID := uint(userData["id"].(float64))

	sessionIDStr := c.Param("id")

	sessionIDInt, err := strconv.Atoi(sessionIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid Format",
			"message": err.Error(),
		})
		return
	}

	sessionID := uint(sessionIDInt)

	session := model.Session{}

	if err := c.ShouldBindJSON(&session); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid Format",
			"message": err.Error(),
		})
		return
	}

	session.ID = sessionID

	err = s.sessionService.UpdateSession(&session, userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Bad Request",
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "updated",
	})
}

// DeleteSession implements [SessionHandler].
func (s *SessionHandlerImpl) DeleteSession(c *gin.Context) {
	userData := c.MustGet("userData").(jwt.MapClaims)

	userID := uint(userData["id"].(float64))

	sessionIDStr := c.Param("id")

	sessionIDInt, err := strconv.Atoi(sessionIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid Format",
			"message": err.Error(),
		})
		return
	}

	sessionID := uint(sessionIDInt)

	err = s.sessionService.DeleteSession(sessionID, userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Bad Request",
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "deleted",
	})
}
