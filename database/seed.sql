-- =====================================================================
--  HDMS — Seed Data
--  15 sample tickets covering all categories, priorities, and statuses.
-- =====================================================================

INSERT INTO tickets (employee_name, department, issue_category, description, priority, status, resolution_notes, created_at) VALUES
('Aarav Sharma',    'Finance',     'VPN Issue',              'Cannot connect to corporate VPN from home network.',                'High',     'Open',        NULL,                                                  '2026-05-12 09:14:00'),
('Priya Iyer',      'HR',          'Password Reset',         'Locked out of AD account after 3 failed attempts.',                 'Medium',   'Resolved',    'Reset password via self-service portal.',             '2026-05-11 10:02:00'),
('Rahul Verma',     'Engineering', 'Software Installation',  'Need IntelliJ IDEA Ultimate license activated on workstation.',     'Low',      'In Progress', 'License key requested from procurement.',             '2026-05-12 11:30:00'),
('Sneha Kapoor',    'Marketing',   'Laptop Issue',           'Laptop battery drains within 1 hour; suspect bad cell.',            'High',     'Open',        NULL,                                                  '2026-05-13 08:45:00'),
('Vikram Singh',    'Sales',       'Email Access',           'Outlook keeps prompting for credentials repeatedly.',               'Medium',   'In Progress', 'Cached credentials cleared, monitoring.',             '2026-05-13 14:10:00'),
('Ananya Pillai',   'Engineering', 'Network Connectivity',   'Wi-Fi disconnects every ~10 minutes on 4th floor.',                 'Critical', 'Open',        NULL,                                                  '2026-05-13 15:25:00'),
('Karthik Reddy',   'Operations',  'Hardware Request',       'Need additional 24-inch external monitor for dual-screen setup.',   'Low',      'Closed',      'Monitor delivered and signed for.',                   '2026-05-08 09:00:00'),
('Meera Nair',      'Finance',     'VPN Issue',              'VPN connects but no access to internal SAP server.',                'High',     'Resolved',    'Firewall rule updated for user subnet.',              '2026-05-09 13:20:00'),
('Rohan Mehta',     'Engineering', 'Software Installation',  'Docker Desktop installation failing with WSL2 error.',              'Medium',   'In Progress', 'WSL2 reinstalled, awaiting reboot.',                  '2026-05-12 16:00:00'),
('Ishita Bose',     'HR',          'Laptop Issue',           'Spacebar key sticking on ThinkPad keyboard.',                       'Low',      'Open',        NULL,                                                  '2026-05-13 11:00:00'),
('Aditya Joshi',    'Marketing',   'Email Access',           'Shared mailbox marketing@ not visible in Outlook profile.',         'Medium',   'Resolved',    'Mailbox permissions re-applied.',                     '2026-05-10 10:15:00'),
('Divya Krishnan',  'Sales',       'Password Reset',         'Forgot Salesforce SSO password.',                                   'Low',      'Closed',      'Password reset via SSO portal.',                      '2026-05-07 09:30:00'),
('Sameer Bhat',     'Engineering', 'Network Connectivity',   'Cannot reach GitHub Enterprise from office VLAN.',                  'Critical', 'In Progress', 'Routing table updated, validating with user.',        '2026-05-13 17:45:00'),
('Pooja Desai',     'Operations',  'Hardware Request',       'Keyboard and mouse replacement for ergonomic setup.',               'Low',      'Open',        NULL,                                                  '2026-05-14 09:00:00'),
('Nikhil Rao',      'Finance',     'VPN Issue',              'VPN client crashes immediately after launch on macOS.',             'High',     'Open',        NULL,                                                  '2026-05-14 10:30:00');
