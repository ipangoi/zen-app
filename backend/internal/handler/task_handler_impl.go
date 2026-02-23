package handler

import (
	"net/http"
	"strconv"
	"zen/internal/model"
	"zen/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type TaskHandlerImpl struct {
	taskService service.TaskService
}

func NewTaskHandlerImpl(service service.TaskService) TaskHandler {
	return &TaskHandlerImpl{
		taskService: service,
	}
}

// CreateTask implements [TaskHandler].
func (t *TaskHandlerImpl) CreateTask(c *gin.Context) {
	userData := c.MustGet("userData").(jwt.MapClaims)

	userID := uint(userData["id"].(float64))

	task := model.Task{}

	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid Format",
			"message": err.Error(),
		})
		return
	}

	task.UserID = userID

	err := t.taskService.CreateTask(&task)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Bad Request",
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"id":         task.ID,
		"title":      task.Title,
		"body":       task.Body,
		"status":     task.Status,
		"created_at": task.CreatedAt,
	})
}

// GetAllTask implements [TaskHandler].
func (t *TaskHandlerImpl) GetAllTask(c *gin.Context) {
	userData := c.MustGet("userData").(jwt.MapClaims)

	userID := uint(userData["id"].(float64))

	task, err := t.taskService.GetAllTask(userID)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Bad Request",
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"task": task,
	})
}

// GetTask implements [TaskHandler].
func (t *TaskHandlerImpl) GetTask(c *gin.Context) {
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

	task, err := t.taskService.GetTaskByID(taskID, userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Bad Request",
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":         task.ID,
		"title":      task.Title,
		"body":       task.Body,
		"status":     task.Status,
		"created_at": task.CreatedAt,
	})
}

// UpdateTask implements [TaskHandler].
func (t *TaskHandlerImpl) UpdateTask(c *gin.Context) {
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

	task := model.Task{}

	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid Format",
			"message": err.Error(),
		})
		return
	}

	task.ID = taskID

	err = t.taskService.UpdateTask(&task, userID)
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

// DeleteTask implements [TaskHandler].
func (t *TaskHandlerImpl) DeleteTask(c *gin.Context) {
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

	err = t.taskService.DeleteTask(taskID, userID)
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
