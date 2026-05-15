"""
CRUD service layer — DB operations decoupled from HTTP concerns.

Routers call these functions; this keeps the routing thin and unit-testable.
"""

from typing import Optional

from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from models import Ticket
from schemas import TicketCreate, TicketUpdate


def get_ticket(db: Session, ticket_id: int) -> Optional[Ticket]:
    return db.get(Ticket, ticket_id)


def list_tickets(db: Session) -> list[Ticket]:
    stmt = select(Ticket).order_by(Ticket.created_at.desc())
    return list(db.scalars(stmt).all())


def create_ticket(db: Session, payload: TicketCreate) -> Ticket:
    ticket = Ticket(
        employee_name=payload.employee_name,
        department=payload.department,
        issue_category=payload.issue_category.value,
        description=payload.description,
        priority=payload.priority.value,
        status=payload.status.value,
        resolution_notes=payload.resolution_notes,
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


def update_ticket(
    db: Session, ticket_id: int, payload: TicketUpdate
) -> Optional[Ticket]:
    ticket = get_ticket(db, ticket_id)
    if ticket is None:
        return None

    # Pydantic v2: exclude_unset gives us only the fields the client sent.
    data = payload.model_dump(exclude_unset=True)
    for field, value in data.items():
        # Enums → store their string value
        if hasattr(value, "value"):
            value = value.value
        setattr(ticket, field, value)

    db.commit()
    db.refresh(ticket)
    return ticket


def delete_ticket(db: Session, ticket_id: int) -> bool:
    ticket = get_ticket(db, ticket_id)
    if ticket is None:
        return False
    db.delete(ticket)
    db.commit()
    return True


def search_tickets(
    db: Session,
    keyword: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
) -> list[Ticket]:
    """
    Keyword search (description / employee_name / department) + filters.
    All parameters are optional and combine with AND.
    """
    stmt = select(Ticket)

    if keyword:
        like = f"%{keyword}%"
        stmt = stmt.where(
            or_(
                Ticket.description.ilike(like),
                Ticket.employee_name.ilike(like),
                Ticket.department.ilike(like),
                Ticket.resolution_notes.ilike(like),
            )
        )

    if category:
        stmt = stmt.where(Ticket.issue_category == category)
    if status:
        stmt = stmt.where(Ticket.status == status)
    if priority:
        stmt = stmt.where(Ticket.priority == priority)

    stmt = stmt.order_by(Ticket.created_at.desc())
    return list(db.scalars(stmt).all())
