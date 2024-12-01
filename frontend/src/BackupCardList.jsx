import React, { useEffect, useState } from 'react'
import { Layout, Pagination, Input, Row, Col, Button, notification } from 'antd'
import { SearchOutlined, DeleteOutlined, CloudUploadOutlined, PlusOutlined, EyeOutlined, LoadingOutlined } from '@ant-design/icons'
import { AddBackUp, GetActiveBackUps, GetBackups, RestoreActiveBackup, TakeBackup, DeleteBackUp, DeleteActiveBackUp } from "../wailsjs/go/main/App.js"
import AddBackupModal from './AddBackupModal.jsx'
import TakeBackupModal from './TakeBackupModal.jsx'


import 'antd/dist/reset.css'
import ActiveBackUps from './ActiveBackUps.jsx'

const { Header, Content } = Layout
const { Search } = Input

const BackupCardList = () => {
    const [backups, setBackup] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState(10)
    const [filteredBackups, setFilteredBackups] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [activeBackups, setActiveBackups] = useState([])
    const [activeBackupModalVisible, setActiveBackupModalVisible] = useState(false)
    const [actionTriggered, setActionTriggered] = useState(false)
    const [takeBackupModalVisible, setTakeBackupModalVisible] = useState(false);
    const [selectedBackupName, setSelectedBackupName] = useState('');

    const executeWithProgressNotification = async (action, description, showSuccess, resultCallBack, ...actionParams) => {
        const notificationKey = `${action}-${actionParams.join("-")}`;
        setActionTriggered(true);

        notification.open({
            key: notificationKey,
            message: 'Working...',
            description: description,
            icon: <LoadingOutlined style={{ color: '#1890ff' }} />,
            duration: 0,
        });

        try {
            const result = await action(...actionParams);
            if (resultCallBack !== undefined && resultCallBack !== null) {
                resultCallBack(result)
            }
            if (result.Error) {
                notification.error({
                    key: notificationKey,
                    message: 'Error',
                    description: `${description} failed`,
                });
            } else {
                if (showSuccess) {
                    notification.success({
                        key: notificationKey,
                        message: 'Success',
                        description: `${description} completed`,
                    });
                } else {
                    notification.destroy(notificationKey)
                }

            }
        } finally {
            setActionTriggered(false);
        }
    };

    const loadBackUp = () => {
        const resultCallBack = (result) => {
            setBackup(result.Backups)
            setFilteredBackups(result.Backups)
        }
        executeWithProgressNotification(GetBackups, "getting backups", true, resultCallBack, [])
    }

    useEffect(() => {
        loadBackUp()
    }, [])


    const handleSearch = (value) => {
        setSearchTerm(value)
        if (value) {
            const filtered = backups.filter(backup =>
                backup.Name.toLowerCase().includes(value.toLowerCase())
            )
            setFilteredBackups(filtered)
        } else {
            setFilteredBackups(backups)
        }
        setCurrentPage(1)
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleViewActiveBackup = (name) => {
        const resultCallBack = (result) => {
            setActiveBackups(result.ActiveBackups)
            setActiveBackupModalVisible(true)
        }
        executeWithProgressNotification(GetActiveBackUps, "getting active backups", false, resultCallBack, name)
    }

    const handleRestoreBackup = (backupName, activeBackUpName) => {
        const resultCallack = (result) => {
            handleViewActiveBackup(backupName)
        }
        executeWithProgressNotification(RestoreActiveBackup, `restoring active backup ${activeBackUpName}`, true, resultCallack, activeBackUpName)
    }

    const handleDeleteActiveBackup = (backupName, activeBackUpName) => {
        const resultCallBack = (result) => {
            handleViewActiveBackup(backupName)
        }
        executeWithProgressNotification(DeleteActiveBackUp, `deleting active backup ${activeBackUpName}`, true, resultCallBack, activeBackUpName)
    }

    const handleTakeBackupSave = (description) => {
        executeWithProgressNotification(
            TakeBackup,
            `taking backup of ${selectedBackupName}`,
            true,
            null,
            selectedBackupName,
            description
        );
        setTakeBackupModalVisible(false);
    };

    const handleTakeBackup = (name) => {
        setSelectedBackupName(name);
        setTakeBackupModalVisible(true);
    }

    const handleDeleteBackUp = (name) => {
        const resultCallback = (result) => {
            loadBackUp()
        }
        executeWithProgressNotification(DeleteBackUp, `deleting backup ${name}`, true, resultCallback, name)

    }

    const handleAddBackup = (newBackup) => {
        const resultCallack = (result) => {
            setBackup([result.Backup, ...backups])
            setFilteredBackups([result.Backup, ...filteredBackups])
        }
        executeWithProgressNotification(AddBackUp, `adding backup ${newBackup.name}`, true, resultCallack, newBackup.name, newBackup.selectedSource)

    }

    const currentBackups = filteredBackups.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    )


    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <Header style={{ backgroundColor: '#001529', padding: '10px' }}>
                <h1 style={{ color: '#fff', fontSize: '24px', margin: 0, textAlign: 'center' }}>
                    GBackup
                </h1>
            </Header>
            <Content style={{ padding: '30px' }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    style={{ marginBottom: '20px', borderRadius: '8px' }}
                    onClick={() => setIsModalVisible(true)}
                    disabled={actionTriggered}
                >
                    Add Backup
                </Button>
                <Search
                    placeholder="Search backups..."
                    enterButton={<SearchOutlined />}
                    size="large"
                    onSearch={handleSearch}
                    style={{ marginBottom: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
                />
                <Row
                    gutter={[24, 24]}
                    style={{
                        backgroundColor: '#fafafa',
                        padding: '24px',
                        borderRadius: '12px',
                    }}
                >
                    {currentBackups.map((backup) => (
                        <Col key={backup.Id} xs={24} sm={12} md={8} lg={6}>
                            <div
                                style={{
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '12px',
                                    backgroundColor: '#f7f7f7',
                                    padding: '20px',
                                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                    cursor: 'pointer',
                                    height: 'auto',
                                    textAlign: 'center',
                                    overflow: 'hidden',
                                    position: 'relative',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)'
                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.1)'
                                }}
                            >
                                <h3 style={{ margin: '0 0 10px', fontWeight: 'bold', color: '#333' }}>
                                    {backup.Name}
                                </h3>
                                <p style={{ margin: '0 0 5px', fontSize: '15px', color: '#555' }}>
                                    <strong>Source:</strong> {backup.Source}
                                </p>
                                <p style={{ margin: '0 0 5px', fontSize: '15px', color: '#555' }}>
                                    <strong>Path:</strong> {backup.Path}
                                </p>
                                <p style={{ margin: '0 0 15px', fontSize: '15px', color: '#555' }}>
                                    <strong>Created:</strong> {new Date(backup.Created).toLocaleString()}
                                </p>

                                {/* Buttons Section */}
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        marginTop: '20px',
                                    }}
                                >
                                    <Button
                                        icon={<EyeOutlined />}
                                        type="primary"
                                        size="large"
                                        style={{
                                            backgroundColor: '#1890ff',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '8px',
                                            padding: '8px 16px',
                                            fontWeight: '500',
                                            transition: 'background-color 0.3s',
                                        }}
                                        onClick={() => handleViewActiveBackup(backup.Name)}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#40a9ff'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1890ff'}
                                    >
                                        View
                                    </Button>
                                    <Button
                                        icon={<CloudUploadOutlined />}
                                        type="primary"
                                        size="large"
                                        style={{
                                            backgroundColor: '#52c41a',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '8px',
                                            padding: '8px 16px',
                                            fontWeight: '500',
                                            transition: 'background-color 0.3s',
                                        }}
                                        onClick={() => handleTakeBackup(backup.Name)}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#73d13d'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#52c41a'}
                                        disabled={actionTriggered}
                                    >
                                        Backup
                                    </Button>
                                    <Button
                                        icon={<DeleteOutlined />}
                                        type="primary"
                                        size="large"
                                        danger
                                        style={{
                                            backgroundColor: '#f5222d',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '8px',
                                            padding: '8px 16px',
                                            fontWeight: '500',
                                            transition: 'background-color 0.3s',
                                        }}
                                        onClick={() => handleDeleteBackUp(backup.Name)}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ff4d4f'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f5222d'}
                                        disabled={actionTriggered}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>


                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={filteredBackups.length}
                        onChange={handlePageChange}
                        style={{ padding: '10px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                        showSizeChanger={false}
                    />
                </div>
                <AddBackupModal
                    open={isModalVisible}
                    onClose={() => setIsModalVisible(false)}
                    onSave={handleAddBackup}
                />
                <ActiveBackUps
                    open={activeBackupModalVisible}
                    onClose={() => setActiveBackupModalVisible(false)}
                    activeBackups={activeBackups}
                    onRestoreClick={handleRestoreBackup}
                    onDeleteClick={handleDeleteActiveBackup}
                    actionTriggered={actionTriggered}
                />

                <TakeBackupModal
                    open={takeBackupModalVisible}
                    onClose={() => setTakeBackupModalVisible(false)}
                    onSave={handleTakeBackupSave}
                />
            </Content>
        </Layout>
    )
}

export default BackupCardList
