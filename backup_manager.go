package main

import (
	"database/sql"
	"fmt"
	"os"
	"time"

	_ "github.com/mattn/go-sqlite3"

	cp "github.com/otiai10/copy"
)

type BackUp struct {
	Id       int
	Name     string
	Source   string
	Path     string
	Metadata *string
	Created  time.Time
}

type ActiveBackup struct {
	Id       int
	Name     string
	BackUp   *BackUp
	Metadata *string
	Active   int
	Created  time.Time
}

type Manager struct {
	db   *sql.DB
	root string
}

func (mgr *Manager) GetBackup(backupName string) (*BackUp, error) {
	row := mgr.db.QueryRow(`
	SELECT id, name, source, path, metadata, created from backup WHERE name = $1
	`, backupName)
	b := &BackUp{}
	err := row.Scan(&b.Id, &b.Name, &b.Source, &b.Path, &b.Metadata, &b.Created)
	return b, err
}

func (mgr *Manager) GetBackups() ([]*BackUp, error) {
	rows, err := mgr.db.Query(`
	SELECT id, name, source, path, metadata, created from backup
	`)
	if err != nil {
		return nil, err
	}
	backups := []*BackUp{}
	for rows.Next() {
		b := &BackUp{}
		err = rows.Scan(&b.Id, &b.Name, &b.Source, &b.Path, &b.Metadata, &b.Created)
		if err != nil {
			return nil, err
		}
		backups = append(backups, b)
	}
	return backups, nil
}

func (mgr *Manager) GetActiveBackup(activeBackupName string) (*ActiveBackup, error) {
	row := mgr.db.QueryRow(`
	SELECT ab.id, ab.name, ab.metadata,ab.active, ab.created,b.id, b.name, b.source, b.metadata, b.path, b.created
	FROM active_backup ab INNER JOIN 
	backup b ON ab.backup_id = b.id
	WHERE ab.name = $1
	`, activeBackupName)
	ab := &ActiveBackup{}
	b := &BackUp{}
	err := row.Scan(&ab.Id, &ab.Name,
		&ab.Metadata, &ab.Active, &ab.Created,
		&b.Id, &b.Name, &b.Source, &b.Metadata, &b.Path, &b.Created)
	ab.BackUp = b
	return ab, err
}

func (mgr *Manager) GetActiveBackups(backupName string) ([]*ActiveBackup, error) {
	rows, err := mgr.db.Query(`
	SELECT ab.id, ab.name, ab.metadata, ab.active,ab.created,b.id, b.name, b.source, b.metadata, b.path, b.created
	FROM active_backup ab INNER JOIN 
	backup b ON ab.backup_id = b.id
	WHERE b.name = $1
	`, backupName)
	if err != nil {
		return nil, err
	}
	backUps := []*ActiveBackup{}
	for rows.Next() {
		ab := &ActiveBackup{}
		// know back up is same but still do it anyway
		b := &BackUp{}
		err := rows.Scan(&ab.Id, &ab.Name,
			&ab.Metadata, &ab.Active, &ab.Created,
			&b.Id, &b.Name, &b.Source, &b.Metadata, &b.Path, &b.Created)
		if err != nil {
			return nil, err
		}
		ab.BackUp = b
		backUps = append(backUps, ab)
	}
	return backUps, nil
}

func (mgr *Manager) RestoreFromActiveBackUp(activeBackUpName string) error {
	ab, err := mgr.GetActiveBackup(activeBackUpName)
	if err != nil {
		return err
	}
	err = cp.Copy(fmt.Sprintf("%s/%s", ab.BackUp.Path, activeBackUpName), ab.BackUp.Source)
	if err != nil {
		return err
	}
	// mark it as active
	ab.Active = 1
	_, err = mgr.db.Exec(`UPDATE active_backup SET active = 0;
						  UPDATE active_backup set active = 1 WHERE name = $1;
	`, activeBackUpName)
	return err
}

func (mgr *Manager) TakeBackup(backupName, description string) error {
	b, err := mgr.GetBackup(backupName)
	if err != nil {
		return err
	}
	row := mgr.db.QueryRow(`SELECT max(id) FROM active_backup 
	WHERE backup_id = (select id FROM backup where name=$1)`, backupName)
	var current *int
	err = row.Scan(&current)
	if err != nil {
		return err
	}
	empty := 0
	if current == nil {
		current = &empty
	}
	backUpName := fmt.Sprintf("%s_%d", backupName, *current+1)
	err = cp.Copy(b.Source, fmt.Sprintf("%s/%s", b.Path, backUpName))
	if err != nil {
		return err
	}
	_, err = mgr.db.Exec(`
	INSERT INTO active_backup (name, backup_id, metadata) VALUES ($1, (select id FROM backup where name = $2), $3)
	`, backUpName, backupName, description)
	return err
}

func (mgr *Manager) AddBackup(backupName, source string) error {
	path := fmt.Sprintf("%s/%s", mgr.root, backupName)
	err := os.Mkdir(path, 0744)
	if err != nil {
		return err
	}
	_, err = mgr.db.Exec(`
	INSERT INTO backup (name, source, path) VALUES ($1,$2,$3)
	`, backupName, source, path)
	return err
}

func (mgr *Manager) DeleteActiveBackUp(activeBackUpName string) error {
	ab, err := mgr.GetActiveBackup(activeBackUpName)
	if err != nil {
		return err
	}
	if err := os.RemoveAll(fmt.Sprintf("%s/%s", ab.BackUp.Path, ab.Name)); err != nil {
		return err
	}
	_, err = mgr.db.Exec("DELETE FROM active_backup where name = $1", ab.Name)
	return err
}

func (mgr *Manager) DeleteBackUp(backupName string) error {
	b, err := mgr.GetBackup(backupName)
	if err != nil {
		return err
	}
	if err := os.RemoveAll(b.Path); err != nil {
		return err
	}
	_, err = mgr.db.Exec(`DELETE from active_backup where backup_id = (SELECT id from backup where name = $1);
				 DELETE from backup where name = $2;
	`, backupName, backupName)
	return err
}

func NewBackUpManager(path string) (*Manager, error) {
	runMigrations := false
	mgr := &Manager{
		root: fmt.Sprintf("%s/gbackup", path),
	}
	_, err := os.Stat(mgr.root)
	if err != nil {
		if os.IsNotExist(err) {
			if err := os.MkdirAll(mgr.root, 0744); err != nil {
				return nil, err
			}
			runMigrations = true
		} else {
			return nil, err
		}
	}
	db, err := sql.Open("sqlite3", fmt.Sprintf("%s/data.db", mgr.root))
	if err != nil {
		return nil, err
	}
	if runMigrations {
		_, err := db.Exec(schema)
		if err != nil {
			return nil, err
		}
	}
	mgr.db = db
	return mgr, nil
}
