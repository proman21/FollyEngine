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
Visitors for the Abstract Syntax Tree.
"""

from abc import ABCMeta, abstractmethod
from typing import (
    Generic,
    List,
    TypeVar,
)

from . import nodes
from .nodes import (
    CompoundStatement,
    IfElseStatement,
    PrintStatement,
    AssignmentStatement,
    SetAttrStatement,
    OutputStatement,
    BinaryOp,
    BooleanLiteral,
    IntegerLiteral,
    StringLiteral,
    GetAttrExpression,
    VariableNameExpression,
)

T = TypeVar('T')


class ExpressionVisitor(Generic[T], metaclass=ABCMeta):

    @abstractmethod
    def visit_boolean_literal(self, node: BooleanLiteral) -> T:
        pass

    @abstractmethod
    def visit_integer_literal(self, node: IntegerLiteral) -> T:
        pass

    @abstractmethod
    def visit_string_literal(self, node: StringLiteral) -> T:
        pass

    @abstractmethod
    def visit_binary_op(self, node: BinaryOp):
        pass

    @abstractmethod
    def visit_get_attr_expression(self, node: GetAttrExpression) -> T:
        pass

    @abstractmethod
    def visit_variable_name_expression(self, node: VariableNameExpression) -> T:
        pass

    def visit_expression(self, node: nodes.ExpressionType) -> T:
        if isinstance(node, BooleanLiteral):
            return self.visit_boolean_literal(node)
        elif isinstance(node, IntegerLiteral):
            return self.visit_integer_literal(node)
        elif isinstance(node, StringLiteral):
            return self.visit_string_literal(node)
        elif isinstance(node, BinaryOp):
            return self.visit_binary_op(node)
        elif isinstance(node, GetAttrExpression):
            return self.visit_get_attr_expression(node)
        elif isinstance(node, VariableNameExpression):
            return self.visit_variable_name_expression(node)
        else:
            raise ValueError("Unknown expression: {}".format(type(node)))


class StatementVisitor(Generic[T], metaclass=ABCMeta):

    @abstractmethod
    def visit_compound_statement(self, node: CompoundStatement) -> T:
        pass

    @abstractmethod
    def visit_if_else_statement(self, node: IfElseStatement) -> T:
        pass

    @abstractmethod
    def visit_print_statement(self, node: PrintStatement) -> T:
        pass

    @abstractmethod
    def visit_assignment_statement(self, node: AssignmentStatement) -> T:
        pass

    @abstractmethod
    def visit_output_statement(self, node: OutputStatement) -> T:
        pass

    @abstractmethod
    def visit_set_attr_statement(self, node: SetAttrStatement) -> T:
        pass

    def visit_statement(self, node: nodes.StatementType) -> T:
        if isinstance(node, CompoundStatement):
            return self.visit_compound_statement(node)
        elif isinstance(node, IfElseStatement):
            return self.visit_if_else_statement(node)
        elif isinstance(node, PrintStatement):
            return self.visit_print_statement(node)
        elif isinstance(node, AssignmentStatement):
            return self.visit_assignment_statement(node)
        elif isinstance(node, SetAttrStatement):
            return self.visit_set_attr_statement(node)
        elif isinstance(node, OutputStatement):
            return self.visit_output_statement(node)
        else:
            raise ValueError("Unknown statement: {}".format(type(node)))


class Visitor(Generic[T], StatementVisitor[T], ExpressionVisitor[T]):
    pass
