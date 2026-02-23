package handler

import (
	"net/http"
	"zen/internal/model"
	"zen/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type UserHandlerImpl struct {
	userService service.UserService
}

func NewUserHandlerImpl(service service.UserService) UserHandler {
	return &UserHandlerImpl{
		userService: service,
	}
}

var (
	appJSON = "application/json"
)

// UserRegister implements [UserHandler].
func (h *UserHandlerImpl) UserRegister(c *gin.Context) {

	newUser := model.RegisterForm{}

	if err := c.ShouldBindJSON(&newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid Format",
			"message": err.Error(),
		})
		return
	}

	createdUser, err := h.userService.Register(&newUser)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Bad Request",
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"id":         createdUser.ID,
		"username":   createdUser.Username,
		"email":      createdUser.Email,
		"created_at": createdUser.CreatedAt,
	})
}

// UserLogin implements [UserHandler].
func (h *UserHandlerImpl) UserLogin(c *gin.Context) {
	user := model.LoginForm{}

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid Format",
			"message": err.Error(),
		})
		return
	}

	token, err := h.userService.Login(user.Email, user.Password)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "Unauthorized",
			"message": "invalid email/password",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
	})
}

// UserProfile implements [UserHandler].
func (h *UserHandlerImpl) UserProfile(c *gin.Context) {
	userData := c.MustGet("userData").(jwt.MapClaims)

	userID := uint(userData["id"].(float64))

	getUser, err := h.userService.GetProfile(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid Format",
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":         getUser.ID,
		"username":   getUser.Username,
		"email":      getUser.Email,
		"created_at": getUser.CreatedAt,
	})
}

// UserUpdate implements [UserHandler].
func (h *UserHandlerImpl) UserUpdate(c *gin.Context) {
	userData := c.MustGet("userData").(jwt.MapClaims)

	userID := uint(userData["id"].(float64))

	username := model.UpdateProfileRequest{}

	if err := c.ShouldBindJSON(&username); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid Format",
			"message": err.Error(),
		})
		return
	}

	err := h.userService.UpdateUser(&username, userID)
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

// // UserDelete implements [UserHandler].
// func (h *UserHandlerImpl) UserDelete(*gin.Context) {
// 	panic("unimplemented")
// }
