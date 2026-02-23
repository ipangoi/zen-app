package router

import (
	"os"
	"time"
	"zen/internal/handler"
	"zen/internal/middleware"
	"zen/internal/repository"
	"zen/internal/service"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func StartApp() *gin.Engine {
	r := gin.Default()

	//cors setup

	frontendURL := os.Getenv("FRONTEND_URL")
	allowedOrigins := []string{"http://localhost:5173"}
	if frontendURL != "" {
		allowedOrigins = append(allowedOrigins, frontendURL)
	}
	r.Use(cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	//init user
	userRepository := repository.NewUserRepositoryImpl()
	userService := service.NewUserServiceImpl(userRepository)
	userHandler := handler.NewUserHandlerImpl(userService)

	//init task
	taskRepo := repository.NewTaskRepositoryImpl()
	taskService := service.NewTaskServiceImpl(taskRepo)
	taskHandler := handler.NewTaskHandlerImpl(taskService)

	//init session
	sessionRepo := repository.NewSessionRepositoryImpl()
	sessionService := service.NewSessionServiceImpl(sessionRepo, taskRepo)
	sessionHandler := handler.NewSessionHandlerImpl(sessionService)

	//user
	userRouter := r.Group("/user")
	{
		userRouter.POST("/register", userHandler.UserRegister)
		userRouter.POST("/login", userHandler.UserLogin)

		userRouter.GET("/profile", middleware.Authentication(), userHandler.UserProfile)

		userRouter.PUT("/profile", middleware.Authentication(), userHandler.UserUpdate)
	}

	//task
	taskRouter := r.Group("/tasks")
	taskRouter.Use(middleware.Authentication())
	{
		taskRouter.POST("", taskHandler.CreateTask)
		taskRouter.GET("", taskHandler.GetAllTask)
		taskRouter.GET("/:id", taskHandler.GetTask)
		taskRouter.PUT("/:id", taskHandler.UpdateTask)
		taskRouter.DELETE("/:id", taskHandler.DeleteTask)

		taskRouter.GET("/:id/sessions", sessionHandler.GetSessionByTask)
	}

	//session
	sessionRouter := r.Group("/session")
	sessionRouter.Use(middleware.Authentication())
	{
		sessionRouter.POST("", sessionHandler.CreateSession)
		sessionRouter.GET("", sessionHandler.GetAllSession)
		sessionRouter.GET("/:id", sessionHandler.GetSession)
		sessionRouter.PUT("/:id", sessionHandler.UpdateSession)
		sessionRouter.DELETE("/:id", sessionHandler.DeleteSession)
	}

	return r
}
