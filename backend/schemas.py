"""
Pydantic v2 schemas for request validation and response serialization.

Three layers:
    * TicketBase   — fields common to create/update
    * TicketCreate — what the client POSTs
    * TicketUpdate — partial update (all fields optional)
    * TicketOut    — what the API returns (includes id + created_at)
"""

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


# ---------- Enumerations (mirror DB CHECK constraints) ----------

class IssueCategory(str, Enum):
    VPN_ISSUE = "VPN Issue"
    PASSWORD_RESET = "Password Reset"
    SOFTWARE_INSTALLATION = "Software Installation"
    LAPTOP_ISSUE = "Laptop Issue"
    EMAIL_ACCESS = "Email Access"
    NETWORK_CONNECTIVITY = "Network Connectivity"
    HARDWARE_REQUEST = "Hardware Request"


class Priority(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"


class Status(str, Enum):
    OPEN = "Open"
    IN_PROGRESS = "In Progress"
    RESOLVED = "Resolved"
    CLOSED = "Closed"


# ---------- Schemas ----------

class TicketBase(BaseModel):
    employee_name: str = Field(..., min_length=1, max_length=120)
    department: str = Field(..., min_length=1, max_length=80)
    issue_category: IssueCategory
    description: str = Field(..., min_length=5)
    priority: Priority


class TicketCreate(TicketBase):
    """Payload for POST /tickets — status defaults to Open server-side."""
    status: Status = Status.OPEN
    resolution_notes: Optional[str] = None


class TicketUpdate(BaseModel):
    """Payload for PUT /tickets/{id} — every field optional (partial update)."""
    employee_name: Optional[str] = Field(default=None, min_length=1, max_length=120)
    department: Optional[str] = Field(default=None, min_length=1, max_length=80)
    issue_category: Optional[IssueCategory] = None
    description: Optional[str] = Field(default=None, min_length=5)
    priority: Optional[Priority] = None
    status: Optional[Status] = None
    resolution_notes: Optional[str] = None


class TicketOut(TicketBase):
    ticket_id: int
    status: Status
    resolution_notes: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MessageResponse(BaseModel):
    """Generic message envelope (used by DELETE)."""
    message: str
