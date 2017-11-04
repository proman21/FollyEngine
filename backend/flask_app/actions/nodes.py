# Copyright (c) 2017 Ned Hoy <nedhoy@gmail.com>
# 
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

"""
Abstract Syntax Tree (AST) for the real world game engine mini language.
"""

from typing import List, Union
import enum

StatementType = Union[
    'CompoundStatement',
    'IfElseStatement',
    'PrintStatement',
    'AssignmentStatement',
    'SetAttrStatement',
    'OutputStatement',
]

ExpressionType = Union[
    'BinaryOp',
    'BooleanLiteral',
    'StringLiteral',
    'GetAttrExpression',
    'VariableNameExpression',
]

NodeType = Union[
    'StatementType',
    'ExpressionType',
]

class Operator(enum.Enum):
    """Enumeration of possible binary operations"""
    ADD = enum.auto()
    MULT = enum.auto()
    SUB = enum.auto()
    MOD = enum.auto()
    LT = enum.auto()
    LE = enum.auto()
    EQ = enum.auto()
    NE = enum.auto()
    GE = enum.auto()
    GT = enum.auto()
    LOGICAL_OR = enum.auto()
    LOGICAL_AND = enum.auto()

class CompoundStatement:
    """Node that represents a sequence of other statements"""
    statements: List[StatementType]

    def __init__(self, statements: List[StatementType]) -> None:
        self.statements = statements

class IfElseStatement:
    """Node that represents an if-else-statement"""
    condition: ExpressionType
    if_body: StatementType
    else_body: StatementType

    def __init__(self, condition: ExpressionType, if_body: StatementType, else_body: StatementType) -> None:
        self.condition = condition
        self.if_body = if_body
        self.else_body = else_body

class PrintStatement:
    """Node that represents a print statement"""
    expression: ExpressionType

    def __init__(self, expression: ExpressionType) -> None:
        self.expression = expression

class BooleanLiteral:
    """Leaf node that holds a single boolean value"""
    
    value: bool

    def __init__(self, value: bool) -> None:
        self.value = value

class IntegerLiteral:
    """Leaf node that holds a single integer"""

    value: int

    def __init__(self, value: int) -> None:
        self.value = value

class StringLiteral:
    """Leaf node that holds a string"""
    
    value: str

    def __init__(self, value: str) -> None:
        self.value = value

class BinaryOp:
    """Node that represents a binary operation"""

    left: ExpressionType
    operator: Operator
    right: ExpressionType

    def __init__(self, left: ExpressionType, operator: Operator, right: ExpressionType) -> None:
        self.left = left
        self.operator = operator
        self.right = right

class GetAttrExpression:
    """Node that represents accessing an attribute from an object"""

    obj: str
    name: str

    def __init__(self, obj: str, name: str) -> None:
        self.obj = obj
        self.name = name

class VariableNameExpression:
    """Node that represents reading the value from a variable"""

    name: str

    def __init__(self, name: str) -> None:
        self.name = name

class AssignmentStatement:
    """Node that represents assigning a value to a variable"""

    name: str
    rvalue: ExpressionType

    def __init__(self, name: str, rvalue: ExpressionType) -> None:
        self.name = name
        self.rvalue = rvalue

# This is a bit different to a normal assignment, as it affects
# DB tables and not just local variables
class SetAttrStatement:
    """Node that represents setting the attribute of an entity"""

    obj: str
    name: str
    rvalue: ExpressionType

    def __init__(self, obj: str, name: str, rvalue: ExpressionType) -> None:
        self.obj = obj
        self.name = name
        self.rvalue = rvalue

class OutputStatement:
    """Node that represents sending data to a physical output"""
    # TODO: allow sending other kinds of resources, such as audio or text stored elsewhere, not just text embedded in the action
    # TODO: allow combining text with values (string concatenation or interpolation), so we can send stuff like "The player's name is ${player.name}"

    output: str
    resource: ExpressionType

    def __init__(self, name: str, resource: ExpressionType) -> None:
        self.name = name
        self.resource = resource
