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
Parse JSON representation of the Abstract Syntax Tree into nodes.
"""

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

operators = {
    'ADD': nodes.Operator.ADD,
    'MULT': nodes.Operator.MULT,
    'SUB': nodes.Operator.SUB,
    'MOD': nodes.Operator.MOD,
    'LT': nodes.Operator.LT,
    'LE': nodes.Operator.LE,
    'EQ': nodes.Operator.EQ,
    'NE': nodes.Operator.NE,
    'GE': nodes.Operator.GE,
    'GT': nodes.Operator.GT,
    'LOGICAL_OR': nodes.Operator.LOGICAL_OR,
    'LOGICAL_AND': nodes.Operator.LOGICAL_AND,
}


def operator_from_string(s):
    return operators.get(s)


def from_json(element):
    el_type = element.get('t')

    if el_type == 'CompoundStatement':
        children = element.get('statements')
        statements = []
        for child in children:
            statement = from_json(child)
            statements.append(statement)

        return CompoundStatement(statements=statements)
    elif el_type == 'PrintStatement':
        child = element.get('expression')
        expression = from_json(child)

        return PrintStatement(expression=expression)
    elif el_type == 'IfElseStatement':
        if_body = from_json(element.get('if_body'))
        else_body = from_json(element.get('else_body'))
        condition = from_json(element.get('condition'))

        return IfElseStatement(if_body=if_body, condition=condition, else_body=else_body)
    elif el_type == 'SetAttrStatement':
        obj = element.get('obj')
        name = element.get('name')
        rvalue = from_json(element.get('rvalue'))
        return SetAttrStatement(obj=obj, name=name, rvalue=rvalue)
    elif el_type == 'AssignmentStatement':
        name = element.get('name')
        rvalue = from_json(element.get('rvalue'))
        return AssignmentStatement(name=name, rvalue=rvalue)
    elif el_type == 'OutputStatement':
        output = element.get('output')
        resource = from_json(element.get('resource'))
        return OutputStatement(output=output, resource=resource)
    elif el_type == 'StringLiteral':
        value = element.get('value')
        return StringLiteral(value=value)
    elif el_type == 'IntegerLiteral':
        value = element.get('value')
        return IntegerLiteral(value=value)
    elif el_type == 'BooleanLiteral':
        value = element.get('value')
        return BooleanLiteral(value=value)
    elif el_type == 'BinaryOp':
        left_child = from_json(element.get('left'))
        right_child = from_json(element.get('right'))
        operator = operator_from_string(element.get('operator'))
        return BinaryOp(left=left_child, operator=operator, right=right_child)
    elif el_type == 'GetAttrExpression':
        obj = element.get('obj')
        name = element.get('name')
        return GetAttrExpression(obj=obj, name=name)
    elif el_type == 'VariableNameExpression':
        name = element.get('name')
        return VariableNameExpression(name=name)
    else:
        raise ValueError('Unknown node type: {}'.format(el_type))
