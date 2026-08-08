"""Add user role enum

Revision ID: e1fd575cb8c6
Revises: 623b037ae15d
Create Date: 2026-08-09 01:04:26.503832

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "e1fd575cb8c6"
down_revision: Union[str, Sequence[str], None] = "623b037ae15d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:

    user_role_enum = sa.Enum(
        "donor",
        "ngo",
        "volunteer",
        "admin",
        name="userrole"
    )

    # Create PostgreSQL enum type
    user_role_enum.create(
        op.get_bind(),
        checkfirst=True
    )

    # Convert existing role column
    op.alter_column(
        "users",
        "role",
        existing_type=sa.VARCHAR(length=20),
        type_=user_role_enum,
        existing_nullable=False,
        postgresql_using="role::userrole"
    )


def downgrade() -> None:

    # Convert enum back to VARCHAR
    op.alter_column(
        "users",
        "role",
        existing_type=sa.Enum(
            "donor",
            "ngo",
            "volunteer",
            "admin",
            name="userrole"
        ),
        type_=sa.VARCHAR(length=20),
        existing_nullable=False,
        postgresql_using="role::varchar"
    )

    # Remove PostgreSQL enum
    sa.Enum(
        "donor",
        "ngo",
        "volunteer",
        "admin",
        name="userrole"
    ).drop(
        op.get_bind(),
        checkfirst=True
    )