"""
Tickets router — all /tickets and /search endpoints.

Endpoints (per project spec):
    GET    /tickets         — list all
    GET    /tickets/{id}    — get one
    POST   /tickets         — create
    PUT    /tickets/{id}    — update
    DELETE /tickets/{id}    — delete
    GET    /search          — keyword + filters
"""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

import crud
from database import get_db
from schemas import (
    IssueCategory,
    MessageResponse,
    Priority,
    Status,
    TicketCreate,
    TicketOut,
    TicketUpdate,
)

router = APIRouter(tags=["tickets"])


# ---- Search MUST be registered before /tickets/{id} would shadow it. ----

@router.get("/search", response_model=list[TicketOut])
def search_tickets(
    keyword: Optional[str] = Query(default=None, description="Keyword in description, name, dept, or notes."),
    category: Optional[IssueCategory] = Query(default=None),
    status_filter: Optional[Status] = Query(default=None, alias="status"),
    priority: Optional[Priority] = Query(default=None),
    db: Session = Depends(get_db),
):
    return crud.search_tickets(
        db,
        keyword=keyword,
        category=category.value if category else None,
        status=status_filter.value if status_filter else None,
        priority=priority.value if priority else None,
    )


@router.get("/tickets", response_model=list[TicketOut])
def list_tickets(db: Session = Depends(get_db)):
    return crud.list_tickets(db)


@router.get("/tickets/{ticket_id}", response_model=TicketOut)
def get_ticket(ticket_id: int, db: Session = Depends(get_db)):
    ticket = crud.get_ticket(db, ticket_id)
    if ticket is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Ticket {ticket_id} not found")
    return ticket


@router.post("/tickets", response_model=TicketOut, status_code=status.HTTP_201_CREATED)
def create_ticket(payload: TicketCreate, db: Session = Depends(get_db)):
    return crud.create_ticket(db, payload)


@router.put("/tickets/{ticket_id}", response_model=TicketOut)
def update_ticket(ticket_id: int, payload: TicketUpdate, db: Session = Depends(get_db)):
    ticket = crud.update_ticket(db, ticket_id, payload)
    if ticket is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Ticket {ticket_id} not found")
    return ticket


@router.delete("/tickets/{ticket_id}", response_model=MessageResponse)
def delete_ticket(ticket_id: int, db: Session = Depends(get_db)):
    if not crud.delete_ticket(db, ticket_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Ticket {ticket_id} not found")
    return MessageResponse(message=f"Ticket {ticket_id} deleted successfully")
