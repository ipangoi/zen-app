package model

import (
	"time"
)

type GormModel struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
}

type User struct {
	GormModel
	Username string `json:"username" gorm:"type:varchar(100);uniqueIndex;not null"`
	Email    string `json:"email" gorm:"type:varchar(100);uniqueIndex;not null"`
	Password string `json:"-" gorm:"type:varchar(255);not null"`
}

type Task struct {
	GormModel
	UserID    uint      `json:"user_id"`
	Title     string    `json:"title" gorm:"type:varchar(255);not null"`
	Body      string    `json:"body" gorm:"type:text"`
	Status    string    `json:"status" gorm:"type:varchar(20);default:'On Progress'"`
	UpdatedAt time.Time `json:"updated_at" gorm:"autoUpdateTime"`
	User      User      `json:"user"`
}

type Session struct {
	GormModel
	UserID    uint       `json:"user_id"`
	TaskID    *uint      `json:"task_id"`
	StartTime time.Time  `json:"start_time"`
	EndTime   *time.Time `json:"end_time"`
	Duration  int        `json:"duration"`
	User      User       `json:"user"`
	Task      Task       `json:"task"`
}

type Chat struct {
	GormModel
	UserID  uint   `json:"user_id"`
	Role    string `json:"role" gorm:"type:varchar(20)"`
	Content string `json:"content" gorm:"type:text"`
	User    User   `json:"user"`
}

type RegisterForm struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type LoginForm struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type UpdateProfileRequest struct {
	Username string `json:"username" binding:"required"`
}
