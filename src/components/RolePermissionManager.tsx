'use client';

import { useState } from 'react';

interface Permission {
  id: string;
  name: string;
  description: string | null;
}

interface Props {
  roleId: string;
  roleName: string;
  currentPermissions: string[];
  allPermissions: Permission[];
}

export default function RolePermissionManager({
  roleId,
  roleName,
  currentPermissions,
  allPermissions,
}: Props) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(currentPermissions);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleTogglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`/api/roles/${roleId}/permissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissionIds: selectedPermissions }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Permissions updated successfully');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setMessage(data.error?.message || 'Failed to update permissions');
      }
    } catch (error) {
      setMessage('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = JSON.stringify([...selectedPermissions].sort()) !==
                     JSON.stringify([...currentPermissions].sort());

  return (
    <div>
      <h4 style={{ fontSize: '14px', marginBottom: '12px', fontWeight: 600 }}>
        Update Permissions
      </h4>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px', marginBottom: '16px' }}>
        {allPermissions.map((permission) => (
          <label
            key={permission.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px',
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            <input
              type="checkbox"
              checked={selectedPermissions.includes(permission.id)}
              onChange={() => handleTogglePermission(permission.id)}
              style={{ marginRight: '8px' }}
            />
            <span>{permission.name}</span>
          </label>
        ))}
      </div>

      {hasChanges && (
        <button
          onClick={handleSave}
          disabled={loading}
          className="btn btn-primary"
          style={{ fontSize: '14px' }}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      )}

      {message && (
        <div
          style={{
            marginTop: '12px',
            padding: '8px',
            borderRadius: '4px',
            fontSize: '14px',
            background: message.includes('success') ? '#e8f5e9' : '#ffebee',
            color: message.includes('success') ? '#2e7d32' : '#c62828',
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}
