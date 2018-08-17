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

import json
from typing import Dict, Any

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


class Unparser(Visitor[Dict[str, Any]]):
    def visit_boolean_literal(self, node: BooleanLiteral):
        return {
            "t": "BooleanLiteral",
            "value": node.value,
        }

    def visit_integer_literal(self, node: IntegerLiteral):
        return {
            "t": "IntegerLiteral",
            "value": node.value,
        }

    def visit_string_literal(self, node: StringLiteral):
        return {
            "t": "StringLiteral",
            "value": node.value,
        }

    def visit_binary_op(self, node: BinaryOp):
        operator = str(node.operator).split('.')[-1] # FIXME
        left = self.visit_expression(node.left)
        right = self.visit_expression(node.right)

        return {
            "t": "BinaryOp",
            "operator": operator,
            "left": left,
            "right": right,
        }

    def visit_get_attr_expression(self, node: GetAttrExpression):
        return {
            "t": "GetAttrExpression",
            "obj": node.obj,
            "name": node.name,
        }

    def visit_variable_name_expression(self, node: VariableNameExpression):
        return {
            "t": "VariableNameExpression",
            "name": node.name,
        }

    def visit_compound_statement(self, node: CompoundStatement):
        statements = [
            self.visit_statement(stmt)
            for stmt in node.statements
        ]

        return {
            "t": "CompoundStatement",
            "statements": statements,
        }

    def visit_if_else_statement(self, node: IfElseStatement):
        condition = self.visit_expression(node.condition)
        if_body = self.visit_statement(node.if_body)
        else_body = self.visit_statement(node.else_body)

        return {
            "t": "IfElseStatement",
            "condition": condition,
            "if_body": if_body,
            "else_body": else_body,
        }

    def visit_print_statement(self, node: PrintStatement):
        expression = self.visit_expression(node.expression)

        return {
            "t": "PrintStatement",
            "expression": expression,
        }

    def visit_set_attr_statement(self, node: SetAttrStatement):
        rvalue = self.visit_expression(node.rvalue)

        return {
            "t": "SetAttrStatement",
            "obj": node.obj,
            "name": node.name,
            "rvalue": rvalue,
        }

    def visit_assignment_statement(self, node: AssignmentStatement):
        rvalue = self.visit_expression(node.rvalue)

        return {
            "t": "AssignmentStatement",
            "name": node.name,
            "rvalue": rvalue,
        }

    def visit_output_statement(self, node: OutputStatement):
        resource = self.visit_expression(node.resource)

        return {
            "t": "OutputStatement",
            "output": node.output,
            "resource": resource,
        }


def to_json(node) -> str:
    unparser = Unparser()
    serializable_ast = unparser.visit_statement(node)
    return json.dumps(serializable_ast)
