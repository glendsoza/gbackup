package main

import (
	"database/sql"
	"fmt"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

var mgr *Manager

func TestMain(m *testing.M) {
	os.Remove("dummy_test_folder/gbackup/data.db")
	os.RemoveAll("dummy_test_folder")
	os.RemoveAll("dummy_source")
	os.Mkdir("dummy_source", 0744)
	os.Create("dummy_source/user_data_0.sav")
	code := m.Run()
	os.Exit(code)
}

func TestCreateManager(t *testing.T) {
	manager, err := NewBackUpManager("dummy_test_folder")
	assert.NoError(t, err, "error while creating manager")
	mgr = manager
}

func TestAddBackUp(t *testing.T) {
	err := mgr.AddBackup("dummy", "dummy_source")
	assert.NoError(t, err, "error while adding backup")
}

func TestTakeBackup(t *testing.T) {
	err := mgr.TakeBackup("dummy", "new")
	assert.NoError(t, err, "error while taking backup")

	err = mgr.TakeBackup("dummy", "new new")
	assert.NoError(t, err, "error while taking backup")
}

func TestRestoreBackup(t *testing.T) {
	os.WriteFile("dummy_test_folder/gbackup/dummy/dummy_1/user_data_0.sav", []byte("from restore"), 0744)
	err := mgr.RestoreFromActiveBackUp("dummy_1")
	assert.NoError(t, err, "error while restoring backup")

	data, err := os.ReadFile("dummy_source/user_data_0.sav")
	assert.NoError(t, err, "error while reading the source save")
	assert.Equal(t, "from restore", string(data), "expected source save to contain 'from restore'")

	ab, err := mgr.GetActiveBackup("dummy_1")
	assert.NoError(t, err, "error while getting active backup")
	assert.Equal(t, 1, ab.Active, "expected active backup to have Active=1")

	err = mgr.RestoreFromActiveBackUp("dummy_2")
	assert.NoError(t, err, "error while restoring backup")

	ab, err = mgr.GetActiveBackup("dummy_1")
	assert.NoError(t, err, "error while getting active backup")
	assert.Equal(t, 0, ab.Active, "expected backup to have Active=0")

	ab, err = mgr.GetActiveBackup("dummy_2")
	assert.NoError(t, err, "error while getting active backup")
	assert.Equal(t, 1, ab.Active, "expected backup to have Active=1")

}

func TestGetBackup(t *testing.T) {
	b, err := mgr.GetBackup("dummy")
	assert.NoError(t, err, "error while getting the backup")
	assert.Equal(t, 1, b.Id)
	assert.Equal(t, "dummy", b.Name)
	assert.Equal(t, "dummy_test_folder/gbackup/dummy", b.Path)
	assert.Equal(t, "dummy_source", b.Source)
}

func TestGetBackups(t *testing.T) {
	backups, err := mgr.GetBackups()
	assert.NoError(t, err, "error while getting backups")
	assert.Len(t, backups, 1, "expected exactly 1 backup")

	b := backups[0]
	assert.Equal(t, 1, b.Id)
	assert.Equal(t, "dummy", b.Name)
	assert.Equal(t, "dummy_test_folder/gbackup/dummy", b.Path)
	assert.Equal(t, "dummy_source", b.Source)

}

func TestGetActiveBackup(t *testing.T) {
	ab, err := mgr.GetActiveBackup("dummy_1")
	assert.NoError(t, err, "error while getting active backup")
	assert.Equal(t, 1, ab.BackUp.Id)
	assert.Equal(t, 1, ab.Id)
	assert.Equal(t, "dummy_1", ab.Name)
	assert.Equal(t, 0, ab.Active)
	assert.Equal(t, "new", *ab.Metadata)

}

func TestGetActiveBackups(t *testing.T) {
	activeBackups, err := mgr.GetActiveBackups("dummy")
	assert.NoError(t, err, "error while getting active backups")
	assert.Len(t, activeBackups, 2, "expected exactly 2 active backup")

	ab := activeBackups[0]
	assert.Equal(t, 1, ab.BackUp.Id)
	assert.Equal(t, 1, ab.Id)
	assert.Equal(t, "dummy_1", ab.Name)
	assert.Equal(t, 0, ab.Active)
}

func TestRemoveActiveBackup(t *testing.T) {
	ab, err := mgr.GetActiveBackup("dummy_1")
	assert.NoError(t, err, "error while getting active backup")

	err = mgr.DeleteActiveBackUp("dummy_1")
	assert.NoError(t, err, "error while deleting the active backup")

	_, err = os.Stat(fmt.Sprintf("%s/%s", ab.BackUp.Path, ab.Name))
	assert.ErrorIs(t, err, os.ErrNotExist, "expected directory not to exist")

	row := mgr.db.QueryRow("SELECT * from active_backup where name = 'dummy_1'")
	err = row.Scan()
	assert.ErrorIs(t, err, sql.ErrNoRows, "expected no rows to be present in the database after deletion")
}

func TestRemoveBackup(t *testing.T) {
	b, err := mgr.GetBackup("dummy")
	assert.NoError(t, err, "error while getting backup")

	err = mgr.DeleteBackUp(b.Name)
	assert.NoError(t, err, "error while deleting backup")

	_, err = os.Stat(b.Path)
	assert.ErrorIs(t, err, os.ErrNotExist, "expected directory not to exist")

	row := mgr.db.QueryRow("SELECT * from backup where name = 'dummy'")
	err = row.Scan()
	assert.ErrorIs(t, err, sql.ErrNoRows, "expected no rows to be present in the database after deletion")
}
