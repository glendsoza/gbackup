import React, { useState } from 'react';
import { Modal, Button, Input } from 'antd';
import { SelectSource } from '../wailsjs/go/main/App';

const AddBackupModal = ({ open, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [selectedSource, setSelectedSource] = useState(null);

    const handleSelectSource = async () => {
        const result = await SelectSource();
        setSelectedSource(result);
    };

    const handleSave = () => {
        onSave({ name, selectedSource });
        onClose();
    };

    return (
        <Modal
            title="Add New Backup"
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>Close</Button>,
                <Button key="save" type="primary" onClick={handleSave}>Save</Button>
            ]}
        >
            <Input
                placeholder="Enter Backup Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ marginBottom: 10 }}
            />
            <Button onClick={handleSelectSource}>Select Source</Button>
            {selectedSource && (
                <p style={{ marginTop: 10 }}>
                    <strong>Selected Source:</strong> {selectedSource}
                </p>
            )}
        </Modal>
    );
};

export default AddBackupModal;
