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

from flask_app import model
from flask_app import schema
from flask_app.data_access import Database

from flask_app.actions import nodes
from flask_app.actions.nodes import (
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
from flask_app.actions import unparser

def add_devices(db):

    headset_model = model.DeviceModel(
        name="headset model 1",
        type=model.DeviceTypes.Headset,
        part_name="Plantronics Voyager 5200",
        description="headset description 1",
    )
    scanner_model = model.DeviceModel(
        name="scanner model 1",
        type=model.DeviceTypes.Scanner,
        part_name="Scanner 5200",
        description="scanner description 1",
    )

    device_models = [
        headset_model,
        scanner_model,
    ]

    for device_model in device_models:
        db.add_model(device_model)

    scanner_device_1 = model.PhysicalDevice(
        id="1",
        model_id=scanner_model.id,
        ip="10.0.0.1",
        purpose="rfid reader",
    )

    scanner_device_2 = model.PhysicalDevice(
        id="2",
        model_id=scanner_model.id,
        ip="10.0.0.2",
        purpose="rfid reader",
    )

    emics_device = model.PhysicalDevice(
        id="3",
        model_id=headset_model.id,
        ip="10.0.0.3",
        purpose="emic text to speech",
    )

    devices = [
        scanner_device_1,
        scanner_device_2,
        emics_device,
    ]

    for device in devices:
        db.add_device(device)

    emics_output = model.DeviceOutput(
        device_id=emics_device.id,
        type=model.OutputTypes.Text2Speech,
        name="emics",
        description="output description 1",
    )

    outputs = [
        emics_output
    ]

    for output in outputs:
        db.add_output(output)

    rfid_input = model.DeviceInput(
        device_id=scanner_device_1.id,
        type=model.InputTypes.Rfid,
        name="rfid",
        description="input description 1",
    )
    inputs = [
        rfid_input,
    ]

    for input in inputs:
        db.add_input(input)

    speaker_virtual_output = model.VirtualOutput(
        name="Speaker",
        device_output=emics_output
    )
    db.add_virtual_output(speaker_virtual_output)

    monitor_virtual_output = model.VirtualOutput(
        name="Monitor",
        device_output=emics_output
    )
    db.add_virtual_output(monitor_virtual_output)

    return devices

def add_scenes(db):
    scenes = [
        model.Scene(name="Scene 0", description="description"),
        model.Scene(name="Scene 1", description="description"),
        model.Scene(name="Scene 2", description="description"),
    ]

    for scene in scenes:
        db.add_scene(scene)

    return scenes

def add_entities(db):
    player_entity = model.VirtualEntity(title="Player", description="player")
    card_entity = model.VirtualEntity(title="Card", description="card")
    greeting_tag_entity = model.VirtualEntity(title="GreetingTag", description="scan to hear pitch")
    wand_entity = model.VirtualEntity(title="Wand", description="For casting spells")
    trainer_wand_entity = model.VirtualEntity(title="TrainingWand", description="For finding cast points")

    entities = [
        player_entity,
        card_entity,
        greeting_tag_entity,
        wand_entity,
        trainer_wand_entity,
    ]

    for entity in entities:
        db.add_virtual_entity(entity)

    attributes = {
        player_entity: [
            schema.Property("name", schema.String()),
            schema.Property("counter", schema.Numeric(type=schema.NumericType.Integer)),
            schema.Property("card", schema.Numeric(type=schema.NumericType.Integer)),
        ],

        card_entity: [
            schema.Property("value", schema.Numeric(type=schema.NumericType.Integer)),
            schema.Property("name", schema.String()),
        ],
        greeting_tag_entity: [
        ],
        wand_entity: [
            schema.Property("previousCast", schema.String()),
            schema.Property("temp1", schema.Numeric(type=schema.NumericType.Integer)),
            schema.Property("temp2", schema.Numeric(type=schema.NumericType.Integer)),
            schema.Property("temp3", schema.Numeric(type=schema.NumericType.Integer)),
            schema.Property("ill1", schema.Numeric(type=schema.NumericType.Integer)),
            schema.Property("ill2", schema.Numeric(type=schema.NumericType.Integer)),
            schema.Property("ill3", schema.Numeric(type=schema.NumericType.Integer)),
            schema.Property("ench1", schema.Numeric(type=schema.NumericType.Integer)),
            schema.Property("ench2", schema.Numeric(type=schema.NumericType.Integer)),
            schema.Property("ench3", schema.Numeric(type=schema.NumericType.Integer)),
            schema.Property("charged", schema.Numeric(type=schema.NumericType.Integer)),
        ],
        trainer_wand_entity: [
            schema.Property("castle", schema.Numeric(type=schema.NumericType.Integer)),
            schema.Property("cathedral", schema.Numeric(type=schema.NumericType.Integer)),
            schema.Property("train", schema.Numeric(type=schema.NumericType.Integer)),
            schema.Property("ship", schema.Numeric(type=schema.NumericType.Integer)),
            schema.Property("complete", schema.Numeric(type=schema.NumericType.Integer)),
        ],
    }

    for entity, attributes in attributes.items():
        for attribute in attributes:
            db.add_virtual_entity_property(entity, attribute)


    player1_instance = model.InstanceEntity(virtual_entity=player_entity, tag="RFID#player1")
    db.add_instance_entity(player1_instance)
    db.set_instance_entity_property(player1_instance, "name", "Player 1")
    db.set_instance_entity_property(player1_instance, "counter", 0)
    db.set_instance_entity_property(player1_instance, "card", -1)

    player2_instance = model.InstanceEntity(virtual_entity=player_entity, tag="RFID#player2")
    db.add_instance_entity(player2_instance)
    db.set_instance_entity_property(player2_instance, "name", "Player 2")
    db.set_instance_entity_property(player2_instance, "counter", 0)
    db.set_instance_entity_property(player2_instance, "card", -1)

    ROCK = 0
    PAPER = 1
    SCISSORS = 2

    names = {
        ROCK: "rock",
        PAPER: "paper",
        SCISSORS: "scissors",
    }

    # TODO: add the real RFID tags here!
    rfid_tags = {
        (ROCK, 1): "4C00B2E29A86",
        (ROCK, 2): "82003C7375B8",
        (PAPER, 1): "4C00B3F8C8CF",
        (PAPER, 2): "82003C9D290A",
        (SCISSORS, 1): "7C0019CBA10F",
        (SCISSORS, 2): "7C0056A3B039",
    }

    for card_type in [ROCK, PAPER, SCISSORS]:
        card_name = names[card_type]
        for i in range(1, 3):
            tag = rfid_tags[card_type, i]
            card_instance = model.InstanceEntity(virtual_entity=card_entity, tag=tag)
            db.add_instance_entity(card_instance)
            db.set_instance_entity_property(card_instance, "value", card_type)
            db.set_instance_entity_property(card_instance, "name", card_name)

    greeting_tag_instance = model.InstanceEntity(virtual_entity=greeting_tag_entity, tag="RFID#greeting_tag") # TODO: add the real greeting tag ID!
    db.add_instance_entity(greeting_tag_instance)

    return entities

def add_actions(db):
    speaker_virtual_output_id = 1 # FIXME: don't hardcode this

    setup = [
        AssignmentStatement(
            name="__PLAYER1__",
            rvalue=IntegerLiteral(1), # FIXME: hardcoding instance ID of Player1
        ),
        AssignmentStatement(
            name="__PLAYER2__",
            rvalue=IntegerLiteral(2), #FIXME: hardcoding instance ID of Player2
        ),
    ]

    get_card_name = lambda playerCard, cardName: [
        IfElseStatement(
            condition=BinaryOp(
                left=VariableNameExpression(name=playerCard),
                operator=nodes.Operator.EQ,
                right=IntegerLiteral(0),
            ),
            if_body=AssignmentStatement(
                name=cardName,
                rvalue=StringLiteral("ROCK"),
            ),
            else_body=IfElseStatement(
                condition=BinaryOp(
                    left=VariableNameExpression(name=playerCard),
                    operator=nodes.Operator.EQ,
                    right=IntegerLiteral(1),
                ),
                if_body=AssignmentStatement(
                    name=cardName,
                    rvalue=StringLiteral("PAPER"),
                ),
                else_body=AssignmentStatement(
                    name=cardName,
                    rvalue=StringLiteral("SCISSORS"),
                ),
            ),
        ),
    ]

    calculate_winner = [
        # p1Card := Player1.card
        AssignmentStatement(
            name="p1Card",
            rvalue=GetAttrExpression(
                obj="__PLAYER1__",
                name="card",
            )
        ),
        # p2Card := Player2.card
        AssignmentStatement(
            name="p2Card",
            rvalue=GetAttrExpression(
                obj="__PLAYER2__",
                name="card",
            )
        ),
        IfElseStatement(
            # If p1Card == -1 or p2Card == -1 then wait for both players to scan
            condition=BinaryOp(
                left=BinaryOp(
                    left=VariableNameExpression(name="p1Card"),
                    operator=nodes.Operator.EQ,
                    right=IntegerLiteral(-1),
                ),
                operator=nodes.Operator.LOGICAL_OR,
                right=BinaryOp(
                    left=VariableNameExpression(name="p2Card"),
                    operator=nodes.Operator.EQ,
                    right=IntegerLiteral(-1),
                ),
            ),
            if_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral(">>> Waiting for players...")),
            ]),
            else_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral(">>> Calculating winner")),
                # winner := (p1Card - p2Card) % 3
                # Thank Taz for the math :D
                AssignmentStatement(
                    name="winner",
                    rvalue=BinaryOp(
                        left=BinaryOp(
                            left=VariableNameExpression(name="p1Card"),
                            operator=nodes.Operator.SUB,
                            right=VariableNameExpression(name="p2Card"),
                        ),
                        operator=nodes.Operator.MOD,
                        right=IntegerLiteral(3)
                    ),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=VariableNameExpression(name="winner"),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(1), # 1 -> Player 1 wins
                    ),
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral(">>> Player 1 Wins!!!")),
                        AssignmentStatement(
                            name="winnerAnnounce",
                            rvalue=StringLiteral("Player 1 wins"),
                        ),
                    ]),
                    else_body=IfElseStatement(
                        condition=BinaryOp(
                            left=VariableNameExpression(name="winner"),
                            operator=nodes.Operator.EQ,
                            right=IntegerLiteral(2), # 2 -> Player 2 wins
                        ),
                        if_body=CompoundStatement(statements=[
                            PrintStatement(StringLiteral(">>> Player 2 Wins!!!")),
                            AssignmentStatement(
                                name="winnerAnnounce",
                                rvalue=StringLiteral("Player 2 wins"),
                            ),
                        ]),
                        else_body=CompoundStatement(statements=[
                            PrintStatement(StringLiteral(">>> DRAW!!!")),
                            AssignmentStatement(
                                name="winnerAnnounce",
                                rvalue=StringLiteral("It was a draw, play again"),
                            ),
                        ]),
                    ),
                ),

                # Copy in statements to calculate the card name
                *get_card_name("p1Card", "p1CardName"),
                *get_card_name("p2Card", "p2CardName"),

                AssignmentStatement(
                    name="outputString",
                    rvalue=BinaryOp(
                        left=StringLiteral("Player 1 played "),
                        operator=nodes.Operator.ADD,
                        right=BinaryOp(
                            left=VariableNameExpression("p1CardName"),
                            operator=nodes.Operator.ADD,
                            right=BinaryOp(
                                left=StringLiteral(" and player 2 played "),
                                operator=nodes.Operator.ADD,
                                right=BinaryOp(
                                    left=VariableNameExpression("p2CardName"),
                                    operator=nodes.Operator.ADD,
                                    right=BinaryOp(
                                        left=StringLiteral(" and "),
                                        operator=nodes.Operator.ADD,
                                        right=VariableNameExpression("winnerAnnounce")
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),

                PrintStatement(VariableNameExpression(name="outputString")),

                OutputStatement(
                    output=speaker_virtual_output_id,
                    resource=VariableNameExpression(name="outputString"),
                ),

                # Reset Player1.card := -1
                SetAttrStatement(
                    obj="__PLAYER1__",
                    name="card",
                    rvalue=IntegerLiteral(-1),
                ),
                # Reset Player2.card := -1
                SetAttrStatement(
                    obj="__PLAYER2__",
                    name="card",
                    rvalue=IntegerLiteral(-1),
                ),
            ]),
        ),
    ]

    rps1 = CompoundStatement(statements=[
        # Copy in setup statements
        *setup,

        # Print Player1.name
        PrintStatement(
            expression=GetAttrExpression(
                obj="__PLAYER1__",
                name="name",
            )
        ),
        # Set Player1.card := __INPUT__.num
        SetAttrStatement(
            obj="__PLAYER1__",
            name="card",
            rvalue=GetAttrExpression(
                obj="__INPUT__",
                name="value",
            )
        ),

        # Copy in statements to calculate the winner
        *calculate_winner,
    ])

    rps2 = CompoundStatement(statements=[
        # Copy in setup statements
        *setup,

        # Print Player2.name
        PrintStatement(
            expression=GetAttrExpression(
                obj="__PLAYER2__",
                name="name",
            )
        ),
        # Set Player2.card = __INPUT__.num
        SetAttrStatement(
            obj="__PLAYER2__",
            name="card",
            rvalue=GetAttrExpression(
                obj="__INPUT__",
                name="value",
            )
        ),

        # Copy in statements to calculate the winner
        *calculate_winner,
    ])

    greeting = """
Welcome to real engine, the video game engine for the real world.

We are six UQ students who've created an offline web application that manages communication between different hardware devices and allows the creation of complex live action role playing games using our intuitive user interface.

It currently supports RFID scanners as input and text to speech bluetooth audio output.
Once devices are connected the game "architect" can add their game logic by defining object entities within their game and then define which hardware inputs trigger which actions.
Conditions can be added to your actions in case you want the action to be determined and not happen all the time.

Our clients include larping, art galleries, museums and even small businesses who want a unique marketing method.
Our system is unique as it allows everyday people to design the logic behind the actions, you don’t need to be a software engineer to program our system as the UI simplifies everything for you.
    """.strip()

    greeting_ast = CompoundStatement(statements=[
        OutputStatement(
            output=speaker_virtual_output_id,
            resource=StringLiteral('greeting'),
        )
    ])
    wand_cast_ast = CompoundStatement(statements=[
    # if charged
        IfElseStatement(
            condition=BinaryOp(
                left=GetAttrExpression(
                obj="__INPUT__",
                name="charged",
            ),
                operator=nodes.Operator.EQ,
                right=IntegerLiteral(1),
            ),
            # -> Wand is charged play spell
            if_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Casting Spell temp1")),
                # if spell = 2, output sound and set spell 1
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="temp1",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell")),
                        OutputStatement(
                            output=speaker_virtual_output_id,
                            resource=StringLiteral("Playaudio: 1"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="temp1",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not temp1")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="temp2",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell temp2")),
                        OutputStatement(
                            output=speaker_virtual_output_id,
                            resource=StringLiteral("Playaudio: 1"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="temp2",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not temp2")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="temp3",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell temp3")),
                        OutputStatement(
                            output=speaker_virtual_output_id,
                            resource=StringLiteral("Playaudio: 1"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="temp3",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not temp3")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="il1",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ill1")),
                        OutputStatement(
                            output=speaker_virtual_output_id,
                            resource=StringLiteral("Playaudio: 1"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ill1",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ill1")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ill2",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ill2")),
                        OutputStatement(
                            output=speaker_virtual_output_id,
                            resource=StringLiteral("Playaudio: 1"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ill2",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ill2")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ill3",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ill3")),
                        OutputStatement(
                            output=speaker_virtual_output_id,
                            resource=StringLiteral("Playaudio: 1"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ill3",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ill3")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ench1",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ench1")),
                        OutputStatement(
                            output=speaker_virtual_output_id,
                            resource=StringLiteral("Playaudio: 1"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ench1",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ench1")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ench2",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ench2")),
                        OutputStatement(
                            output=speaker_virtual_output_id,
                            resource=StringLiteral("Playaudio: 1"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ench2",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ench2")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ench3",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ench3")),
                        OutputStatement(
                            output=speaker_virtual_output_id,
                            resource=StringLiteral("Playaudio: 1"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ench3",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ench3")),

                    ]),
                ),
                # Take away charge
                SetAttrStatement(
                    obj="__INPUT__",
                    name="charged",
                    rvalue=IntegerLiteral(0),
                ),
            ]),
            # -> Wand is empty
            else_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Wand is not charged")),
                OutputStatement(
                    output=speaker_virtual_output_id,
                    resource=StringLiteral("Playaudio: 1"),
                ),
            ]),
        ),
    ])

    charge_wand_temp1 = CompoundStatement(statements=[
        # if not already charged
        IfElseStatement(
            condition=BinaryOp(
                left=GetAttrExpression(
                    obj="__INPUT__",
                    name="charged",
                ),
                operator=nodes.Operator.EQ,
                right=IntegerLiteral(0),
            ),
            # -> Wand is not charged
            if_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Charging Spell temp1")),
                # output sound and set spell = 2
                PrintStatement(StringLiteral("Charging Wand")),
                OutputStatement(
                    output=speaker_virtual_output_id,
                    resource=GetAttrExpression(
                        obj="__INPUT__",
                        name="previousCast",
                    ),
                ),
                SetAttrStatement(
                    obj="__INPUT__",
                    name="temp1",
                    rvalue=IntegerLiteral(2),
                ),
            ]),
            # -> Wand is already charged
            else_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Wand is already charged")),
                OutputStatement(
                    output=speaker_virtual_output_id,
                    resource=StringLiteral("Playaudio: wand is already charged"),
                ),
            ]),
        ),
    ])

    charge_wand_temp2 = CompoundStatement(statements=[
        # if not already charged
        IfElseStatement(
            condition=BinaryOp(
                left=GetAttrExpression(
                    obj="__INPUT__",
                    name="charged",
                ),
                operator=nodes.Operator.EQ,
                right=IntegerLiteral(0),
            ),
            # -> Wand is not charged check predecessors
            if_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Charging Spell temp2")),
                # output sound and set spell = 2
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="temp1",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(1),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Charging Wand")),
                        OutputStatement(
                            output=speaker_virtual_output_id,
                            resource=GetAttrExpression(
                                obj="__INPUT__",
                                name="previousCast",
                            ),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="temp2",
                            rvalue=IntegerLiteral(2),
                        ),
                    ]),
                    # -> Not ready for this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ready for this spell")),
                        OutputStatement(
                            output=speaker_virtual_output_id,
                            resource=StringLiteral("Playaudio: not ready for this spell"),
                        ),
                    ]),
                ),
            ]),
            # -> Wand is already charged
            else_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Wand is already charged")),
                OutputStatement(
                    output=speaker_virtual_output_id,
                    resource=StringLiteral("Playaudio: wand is already charged"),
                ),
            ]),
        ),
    ])

    charge_wand_temp3 = CompoundStatement(statements=[
        # if not already charged
        IfElseStatement(
            condition=BinaryOp(
                left=GetAttrExpression(
                    obj="__INPUT__",
                    name="charged",
                ),
                operator=nodes.Operator.EQ,
                right=IntegerLiteral(0),
            ),
            # -> Wand is not charged check predecessors
            if_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Charging Spell temp3")),
                # if spell = 2, output sound and set spell 1
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="temp2",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(1),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Charging Wand")),
                        OutputStatement(
                            output=speaker_virtual_output_id,
                            resource=GetAttrExpression(
                                obj="__INPUT__",
                                name="previousCast",
                            ),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="temp3",
                            rvalue=IntegerLiteral(2),
                        ),
                    ]),
                    # -> Not ready for this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ready for this spell")),
                        OutputStatement(
                            output=speaker_virtual_output_id,
                            resource=StringLiteral("Playaudio: not ready for this spell"),
                        ),
                    ]),
                ),
            ]),
            # -> Wand is already charged
            else_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Wand is already charged")),
                OutputStatement(
                    output=speaker_virtual_output_id,
                    resource=StringLiteral("Playaudio: wand is already charged"),
                ),
            ]),
        ),
    ])

    charge_wand_ill1 = CompoundStatement(statements=[
        # if not already charged
        IfElseStatement(
            condition=BinaryOp(
                left=GetAttrExpression(
                    obj="__INPUT__",
                    name="charged",
                ),
                operator=nodes.Operator.EQ,
                right=IntegerLiteral(0),
            ),
            # -> Wand is not charged
            if_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Charging Spell ill1")),
                # output sound and set spell = 2
                PrintStatement(StringLiteral("Charging Wand")),
                OutputStatement(
                    output=speaker_virtual_output_id,
                    resource=GetAttrExpression(
                        obj="__INPUT__",
                        name="previousCast",
                    ),
                ),
                SetAttrStatement(
                    obj="__INPUT__",
                    name="ill1",
                    rvalue=IntegerLiteral(2),
                ),
            ]),
            # -> Wand is already charged
            else_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Wand is already charged")),
                OutputStatement(
                    output=speaker_virtual_output_id,
                    resource=StringLiteral("Playaudio: wand is already charged"),
                ),
            ]),
        ),
    ])

    charge_wand_ill2 = CompoundStatement(statements=[
        # if not already charged
        IfElseStatement(
            condition=BinaryOp(
                left=GetAttrExpression(
                    obj="__INPUT__",
                    name="charged",
                ),
                operator=nodes.Operator.EQ,
                right=IntegerLiteral(0),
            ),
            # -> Wand is not charged check predecessors
            if_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Charging Spell ill2")),
                # output sound and set spell = 2
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ill1",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(1),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Charging Wand")),
                        OutputStatement(
                            output=speaker_virtual_output_id,
                            resource=GetAttrExpression(
                                obj="__INPUT__",
                                name="previousCast",
                            ),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ill2",
                            rvalue=IntegerLiteral(2),
                        ),
                    ]),
                    # -> Not ready for this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ready for this spell")),
                        OutputStatement(
                            output=speaker_virtual_output_id,
                            resource=StringLiteral("Playaudio: not ready for this spell"),
                        ),
                    ]),
                ),
            ]),
            # -> Wand is already charged
            else_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Wand is already charged")),
                OutputStatement(
                    output=speaker_virtual_output_id,
                    resource=StringLiteral("Playaudio: wand is already charged"),
                ),
            ]),
        ),
    ])

    charge_wand_ill3 = CompoundStatement(statements=[
        # if not already charged
        IfElseStatement(
            condition=BinaryOp(
                left=GetAttrExpression(
                    obj="__INPUT__",
                    name="charged",
                ),
                operator=nodes.Operator.EQ,
                right=IntegerLiteral(0),
            ),
            # -> Wand is not charged check predecessors
            if_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Charging Spell ill3")),
                # if spell = 2, output sound and set spell 1
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ill2",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(1),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Charging Wand")),
                        OutputStatement(
                            output=speaker_virtual_output_id,
                            resource=GetAttrExpression(
                                obj="__INPUT__",
                                name="previousCast",
                            ),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ill3",
                            rvalue=IntegerLiteral(2),
                        ),
                    ]),
                    # -> Not ready for this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ready for this spell")),
                        OutputStatement(
                            output=speaker_virtual_output_id,
                            resource=StringLiteral("Playaudio: not ready for this spell"),
                        ),
                    ]),
                ),
            ]),
            # -> Wand is already charged
            else_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Wand is already charged")),
                OutputStatement(
                    output=speaker_virtual_output_id,
                    resource=StringLiteral("Playaudio: wand is already charged"),
                ),
            ]),
        ),
    ])

    charge_wand_ench1 = CompoundStatement(statements=[
        # if not already charged
        IfElseStatement(
            condition=BinaryOp(
                left=GetAttrExpression(
                    obj="__INPUT__",
                    name="charged",
                ),
                operator=nodes.Operator.EQ,
                right=IntegerLiteral(0),
            ),
            # -> Wand is not charged
            if_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Charging Spell ench1")),
                # output sound and set spell = 2
                PrintStatement(StringLiteral("Charging Wand")),
                OutputStatement(
                    output=speaker_virtual_output_id,
                    resource=GetAttrExpression(
                        obj="__INPUT__",
                        name="previousCast",
                    ),
                ),
                SetAttrStatement(
                    obj="__INPUT__",
                    name="ench1",
                    rvalue=IntegerLiteral(2),
                ),
            ]),
            # -> Wand is already charged
            else_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Wand is already charged")),
                OutputStatement(
                    output=speaker_virtual_output_id,
                    resource=StringLiteral("Playaudio: wand is already charged"),
                ),
            ]),
        ),
    ])

    charge_wand_ench2 = CompoundStatement(statements=[
        # if not already charged
        IfElseStatement(
            condition=BinaryOp(
                left=GetAttrExpression(
                    obj="__INPUT__",
                    name="charged",
                ),
                operator=nodes.Operator.EQ,
                right=IntegerLiteral(0),
            ),
            # -> Wand is not charged check predecessors
            if_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Charging Spell ench2")),
                # output sound and set spell = 2
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ench1",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(1),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Charging Wand")),
                        OutputStatement(
                            output=speaker_virtual_output_id,
                            resource=GetAttrExpression(
                                obj="__INPUT__",
                                name="previousCast",
                            ),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ench2",
                            rvalue=IntegerLiteral(2),
                        ),
                    ]),
                    # -> Not ready for this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ready for this spell")),
                        OutputStatement(
                            output=speaker_virtual_output_id,
                            resource=StringLiteral("Playaudio: not ready for this spell"),
                        ),
                    ]),
                ),
            ]),
            # -> Wand is already charged
            else_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Wand is already charged")),
                OutputStatement(
                    output=speaker_virtual_output_id,
                    resource=StringLiteral("Playaudio: wand is already charged"),
                ),
            ]),
        ),
    ])

    charge_wand_ench3 = CompoundStatement(statements=[
        # if not already charged
        IfElseStatement(
            condition=BinaryOp(
                left=GetAttrExpression(
                    obj="__INPUT__",
                    name="charged",
                ),
                operator=nodes.Operator.EQ,
                right=IntegerLiteral(0),
            ),
            # -> Wand is not charged check predecessors
            if_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Charging Spell ench3")),
                # if spell = 2, output sound and set spell 1
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ench2",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(1),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Charging Wand")),
                        OutputStatement(
                            output=speaker_virtual_output_id,
                            resource=GetAttrExpression(
                                obj="__INPUT__",
                                name="previousCast",
                            ),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ench3",
                            rvalue=IntegerLiteral(2),
                        ),
                    ]),
                    # -> Not ready for this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ready for this spell")),
                        OutputStatement(
                            output=speaker_virtual_output_id,
                            resource=StringLiteral("Playaudio: not ready for this spell"),
                        ),
                    ]),
                ),
            ]),
            # -> Wand is already charged
            else_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Wand is already charged")),
                OutputStatement(
                    output=speaker_virtual_output_id,
                    resource=StringLiteral("Playaudio: wand is already charged"),
                ),
            ]),
        ),
    ])

    found_castle = CompoundStatement(statements=[
        SetAttrStatement(
            obj="__INPUT__",
            name="castle",
            rvalue=IntegerLiteral(1),
        ),
    ])

    found_ship = CompoundStatement(statements=[
        SetAttrStatement(
            obj="__INPUT__",
            name="ship",
            rvalue=IntegerLiteral(1),
        ),
    ])

    found_cathedral = CompoundStatement(statements=[
        SetAttrStatement(
            obj="__INPUT__",
            name="cathedral",
            rvalue=IntegerLiteral(1),
        ),
    ])

    found_train = CompoundStatement(statements=[
        SetAttrStatement(
            obj="__INPUT__",
            name="train",
            rvalue=IntegerLiteral(1),
        ),
    ])

    check_training_complete = CompoundStatement(statements=[
        IfElseStatement(
            # If p1Card == -1 or p2Card == -1 then wait for both players to scan
            condition=BinaryOp(
                left=BinaryOp(
                    left=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="castle",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(1),
                    ),
                    operator=nodes.Operator.LOGICAL_AND,
                    right=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ship",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(1),
                    ),
                ),
                operator=nodes.Operator.LOGICAL_AND,
                right=BinaryOp(
                    left=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="train",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(1),
                    ),
                    operator=nodes.Operator.LOGICAL_AND,
                    right=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="cathedral",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(1),
                    ),
                ),
            ),
            if_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral(">>> Waiting for players...")),
            ]),
            else_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral(">>> Calculating winner")),

                # Reset Player2.card := -1
                SetAttrStatement(
                    obj="__INPUT__",
                    name="complete",
                    rvalue=IntegerLiteral(1),
                ),
            ]),
        ),
    ])

    rps1_str = unparser.to_json(rps1)
    rps2_str = unparser.to_json(rps2)
    greeting_ast_str = unparser.to_json(greeting_ast)
    wand_cast_str = unparser.to_json(wand_cast_ast)
    charge_temp1_str = unparser.to_json(charge_wand_temp1)
    charge_temp2_str = unparser.to_json(charge_wand_temp2)
    charge_temp3_str = unparser.to_json(charge_wand_temp3)
    charge_ill1_str = unparser.to_json(charge_wand_ill1)
    charge_ill2_str = unparser.to_json(charge_wand_ill2)
    charge_ill3_str = unparser.to_json(charge_wand_ill3)
    charge_ench1_str = unparser.to_json(charge_wand_ench1)
    charge_ench2_str = unparser.to_json(charge_wand_ench2)
    charge_ench3_str = unparser.to_json(charge_wand_ench3)
    found_ship_str = unparser.to_json(found_ship)
    found_cathedral_str = unparser.to_json(found_cathedral)
    found_train_str = unparser.to_json(found_train)
    found_castle_str = unparser.to_json(found_castle)
    check_training_complete_str = unparser.to_json(check_training_complete)

    player_entity = db.get_virtual_entity_by_name(name="Player")
    card_entity = db.get_virtual_entity_by_name(name="Card")
    greeting_tag_entity = db.get_virtual_entity_by_name(name="GreetingTag")
    wand_entity = db.get_virtual_entity_by_name(name="Wand")
    training_wand_entity = db.get_virtual_entity_by_name(name="TrainingWand")

    actions = [
        model.Action(name="Rock-Paper-Scissors (Player 1)", ast=rps1_str, wants_entity=card_entity),
        model.Action(name="Rock-Paper-Scissors (Player 2)", ast=rps2_str, wants_entity=card_entity),
        model.Action(name="Greeting", ast=greeting_ast_str, wants_entity=greeting_tag_entity),
        model.Action(name="Cast Spell", ast=wand_cast_str, wants_entity=wand_entity),
        model.Action(name="Charge temp1", ast=charge_temp1_str, wants_entity=wand_entity),
        model.Action(name="Charge temp2", ast=charge_temp2_str, wants_entity=wand_entity),
        model.Action(name="Charge temp3", ast=charge_temp3_str, wants_entity=wand_entity),
        model.Action(name="Charge ill1", ast=charge_ill1_str, wants_entity=wand_entity),
        model.Action(name="Charge ill2", ast=charge_ill2_str, wants_entity=wand_entity),
        model.Action(name="Charge ill3", ast=charge_ill3_str, wants_entity=wand_entity),
        model.Action(name="Charge ench1", ast=charge_ench1_str, wants_entity=wand_entity),
        model.Action(name="Charge ench2", ast=charge_ench2_str, wants_entity=wand_entity),
        model.Action(name="Charge ench3", ast=charge_ench3_str, wants_entity=wand_entity),
        model.Action(name="Check Training", ast=check_training_complete_str, wants_entity=training_wand_entity),
        model.Action(name="Found Ship", ast=found_ship_str, wants_entity=training_wand_entity),
        model.Action(name="Found Castle", ast=found_castle_str, wants_entity=training_wand_entity),
        model.Action(name="Found Train", ast=found_train_str, wants_entity=training_wand_entity),
        model.Action(name="Found Cathedral", ast=found_cathedral_str, wants_entity=training_wand_entity),

    ]

    for action in actions:
        db.add_action(action)

    return actions


def add_events(db, *, actions, devices, scenes):
    events = [
        model.Event(
            name="Event 1",
            scene_id=scenes[0].id, # FIXME: why do we need this again?
            type=model.EventTypes.scan,
            device_id=devices[0].id,
        ),
        model.Event(
            name="Event 2",
            scene_id=scenes[0].id,
            type=model.EventTypes.scan,
            device_id=devices[1].id,
        ),
    ]

    for event in events:
        db.add_event(event)

    event_actions_list = [
        # Player 1 action
        model.EventActions(event_id=events[0].id, action_id=actions[0].id),

        # Player 2 action
        model.EventActions(event_id=events[1].id, action_id=actions[1].id),

        # Allow scanning the greeting tag on either device
        model.EventActions(event_id=events[0].id, action_id=actions[2].id),
        model.EventActions(event_id=events[1].id, action_id=actions[2].id),
    ]

    for event_actions in event_actions_list:
        db.add_event_action(event_actions)

    return events


if __name__ == '__main__':
    db = Database()

    db.wipe_database()
    db.create_database()

    devices = add_devices(db)
    scenes = add_scenes(db)
    entities = add_entities(db)
    actions = add_actions(db)
    events = add_events(db, actions=actions, devices=devices, scenes=scenes)
