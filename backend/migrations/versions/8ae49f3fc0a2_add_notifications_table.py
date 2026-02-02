"""Add notifications table

Revision ID: 8ae49f3fc0a2
Revises: c81d10fd3c6e
Create Date: 2025-07-13 01:54:42.268277

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '8ae49f3fc0a2'
down_revision = 'c81d10fd3c6e'
branch_labels = None
depends_on = None
def upgrade():
    # إنشاء جدول notifications
    op.create_table(
        'notifications',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('user.id'), nullable=False),
        sa.Column('message', sa.String(length=255), nullable=False),
        sa.Column('is_read', sa.Boolean, server_default=sa.text('0'), nullable=False),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now(), nullable=False),
    )

def downgrade():
    # حذف جدول notifications
    op.drop_table('notifications')
