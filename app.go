package main

import (
	"context"
	"os"

	"github.com/labstack/gommon/log"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
	mgr *Manager
}

type GetBackUpsResponse struct {
	Backups []*BackUp
	Error   error
}

type AddBackUpResonse struct {
	Backup *BackUp
	Error  error
}

type TakeBackupResponse struct {
	Error error
}

type GetActiveBackUpsResponse struct {
	ActiveBackups []*ActiveBackup
	Error         error
}

type ResoteBackUpResponse struct {
	Error error
}

type DeleteActiveBackupResponse struct {
	Error error
}

type DeleteBackupResponse struct {
	Error error
}

// NewApp creates a new App application struct
func NewApp() *App {
	path, err := os.UserCacheDir()
	if err != nil {
		log.Fatalf("unable to get cache dir: %s", err.Error())
	}
	mgr, err := NewBackUpManager(path)
	if err != nil {
		log.Fatalf("cant create new app: %s", err.Error())
	}
	return &App{
		mgr: mgr,
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) SelectSource() string {
	location, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{})
	if err != nil {
		return err.Error()
	}
	return location
}

func (a *App) GetBackups() *GetBackUpsResponse {
	b, err := a.mgr.GetBackups()
	return &GetBackUpsResponse{
		Backups: b,
		Error:   err,
	}
}

func (a *App) AddBackUp(name, source string) *AddBackUpResonse {
	err := a.mgr.AddBackup(name, source)
	br := &AddBackUpResonse{Error: err}
	if err != nil {
		return br
	}
	b, err := a.mgr.GetBackup(name)
	if err != nil {
		br.Error = err
		return br
	}
	br.Backup = b
	return br
}

func (a *App) TakeBackup(name, description string) *TakeBackupResponse {
	return &TakeBackupResponse{Error: a.mgr.TakeBackup(name, description)}
}

func (a *App) RestoreActiveBackup(name string) *ResoteBackUpResponse {
	return &ResoteBackUpResponse{
		Error: a.mgr.RestoreFromActiveBackUp(name),
	}
}

func (a *App) GetActiveBackUps(name string) *GetActiveBackUpsResponse {
	abups, err := a.mgr.GetActiveBackups(name)
	return &GetActiveBackUpsResponse{
		ActiveBackups: abups,
		Error:         err,
	}
}

func (a *App) DeleteActiveBackUp(name string) *DeleteActiveBackupResponse {
	return &DeleteActiveBackupResponse{
		Error: a.mgr.DeleteActiveBackUp(name),
	}
}

func (a *App) DeleteBackUp(name string) *DeleteBackupResponse {
	return &DeleteBackupResponse{
		Error: a.mgr.DeleteBackUp(name),
	}
}
