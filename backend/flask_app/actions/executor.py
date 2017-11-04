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

from functools import wraps
from typing import List

import requests

from . import nodes
from .nodes import (
    CompoundStatement,
    IfElseStatement,
    PrintStatement,
    SetAttrStatement,
    AssignmentStatement,
    OutputStatement,
    BinaryOp,
    BooleanLiteral,
    IntegerLiteral,
    StringLiteral,
    GetAttrExpression,
    VariableNameExpression,
)
from .visitor import Visitor
from .. import data_access


class Logger:
    _INDENT_WIDTH = 4

    def __init__(self):
        self.indent = -1

    def log(self, string):
        indent = ' ' * self._INDENT_WIDTH * self.indent
        print(indent, string, sep='')

    def __enter__(self):
        self.indent += 1
        return self

    def __exit__(self, ex_type, ex_value, ex_traceback):
        self.indent -= 1
        return False


# Some globals and a decorator to make it easy to
# print a pretty trace of the program execution
logger = Logger()
log = logger.log


def logging(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        with logger:
            return f(*args, **kwargs)

    return wrapper


class Executor(Visitor):
    def __init__(self, db: data_access.Database):
        super().__init__()

        self.db = db

        # Basic symbol table just for variables
        self.variables = {}

    def visit_compound_statement(self, node: CompoundStatement):
        for statement in node.statements:
            self.visit_statement(statement)

    def visit_if_else_statement(self, node: IfElseStatement):
        condition_value = self.visit_expression(node.condition)
        if condition_value == True:
            log("If Branch")
            self.visit_statement(node.if_body)
        else:
            log("Else Branch")
            self.visit_statement(node.else_body)

    def visit_print_statement(self, node: PrintStatement):
        string = self.visit_expression(node.expression)
        log(string)

    def visit_assignment_statement(self, node: AssignmentStatement):
        value = self.visit_expression(node.rvalue)

        if node.name in self.variables:
            # don't allow shadowing / updating
            raise ValueError("variable '{}' already exists".format(node.name))

        self.variables[node.name] = value

    def visit_set_attr_statement(self, node: SetAttrStatement):
        # XXX: Abusing the variable name system to store object references
        entity_id = self.visit_expression(
            VariableNameExpression(name=node.obj)
        )

        instance = self.db.get_instance_entity(entity_id)

        properties = instance.get_properties()
        if node.name not in properties:
            raise AttributeError("no attribute '{}'".format(node.name))

        value = self.visit_expression(node.rvalue)

        self.db.set_instance_entity_property(instance, node.name, value)

    def visit_output_statement(self, node: OutputStatement):
        # TODO: we actually want to reference a *virtual output*, which maps to a physical output, which maps to the device to send to.
        device_id = int(node.output)
        resource = self.visit_expression(node.resource)

        device = self.db.get_device_by_id(device_id)
        if device is None:
            raise ValueError("no device with id '{}'".format(device_id))

        ip_address = device.ip

        # FIXME: this should be done async
        url = 'http://{}'.format(ip_address)
        print("Sending output to {}: {}".format(url, resource))
        r = requests.post(url, data={'key': resource})

    @logging
    def visit_statement(self, node: nodes.StatementType):
        """Execute a statement"""

        log(type(node).__name__)

        super().visit_statement(node)

    def visit_get_attr_expression(self, node: GetAttrExpression):
        # XXX: Abusing the variable name system to store object references
        entity_id = self.visit_expression(
            VariableNameExpression(name=node.obj)
        )

        instance = self.db.get_instance_entity(entity_id)

        properties = instance.get_properties()
        if node.name not in properties:
            raise AttributeError("no attribute '{}'".format(node.name))

        return properties[node.name]

    def visit_variable_name_expression(self, node: VariableNameExpression):
        if node.name not in self.variables:
            raise ValueError("variable '{}' does not exist".format(node.name))

        return self.variables[node.name]

    def visit_boolean_literal(self, node: BooleanLiteral):
        return node.value

    def visit_integer_literal(self, node: IntegerLiteral):
        return node.value

    def visit_string_literal(self, node: StringLiteral):
        return node.value

    def visit_binary_op(self, node: BinaryOp):
        import operator
        operations = {
            nodes.Operator.ADD: operator.add,
            nodes.Operator.MULT: operator.mul,
            nodes.Operator.SUB: operator.sub,
            nodes.Operator.MOD: operator.mod,
            nodes.Operator.LT: operator.lt,
            nodes.Operator.LE: operator.le,
            nodes.Operator.EQ: operator.eq,
            nodes.Operator.NE: operator.ne,
            nodes.Operator.GE: operator.ge,
            nodes.Operator.GT: operator.gt,
            nodes.Operator.LOGICAL_OR: lambda a, b: any([a, b]),
            nodes.Operator.LOGICAL_AND: lambda a, b: all([a, b]),
        }
        operation = operations.get(node.operator)
        if operation is None:
            raise ValueError("Unsupported operator for BinaryOP: {}".format(node.operator))

        left = self.visit_expression(node.left)
        right = self.visit_expression(node.right)
        value = operation(left, right)
        return value

    @logging
    def visit_expression(self, node: nodes.ExpressionType):
        """Evaluate an expression"""

        log(type(node).__name__)
        return super().visit_expression(node)
