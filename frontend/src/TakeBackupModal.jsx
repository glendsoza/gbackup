import React, { useState } from 'react';
import { Modal, Input, Button } from 'antd';

const TakeBackupModal = ({ open, onClose, onSave }) => {
    const [description, setDescription] = useState('');

    const handleSave = () => {
        onSave(description);
        setDescription('');
    };

    const handleCancel = () => {
        setDescription('');
        onClose();
    };

    return (
        <Modal
            open={open}
            title="Take Backup"
            onCancel={handleCancel}
            footer={[
                <Button key="close" onClick={handleCancel}>
                    Close
                </Button>,
                <Button
                    key="save"
                    type="primary"
                    onClick={handleSave}
                    disabled={!description.trim()}
                >
                    Save
                </Button>,
            ]}
        >
            <Input.TextArea
                rows={4}
                placeholder="Enter a description for the backup"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
        </Modal>
    );
};

export default TakeBackupModal;
