"""Add email column to messages table

Revision ID: 6e553ac5cda8
Revises: cf8128910548
Create Date: 2024-10-16 17:04:08.693922

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "6e553ac5cda8"
down_revision: Union[str, None] = "cf8128910548"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Add the email column to the messages table
    op.add_column("messages", sa.Column("user_email", sa.String(), nullable=False))


def downgrade():
    # Remove the email column in case of rollback
    op.drop_column("messages", "user_email")
