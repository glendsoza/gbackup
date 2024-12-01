import { Button, Modal, Table, Tooltip } from 'antd';
import { UndoOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const ActiveBackUps = ({ open, onClose, activeBackups, onRestoreClick, onDeleteClick, actionTriggered }) => {
    const renderActiveStatus = (isActive) =>
        isActive ? (
            <CheckCircleOutlined style={{ color: '#52c41a' }} title="Active" />
        ) : (
            <CloseCircleOutlined style={{ color: '#f5222d' }} title="Inactive" />
        );

    const renderActionButton = (icon, color, text, onClick, disabled) => (
        <Button
            icon={icon}
            type="link"
            style={{ color, border: 'none' }}
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </Button>
    );

    const renderDescription = (description) => (
        <Tooltip title={description}>
            <div
                style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100px',
                }}
            >
                {description}
            </div>
        </Tooltip>
    );

    const activeBackUpColumns = [
        { title: 'Id', dataIndex: 'Id', key: 'Id' },
        { title: 'Name', dataIndex: 'Name', key: 'Name' },
        {
            title: 'Description',
            dataIndex: 'Metadata',
            key: 'Metadata',
            render: renderDescription,
        },
        {
            title: 'Created',
            dataIndex: 'Created',
            key: 'Created',
            render: (text) => new Date(text).toLocaleString(),
        },
        {
            title: 'Active',
            dataIndex: 'Active',
            key: 'Active',
            render: renderActiveStatus,
        },
        {
            title: 'Restore',
            key: 'restore',
            render: (_, record) =>
                renderActionButton(
                    <UndoOutlined />,
                    '#52c41a',
                    'Restore',
                    () => onRestoreClick(record.BackUp.Name, record.Name),
                    actionTriggered
                ),
        },
        {
            title: 'Delete',
            key: 'Delete',
            render: (_, record) =>
                renderActionButton(
                    <DeleteOutlined />,
                    '#f5222d',
                    'Delete',
                    () => onDeleteClick(record.BackUp.Name, record.Name),
                    actionTriggered
                ),
        },
    ];

    return (
        <Modal
            title="Active Backups"
            open={open}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            <Table
                columns={activeBackUpColumns}
                dataSource={activeBackups}
                pagination={{ pageSize: 5 }}
                rowKey="Id"
            />
        </Modal>
    );
};

export default ActiveBackUps;
