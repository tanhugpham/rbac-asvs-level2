'use client';

import { useState } from 'react';

interface Role {
  id: string;
  name: string;
}

interface Props {
  userId: string;
  userEmail: string;
  currentRoles: Role[];
  availableRoles: Role[];
}

export default function UserRoleManager({
  userId,
  userEmail,
  currentRoles,
  availableRoles,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAssignRole = async (roleId: string) => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`/api/users/${userId}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId, action: 'assign' }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Role assigned successfully');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setMessage(data.error?.message || 'Failed to assign role');
      }
    } catch (error) {
      setMessage('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    if (!confirm('Are you sure you want to remove this role?')) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`/api/users/${userId}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId, action: 'remove' }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Role removed successfully');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setMessage(data.error?.message || 'Failed to remove role');
      }
    } catch (error) {
      setMessage('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const currentRoleIds = currentRoles.map((r) => r.id);
  const availableToAssign = availableRoles.filter(
    (r) => !currentRoleIds.includes(r.id)
  );

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        className="btn btn-secondary"
        style={{ fontSize: '12px', padding: '6px 12px' }}
      >
        Manage Roles
      </button>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: 'white',
              padding: '24px',
              borderRadius: '8px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>
              Manage Roles for {userEmail}
            </h3>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>
                Current Roles
              </h4>
              {currentRoles.length === 0 ? (
                <p style={{ fontSize: '14px', color: '#666' }}>No roles assigned</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {currentRoles.map((role) => (
                    <div
                      key={role.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px',
                        background: '#f9f9f9',
                        borderRadius: '4px',
                      }}
                    >
                      <span className={`badge badge-${role.name.toLowerCase()}`}>
                        {role.name}
                      </span>
                      <button
                        onClick={() => handleRemoveRole(role.id)}
                        disabled={loading}
                        style={{
                          padding: '4px 8px',
                          fontSize: '12px',
                          background: '#e00',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>
                Assign New Role
              </h4>
              {availableToAssign.length === 0 ? (
                <p style={{ fontSize: '14px', color: '#666' }}>
                  All roles already assigned
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {availableToAssign.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => handleAssignRole(role.id)}
                      disabled={loading}
                      style={{
                        padding: '8px',
                        fontSize: '14px',
                        background: '#0070f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      Assign {role.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {message && (
              <div
                style={{
                  padding: '8px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  marginBottom: '16px',
                  background: message.includes('success') ? '#e8f5e9' : '#ffebee',
                  color: message.includes('success') ? '#2e7d32' : '#c62828',
                }}
              >
                {message}
              </div>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
